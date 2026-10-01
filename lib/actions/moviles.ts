"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

// 1. ACCIÓN REAL: CREAR MÓVIL
export async function crearMovil(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("No autorizado");
  const empresaId = (session.user as any).empresaId as string;

  const numeroInterno = formData.get("numeroInterno") as string;
  const placa = formData.get("placa") as string || null;
  const capacidadStr = formData.get("capacidad") as string;
  const subgrupoId = formData.get("subgrupoId") as string || null;
  const socioId = formData.get("socioId") as string || null;
  const choferTitularId = formData.get("choferTitularId") as string || null;

  if (!numeroInterno) throw new Error("El número de interno es obligatorio");
  const capacidad = capacidadStr ? parseInt(capacidadStr, 10) : null;

  try {
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
    revalidatePath("/dashboard/moviles");
  } catch (error) {
    console.error("Error al crear móvil:", error);
    throw new Error("No se pudo registrar el móvil en la flota");
  }
}

// 2. ACCIÓN REAL: ACTUALIZAR MÓVIL
export async function actualizarMovil(id: string, formData: FormData) {
  const numeroInterno = formData.get("numeroInterno") as string;
  const placa = formData.get("placa") as string || null;
  const capacidadStr = formData.get("capacidad") as string;
  const subgrupoId = formData.get("subgrupoId") as string || null;
  const socioId = formData.get("socioId") as string || null;
  const choferTitularId = formData.get("choferTitularId") as string || null;

  const capacidad = capacidadStr ? parseInt(capacidadStr, 10) : null;

  try {
    await prisma.movil.update({
      where: { id },
      data: {
        numeroInterno,
        placa,
        capacidad,
        subgrupoId: subgrupoId || null,
        socioId: socioId || null,
        choferTitularId: choferTitularId || null,
      },
    });
    revalidatePath("/dashboard/moviles");
  } catch (error) {
    console.error("Error al actualizar móvil:", error);
    throw new Error("No se pudieron guardar los cambios del móvil");
  }
}

// 3. ACCIÓN REAL: ELIMINAR MÓVIL
export async function eliminarMovil(id: string) {
  try {
    await prisma.movil.delete({
      where: { id },
    });
    revalidatePath("/dashboard/moviles");
  } catch (error) {
    console.error("Error al eliminar móvil:", error);
    throw new Error("No se pudo dar de baja la unidad de la flota");
  }
}

// 4. ACCIÓN REAL: CAMBIAR TITULAR DEL MÓVIL
export async function cambiarTitularMovil(movilId: string, choferId: string, motivo: string) {
  try {
    await prisma.movil.update({
      where: { id: movilId },
      data: { choferTitularId: choferId },
    });
    revalidatePath("/dashboard/moviles");
  } catch (error) {
    console.error("Error al cambiar titular:", error);
    throw new Error("No se pudo procesar el cambio de chofer titular");
  }
}

// 5. ACCIÓN REAL: REGISTRAR REEMPLAZO DIARIO
export async function registrarReemplazoDiario(movilId: string, fecha: Date, choferId: string, motivo: string) {
  try {
    await prisma.reemplazoDiario.create({
      data: {
        movilId,
        fecha,
        choferId,
        motivo,
      },
    });
    revalidatePath("/dashboard/moviles");
  } catch (error) {
    console.error("Error al registrar reemplazo diario:", error);
    throw new Error("No se pudo registrar el reemplazo para esta fecha");
  }
}
