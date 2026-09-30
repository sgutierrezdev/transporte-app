"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function empresaIdDeSesion() {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("No autorizado");
  return (session.user as any).empresaId as string;
}

function unDiaAntes(fecha: Date) {
  const d = new Date(fecha);
  d.setDate(d.getDate() - 1);
  return d;
}

export async function crearGrupo(formData: FormData) {
  const empresaId = await empresaIdDeSesion();
  const nombre = formData.get("nombre")?.toString().trim();
  if (!nombre) throw new Error("El nombre del grupo es obligatorio");

  const jefeId = formData.get("jefeId")?.toString() || null;

  const grupo = await prisma.grupo.create({
    data: {
      empresaId,
      nombre,
      subgrupos: {
        create: [{ nombre: "A" }, { nombre: "B" }],
      },
    },
  });

  if (jefeId) {
    await prisma.jefeGrupoHistorial.create({
      data: {
        grupoId: grupo.id,
        jefeId,
        fechaInicio: new Date(),
        fechaFin: null,
      },
    });
  }

  revalidatePath("/dashboard/grupos");
}

export async function cambiarJefeGrupo(grupoId: string, formData: FormData) {
  await empresaIdDeSesion();
  const jefeId = formData.get("jefeId")?.toString();
  const fechaTexto = formData.get("fecha")?.toString();
  const motivo = formData.get("motivo")?.toString().trim() || null;

  if (!jefeId || !fechaTexto) throw new Error("Elegí el nuevo jefe y la fecha");

  const fecha = new Date(fechaTexto);

  const jefeActual = await prisma.jefeGrupoHistorial.findFirst({
    where: { grupoId, fechaFin: null },
  });

  await prisma.$transaction(async (tx) => {
    if (jefeActual) {
      await tx.jefeGrupoHistorial.update({
        where: { id: jefeActual.id },
        data: { fechaFin: unDiaAntes(fecha) },
      });
    }
    await tx.jefeGrupoHistorial.create({
      data: { grupoId, jefeId, fechaInicio: fecha, fechaFin: null, motivo },
    });
  });

  revalidatePath(`/dashboard/grupos/${grupoId}`);
  revalidatePath("/dashboard/grupos");
  redirect(`/dashboard/grupos/${grupoId}`);
}

export async function eliminarGrupo(grupoId: string) {
  await empresaIdDeSesion();
  await prisma.grupo.delete({ where: { id: grupoId } });
  revalidatePath("/dashboard/grupos");
  redirect("/dashboard/grupos");
}
