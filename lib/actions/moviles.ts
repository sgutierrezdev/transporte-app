"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function sesionActual() {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("No autorizado");
  return session;
}

function unDiaAntes(fecha: Date) {
  const d = new Date(fecha);
  d.setDate(d.getDate() - 1);
  return d;
}

function campo(formData: FormData, nombre: string) {
  const valor = formData.get(nombre);
  return valor ? valor.toString().trim() || null : null;
}

export async function crearMovil(formData: FormData) {
  const session = await sesionActual();
  const empresaId = (session.user as any).empresaId as string;

  const numeroInterno = campo(formData, "numeroInterno");
  if (!numeroInterno) throw new Error("El número de interno es obligatorio");

  const capacidad = campo(formData, "capacidad");
  const choferTitularId = campo(formData, "choferTitularId");

  const movil = await prisma.movil.create({
    data: {
      empresaId,
      numeroInterno,
      placa: campo(formData, "placa"),
      capacidad: capacidad ? Number(capacidad) : null,
      subgrupoId: campo(formData, "subgrupoId"),
      socioId: campo(formData, "socioId"),
      choferTitularId,
    },
  });

  if (choferTitularId) {
    await prisma.movilChoferHistorial.create({
      data: {
        movilId: movil.id,
        choferId: choferTitularId,
        fechaInicio: new Date(),
        fechaFin: null,
        motivo: "Alta inicial del interno",
      },
    });
  }

  revalidatePath("/dashboard/moviles");
}

export async function actualizarMovil(id: string, formData: FormData) {
  await sesionActual();
  const numeroInterno = campo(formData, "numeroInterno");
  if (!numeroInterno) throw new Error("El número de interno es obligatorio");

  const capacidad = campo(formData, "capacidad");

  await prisma.movil.update({
    where: { id },
    data: {
      numeroInterno,
      placa: campo(formData, "placa"),
      capacidad: capacidad ? Number(capacidad) : null,
      subgrupoId: campo(formData, "subgrupoId"),
      socioId: campo(formData, "socioId"),
    },
  });

  revalidatePath("/dashboard/moviles");
  redirect("/dashboard/moviles");
}

export async function eliminarMovil(id: string) {
  await sesionActual();
  await prisma.movil.delete({ where: { id } });
  revalidatePath("/dashboard/moviles");
  redirect("/dashboard/moviles");
}

export async function cambiarTitularMovil(movilId: string, formData: FormData) {
  const session = await sesionActual();
  const autorizadoPorId = (session.user as any).id as string;

  const choferId = campo(formData, "choferId");
  const fechaTexto = campo(formData, "fecha");
  const motivo = campo(formData, "motivo");
  if (!choferId || !fechaTexto) throw new Error("Elegí el nuevo titular y la fecha");

  const fecha = new Date(fechaTexto);

  const titularActual = await prisma.movilChoferHistorial.findFirst({
    where: { movilId, fechaFin: null },
  });

  await prisma.$transaction(async (tx) => {
    if (titularActual) {
      await tx.movilChoferHistorial.update({
        where: { id: titularActual.id },
        data: { fechaFin: unDiaAntes(fecha) },
      });
    }
    await tx.movilChoferHistorial.create({
      data: { movilId, choferId, fechaInicio: fecha, fechaFin: null, motivo, autorizadoPorId },
    });
    await tx.movil.update({ where: { id: movilId }, data: { choferTitularId: choferId } });
  });

  revalidatePath(`/dashboard/moviles/${movilId}`);
  revalidatePath("/dashboard/moviles");
  redirect(`/dashboard/moviles/${movilId}`);
}

export async function registrarReemplazoDiario(movilId: string, formData: FormData) {
  await sesionActual();
  const fechaTexto = campo(formData, "fecha");
  const choferId = campo(formData, "choferId");
  const motivo = campo(formData, "motivo");
  if (!fechaTexto || !choferId) throw new Error("Elegí la fecha y el chofer reemplazante");

  const fecha = new Date(fechaTexto);

  await prisma.reemplazoDiario.upsert({
    where: { movilId_fecha: { movilId, fecha } },
    update: { choferId, motivo },
    create: { movilId, fecha, choferId, motivo },
  });

  revalidatePath(`/dashboard/moviles/${movilId}`);
  redirect(`/dashboard/moviles/${movilId}`);
}
