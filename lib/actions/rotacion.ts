"use server";

import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function empresaIdDeSesion() {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("No autorizado");
  return (session.user as any).empresaId as string;
}

export async function asignarRotacion(formData: FormData) {
  await empresaIdDeSesion();
  const subgrupoId = formData.get("subgrupoId")?.toString();
  const fechaTexto = formData.get("fecha")?.toString();
  const paradaId = formData.get("paradaId")?.toString();

  if (!subgrupoId || !fechaTexto) throw new Error("Datos incompletos");

  const fecha = new Date(fechaTexto);

  if (!paradaId) {
    // "Sin asignar": borra la rotación de ese día si existía
    await prisma.rotacionDiaria
      .delete({ where: { subgrupoId_fecha: { subgrupoId, fecha } } })
      .catch(() => {});
  } else {
    await prisma.rotacionDiaria.upsert({
      where: { subgrupoId_fecha: { subgrupoId, fecha } },
      update: { paradaId },
      create: { subgrupoId, fecha, paradaId },
    });
  }

  revalidatePath("/dashboard/rotacion");
}
