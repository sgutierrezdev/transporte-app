import { NextRequest, NextResponse } from "next/server";
import * as XLSX from "xlsx";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type Resumen = {
  personas: { creados: number; errores: string[] };
  grupos: { creados: number; errores: string[] };
  moviles: { creados: number; errores: string[] };
  paradas: { creados: number; errores: string[] };
};

function texto(fila: any, columna: string) {
  const valor = fila[columna];
  return valor === undefined || valor === null ? "" : String(valor).trim();
}

function sinAcentos(s: string) {
  return s.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function normalizarRol(valor: string): string {
  const v = sinAcentos(valor.toUpperCase().trim());
  if (!v) return "SOCIO";
  if (v.includes("ADMIN")) return "ADMIN";
  if (v.includes("JEFE")) return "JEFE_GRUPO"; // "JEFE DE LINEA", "JEFE DE GRUPO", etc.
  if (v.includes("SECRETARI")) return "SECRETARIA";
  if (v.includes("CHOFER") || v.includes("CONDUCTOR")) return "CHOFER";
  if (v.includes("SOCIO")) return "SOCIO";
  return "SOCIO"; // valor no reconocido: se guarda como Socio por defecto
}

function normalizarEstado(valor: string): string {
  const v = sinAcentos(valor.toUpperCase().trim());
  if (!v) return "ACTIVO";
  if (v.includes("LICEN")) return "LICENCIA";
  if (v.includes("INACTIV") || v.includes("PASIV") || v.includes("BAJA")) return "INACTIVO";
  if (v.includes("ACTIV")) return "ACTIVO";
  return "ACTIVO";
}

function parseFecha(valor: any): Date | null {
  if (!valor) return null;
  const fecha = valor instanceof Date ? valor : new Date(valor);
  return isNaN(fecha.getTime()) ? null : fecha;
}

function mensajeError(e: any) {
  if (e?.code === "P2002") {
    const campos = e?.meta?.target?.join?.(", ") ?? "un valor único";
    return `Ya existe un registro con ese ${campos} (revisá duplicados)`;
  }
  return e?.message ?? "Error desconocido";
}

async function idPersonaPorNombre(empresaId: string, nombre: string) {
  if (!nombre) return null;
  const persona = await prisma.persona.findFirst({
    where: { empresaId, nombre: { equals: nombre, mode: "insensitive" } },
  });
  return persona?.id ?? null;
}

async function idGrupoPorNombre(empresaId: string, nombre: string) {
  if (!nombre) return null;
  const grupo = await prisma.grupo.findFirst({
    where: { empresaId, nombre: { equals: nombre, mode: "insensitive" } },
  });
  return grupo?.id ?? null;
}

async function idSubgrupoPorNombres(empresaId: string, grupoNombre: string, subgrupoNombre: string) {
  if (!grupoNombre || !subgrupoNombre) return null;
  const subgrupo = await prisma.subgrupo.findFirst({
    where: {
      nombre: { equals: subgrupoNombre, mode: "insensitive" },
      grupo: { empresaId, nombre: { equals: grupoNombre, mode: "insensitive" } },
    },
  });
  return subgrupo?.id ?? null;
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  const empresaId = (session.user as any).empresaId as string;

  const formData = await req.formData();
  const archivo = formData.get("archivo") as File | null;
  if (!archivo) {
    return NextResponse.json({ error: "No se recibió ningún archivo" }, { status: 400 });
  }

  let workbook: XLSX.WorkBook;
  try {
    const buffer = Buffer.from(await archivo.arrayBuffer());
    workbook = XLSX.read(buffer, { type: "buffer", cellDates: true });
  } catch {
    return NextResponse.json(
      { error: "No se pudo leer el archivo. Verificá que sea un .xlsx válido." },
      { status: 400 }
    );
  }

  const resumen: Resumen = {
    personas: { creados: 0, errores: [] },
    grupos: { creados: 0, errores: [] },
    moviles: { creados: 0, errores: [] },
    paradas: { creados: 0, errores: [] },
  };

  // ---------- Personas (van primero: grupos, móviles y paradas las referencian) ----------
  const hojaPersonas = workbook.Sheets["Personas"];
  if (hojaPersonas) {
    const filas: any[] = XLSX.utils.sheet_to_json(hojaPersonas, { defval: "" });
    filas.for (let i = 0; i < filas.length; i++) {
    const fila = filas[i];s
      if (!nombre) continue;
      try {
        await prisma.persona.create({
          data: {
            empresaId,
            nombre,
            carnet: texto(fila, "Carnet") || null,
            celular: texto(fila, "Celular") || null,
            email: texto(fila, "Correo") || null,
            rol: normalizarRol(texto(fila, "Rol")) as any,
            estado: normalizarEstado(texto(fila, "Estado")) as any,
            fechaIngreso: parseFecha(fila["Fecha de ingreso"]),
          },
        });
        resumen.personas.creados++;
      } catch (e: any) {
        resumen.personas.errores.push(`Fila ${i + 2} (${nombre}): ${mensajeError(e)}`);
      }
    });).
  }

  // ---------- Grupos (cada uno crea sus subgrupos A y B automáticamente) ----------
  const hojaGrupos = workbook.Sheets["Grupos"];
  if (hojaGrupos) {
    const filas: any[] = XLSX.utils.sheet_to_json(hojaGrupos, { defval: "" });
    for (const [i, fila] of filas.entries()) {
      const nombre = texto(fila, "Nombre");
      if (!nombre) continue;
      try {
        const grupo = await prisma.grupo.create({
          data: {
            empresaId,
            nombre,
            subgrupos: { create: [{ nombre: "A" }, { nombre: "B" }] },
          },
        });
        const jefeId = await idPersonaPorNombre(empresaId, texto(fila, "Jefe de linea"));
        if (jefeId) {
          await prisma.jefeGrupoHistorial.create({
            data: { grupoId: grupo.id, jefeId, fechaInicio: new Date(), fechaFin: null },
          });
        }
        resumen.grupos.creados++;
      } catch (e: any) {
        resumen.grupos.errores.push(`Fila ${i + 2} (${nombre}): ${mensajeError(e)}`);
      }
    }
  }

  // ---------- Móviles ----------
  const hojaMoviles = workbook.Sheets["Moviles"];
  if (hojaMoviles) {
    const filas: any[] = XLSX.utils.sheet_to_json(hojaMoviles, { defval: "", raw: false });
    for (const [i, fila] of filas.entries()) {
      const numeroInterno = texto(fila, "Numero de interno");
      if (!numeroInterno) continue;
      try {
        const subgrupoId = await idSubgrupoPorNombres(
          empresaId,
          texto(fila, "Grupo"),
          texto(fila, "Subgrupo")
        );
        const socioId = await idPersonaPorNombre(empresaId, texto(fila, "Socio dueño"));
        const choferTitularId = await idPersonaPorNombre(empresaId, texto(fila, "Chofer titular"));
        const capacidadTexto = texto(fila, "Capacidad");

        const movil = await prisma.movil.create({
          data: {
            empresaId,
            numeroInterno,
            placa: texto(fila, "Placa") || null,
            capacidad: capacidadTexto ? Number(capacidadTexto) : null,
            subgrupoId,
            socioId,
            choferTitularId,
          },
        });

        if (choferTitularId) {
          await prisma.movilChoferHistorial.create({
            data: {
              movilId: movil.id,
              choferId: choferTitularId,
              fechaInicio: new Date(),
              fechaFin: null,
              motivo: "Importación inicial",
            },
          });
        }

        resumen.moviles.creados++;
      } catch (e: any) {
        resumen.moviles.errores.push(`Fila ${i + 2} (interno ${numeroInterno}): ${mensajeError(e)}`);
      }
    }
  }

  // ---------- Paradas ----------
  const hojaParadas = workbook.Sheets["Paradas"];
  if (hojaParadas) {
    const filas: any[] = XLSX.utils.sheet_to_json(hojaParadas, { defval: "" });
    for (const [i, fila] of filas.entries()) {
      const nombre = texto(fila, "Nombre");
      if (!nombre) continue;
      try {
        const secretariaId = await idPersonaPorNombre(empresaId, texto(fila, "Secretaria"));
        await prisma.parada.create({
          data: {
            empresaId,
            nombre,
            ubicacion: texto(fila, "Ubicacion") || "Ciudad",
            secretariaId,
          },
        });
        resumen.paradas.creados++;
      } catch (e: any) {
        resumen.paradas.errores.push(`Fila ${i + 2} (${nombre}): ${mensajeError(e)}`);
      }
    }
  }

  return NextResponse.json(resumen);
}
