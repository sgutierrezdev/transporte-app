"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function guardarTipoInfraccion(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("No autorizado");
  const empresaId = (session.user as any).empresaId as string;

  const nombre = formData.get("nombre") as string;
  const montoFijoStr = formData.get("montoFijo") as string;
  const montoEspecialStr = formData.get("montoEspecial") as string || null;
  const fechaInicioStr = formData.get("fechaInicio") as string || null;
  const fechaFinStr = formData.get("fechaFin") as string || null;

  if (!nombre || !montoFijoStr) throw new Error("Nombre y Monto Base son obligatorios");

  try {
    await prisma.tipoInfraccion.create({
      data: {
        nombre,
        montoFijo: parseFloat(montoFijoStr),
        montoEspecial: montoEspecialStr ? parseFloat(montoEspecialStr) : null,
        fechaInicio: fechaInicioStr ? new Date(fechaInicioStr) : null,
        fechaFin: fechaFinStr ? new Date(fechaFinStr) : null,
        empresa: { connect: { id: empresaId } }
      }
    });

    revalidatePath("/dashboard/infracciones");
  } catch (error) {
    console.error("Error al guardar tipo de infracción:", error);
    throw new Error("No se pudo agregar la falta al reglamento interno");
  }
}
