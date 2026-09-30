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

function campo(formData: FormData, nombre: string) {
  const valor = formData.get(nombre);
  return valor ? valor.toString().trim() || null : null;
}

export async function crearParada(formData: FormData) {
  const empresaId = await empresaIdDeSesion();
  const nombre = campo(formData, "nombre");
  const ubicacion = campo(formData, "ubicacion");
  if (!nombre) throw new Error("El nombre de la parada es obligatorio");
  if (!ubicacion) throw new Error("La ubicación es obligatoria");

  await prisma.parada.create({
    data: {
      empresaId,
      nombre,
      ubicacion,
      secretariaId: campo(formData, "secretariaId"),
    },
  });

  revalidatePath("/dashboard/paradas");
}

export async function actualizarParada(id: string, formData: FormData) {
  await empresaIdDeSesion();
  const nombre = campo(formData, "nombre");
  const ubicacion = campo(formData, "ubicacion");
  if (!nombre) throw new Error("El nombre de la parada es obligatorio");
  if (!ubicacion) throw new Error("La ubicación es obligatoria");

  await prisma.parada.update({
    where: { id },
    data: {
      nombre,
      ubicacion,
      secretariaId: campo(formData, "secretariaId"),
    },
  });

  revalidatePath("/dashboard/paradas");
  redirect("/dashboard/paradas");
}

export async function eliminarParada(id: string) {
  await empresaIdDeSesion();
  await prisma.parada.delete({ where: { id } });
  revalidatePath("/dashboard/paradas");
  redirect("/dashboard/paradas");
}
