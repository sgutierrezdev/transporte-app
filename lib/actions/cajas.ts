"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function crearIngresoCaja(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("No autorizado");
  const empresaId = (session.user as any).empresaId as string;
  const usuarioId = (session.user as any).id as string; // Identificamos quién registra el dinero

  const montoStr = formData.get("monto") as string;
  const comprobante = formData.get("comprobante") as string || null;
  const paradaId = formData.get("paradaId") as string;
  const tipoIngresoId = formData.get("tipoIngresoId") as string;

  if (!montoStr || !paradaId || !tipoIngresoId) {
    throw new Error("Monto, Parada y Concepto son obligatorios");
  }

  try {
    await prisma.ingreso.create({
      data: {
        monto: parseFloat(montoStr),
        comprobante,
        empresa: { connect: { id: empresaId } },
        parada: { connect: { id: paradaId } },
        tipoIngreso: { connect: { id: tipoIngresoId } },
        registradoPor: { connect: { id: usuarioId } } // Auditoría contable: quién guardó el dinero
      }
    });

    revalidatePath("/dashboard/caja");
  } catch (error) {
    console.error("Error al registrar ingreso de caja:", error);
    throw new Error("Error en el servidor al procesar el flujo contable");
  }
}
