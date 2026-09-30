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

export async function generarProgramacionDelDia(formData: FormData) {
  const empresaId = await empresaIdDeSesion();
  const fechaTexto = formData.get("fecha")?.toString();
  if (!fechaTexto) throw new Error("Elegí una fecha");
  const fecha = new Date(fechaTexto);

  const moviles = await prisma.movil.findMany({
    where: { empresaId, subgrupoId: { not: null } },
    include: { subgrupo: true },
  });

  for (const movil of moviles) {
    if (!movil.subgrupo) continue;
    const subgrupoId = movil.subgrupo.id;
    const grupoId = movil.subgrupo.grupoId;

    const [jefeVigente, rotacion, reemplazo] = await Promise.all([
      prisma.jefeGrupoHistorial.findFirst({
        where: {
          grupoId,
          fechaInicio: { lte: fecha },
          OR: [{ fechaFin: null }, { fechaFin: { gte: fecha } }],
        },
        orderBy: { fechaInicio: "desc" },
      }),
      prisma.rotacionDiaria.findUnique({
        where: { subgrupoId_fecha: { subgrupoId, fecha } },
      }),
      prisma.reemplazoDiario.findUnique({
        where: { movilId_fecha: { movilId: movil.id, fecha } },
      }),
    ]);

    const choferId = reemplazo?.choferId ?? movil.choferTitularId ?? null;

    await prisma.programacionDiaria.upsert({
      where: { movilId_fecha: { movilId: movil.id, fecha } },
      update: {
        subgrupoId,
        grupoId,
        jefeId: jefeVigente?.jefeId ?? null,
        choferId,
        paradaId: rotacion?.paradaId ?? null,
      },
      create: {
        fecha,
        movilId: movil.id,
        subgrupoId,
        grupoId,
        jefeId: jefeVigente?.jefeId ?? null,
        choferId,
        paradaId: rotacion?.paradaId ?? null,
      },
    });
  }

  revalidatePath("/dashboard/programacion");
}
