"use server";

import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { asegurarCatalogos } from "@/lib/catalogos";

async function sesion() {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("No autorizado");
  return {
    empresaId: (session.user as any).empresaId as string,
    personaId: (session.user as any).id as string,
    rol: (session.user as any).rol as string,
  };
}

const NOMBRE_TIPO_INFRACCION: Record<string, string> = {
  TARDANZA: "Tardanza",
  AUSENTE: "Ausencia",
  ABANDONO: "Abandono de ruta",
};

export async function registrarAsistencia(programacionDiariaId: string, formData: FormData) {
  const { empresaId, personaId, rol } = await sesion();

  if (rol !== "ADMIN" && rol !== "SECRETARIA") {
    throw new Error("Solo administración o la secretaria de la parada pueden registrar asistencia");
  }

  const estado = formData.get("estado")?.toString() as "A_TIEMPO" | "TARDANZA" | "AUSENTE" | "ABANDONO";
  if (!estado) throw new Error("Falta el estado");

  const programacion = await prisma.programacionDiaria.findUnique({
    where: { id: programacionDiariaId },
    include: { movil: true },
  });
  if (!programacion || programacion.movil.empresaId !== empresaId) {
    throw new Error("Programación no encontrada");
  }
  if (!programacion.choferId) {
    throw new Error("Esta fila no tiene chofer asignado ese día, no se puede registrar asistencia");
  }

  // Una secretaria solo puede marcar asistencia de móviles en su propia parada.
  if (rol === "SECRETARIA") {
    const miParada = await prisma.parada.findFirst({ where: { secretariaId: personaId } });
    if (!miParada || programacion.paradaId !== miParada.id) {
      throw new Error("Solo podés registrar asistencia de tu propia parada");
    }
  }

  let tipoInfraccionId: string | null = null;
  if (estado !== "A_TIEMPO") {
    const nombreTipo = NOMBRE_TIPO_INFRACCION[estado];
    let tipo = await prisma.tipoInfraccion.findFirst({
      where: { empresaId, nombre: nombreTipo },
    });
    if (!tipo) {
      // La empresa todavía no tiene este tipo de multa: se crean los tipos por defecto.
      await asegurarCatalogos(empresaId);
      tipo = await prisma.tipoInfraccion.findFirst({ where: { empresaId, nombre: nombreTipo } });
    }
    tipoInfraccionId = tipo?.id ?? null;
  }

  await prisma.asistencia.upsert({
    where: { programacionDiariaId },
    create: {
      programacionDiariaId,
      personaId: programacion.choferId,
      estado,
      metodo: "MANUAL",
      horaLlegada: estado === "AUSENTE" ? null : new Date(),
      tipoInfraccionId,
    },
    update: {
      estado,
      metodo: "MANUAL",
      horaLlegada: estado === "AUSENTE" ? null : new Date(),
      tipoInfraccionId,
    },
  });

  revalidatePath("/dashboard/asistencia");
  revalidatePath("/dashboard");
}
