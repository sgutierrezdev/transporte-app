"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function crearMovil(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("No autorizado");
  const empresaId = (session.user as any).empresaId as string;

  // Extraemos las variables del formulario de forma tipada
  const numeroInterno = formData.get("numeroInterno") as string;
  const placa = formData.get("placa") as string || null;
  const capacidadStr = formData.get("capacidad") as string;
  const subgrupoId = formData.get("subgrupoId") as string || null;
  const socioId = formData.get("socioId") as string || null;
  const choferTitularId = formData.get("choferTitularId") as string || null;

  if (!numeroInterno) throw new Error("El número de interno es obligatorio");

  const capacidad = capacidadStr ? parseInt(capacidadStr, 10) : null;

  try {
    // Insertamos de forma física en Neon.tech vinculando las relaciones si existen
    await prisma.movil.create({
      data: {
        numeroInterno,
        placa,
        capacidad,
        empresa: { connect: { id: empresaId } },
        ...(subgrupoId && { subgrupo: { connect: { id: subgrupoId } } }),
        ...(socioId && { socio: { connect: { id: socioId } } }),
        ...(choferTitularId && { choferTitular: { connect: { id: choferTitularId } } }),
      },
    });

    // Forzamos a Next.js a actualizar la lista en tiempo real sin caché vieja
    revalidatePath("/dashboard/moviles");
  } catch (error) {
    console.error("Error al crear móvil:", error);
    throw new Error("No se pudo registrar el móvil en la flota");
  }
}
