"use server";

import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function sesion() {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("No autorizado");
  return {
    empresaId: (session.user as any).empresaId as string,
    personaId: (session.user as any).id as string,
    rol: (session.user as any).rol as string,
  };
}

function campo(formData: FormData, nombre: string) {
  const valor = formData.get(nombre);
  return valor ? valor.toString().trim() || null : null;
}

export async function crearGasto(formData: FormData) {
  const { empresaId, personaId, rol } = await sesion();

  const paradaId = campo(formData, "paradaId");
  const tipoGastoId = campo(formData, "tipoGastoId");
  const montoTexto = campo(formData, "monto");
  const fechaTexto = campo(formData, "fecha");

  if (!paradaId || !tipoGastoId || !montoTexto || !fechaTexto) {
    throw new Error("Faltan datos obligatorios del gasto");
  }

  if (rol !== "ADMIN" && rol !== "SECRETARIA") {
    throw new Error("Solo administración o la secretaria de la parada pueden registrar gastos");
  }

  const monto = Number(montoTexto);
  if (!Number.isFinite(monto) || monto <= 0) {
    throw new Error("El monto debe ser mayor a cero");
  }

  // La parada y el tipo tienen que ser de esta empresa.
  const [parada, tipoGasto] = await Promise.all([
    prisma.parada.findFirst({ where: { id: paradaId, empresaId } }),
    prisma.tipoGasto.findFirst({ where: { id: tipoGastoId, empresaId } }),
  ]);
  if (!parada) throw new Error("Parada no encontrada");
  if (!tipoGasto) throw new Error("Tipo de gasto no encontrado");

  // Una secretaria solo puede cargar gastos de su propia parada.
  if (rol === "SECRETARIA" && parada.secretariaId !== personaId) {
    throw new Error("Solo podés registrar gastos de tu propia parada");
  }

  await prisma.gasto.create({
    data: {
      empresaId,
      paradaId,
      tipoGastoId,
      descripcion: campo(formData, "descripcion"),
      monto,
      fecha: new Date(fechaTexto),
      registradoPorId: personaId,
    },
  });

  revalidatePath("/dashboard/caja");
}

export async function eliminarGasto(id: string) {
  const { empresaId, personaId, rol } = await sesion();
  if (rol !== "ADMIN" && rol !== "SECRETARIA") {
    throw new Error("No tenés permiso para eliminar gastos");
  }

  const gasto = await prisma.gasto.findFirst({
    where: { id, empresaId },
    include: { parada: true },
  });
  if (!gasto) throw new Error("Gasto no encontrado");
  if (rol === "SECRETARIA" && gasto.parada.secretariaId !== personaId) {
    throw new Error("Solo podés eliminar gastos de tu propia parada");
  }

  await prisma.gasto.delete({ where: { id } });
  revalidatePath("/dashboard/caja");
}
