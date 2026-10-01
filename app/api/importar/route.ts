import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; 
import { Rol } from "@prisma/client"; // <-- AÑADE ESTA LÍNEA (Si en tu schema está en mayúsculas, usa RROL o ROL)
import * as XLSX from "xlsx";


function texto(fila: any, columna: string): string {
  if (!fila || !columna || fila[columna] === undefined) return "";
  return String(fila[columna]).trim();
}

function mensajeError(error: any): string {
  if (error instanceof Error) return error.message;
  return "Error desconocido";
}

export async function POST(request: Request) {
  const resumen = {
    personas: { creados: 0, errores: [] as string[] },
    grupos: { creados: 0, errores: [] as string[] }
  };

  let empresaId = "";

  try {
    const empresa = await prisma.empresa.findFirst();
    if (!empresa) {
      return NextResponse.json({ error: "No existe ninguna empresa creada." }, { status: 400 });
    }
    empresaId = empresa.id;

    const formData = await request.formData();
    const file = formData.get("file") as Blob | null;

    if (!file) {
      return NextResponse.json({ error: "No se ha subido ningún archivo" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const workbook = XLSX.read(buffer, { type: "buffer" });

    // ---------- SECCIÓN 1: PERSONAS ----------
    const hojaPersonas = workbook.Sheets["Personas"];
    if (hojaPersonas) {
      const filas: any[] = XLSX.utils.sheet_to_json(hojaPersonas, { defval: "" });
      
      for (let i = 0; i < filas.length; i++) {
        const fila = filas[i];
        const nombre = texto(fila, "Nombre") || fila.nombre;

        if (!nombre) continue;

        try {
          await prisma.persona.create({
            data: {
              nombre,
              carnet: texto(fila, "Carnet") || null,
              celular: texto(fila, "Celular") || null,
              email: texto(fila, "Correo") || texto(fila, "Email") || null,
              rol: Rol.SOCIO, // <-- CAMBIA ESTO AQUÍ (Usa Rol.SOCIO o ROL.SOCIO según tu import)
              empresa: {
                connect: { id: empresaId }
              }
            }
          });
          resumen.personas.creados++;
            }
          });
          resumen.personas.creados++;

        }
      }
    }

    // ---------- SECCIÓN 2: GRUPOS ----------
    const hojaGrupos = workbook.Sheets["Grupos"];
    if (hojaGrupos) {
      const filas: any[] = XLSX.utils.sheet_to_json(hojaGrupos, { defval: "" });
      
      for (let i = 0; i < filas.length; i++) {
        const fila = filas[i];
        const nombre = texto(fila, "Nombre") || fila.nombre;
        
        if (!nombre) continue;
        
        try {
          await prisma.grupo.create({
            data: {
              nombre,
              empresa: {
                connect: { id: empresaId }
              }
            }
          });
          resumen.groups.creados++;
        } catch (e: any) {
          resumen.grupos.errores.push(`Fila ${i + 2} (${nombre}): ${mensajeError(e)}`);
        }
      }
    }

  } catch (globalError: any) {
    return NextResponse.json({ error: `Error general: ${mensajeError(globalError)}` }, { status: 500 });
  }

  return NextResponse.json(resumen);
}
