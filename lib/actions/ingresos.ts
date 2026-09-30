"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
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

/** Registra un ingreso de dinero y lleva directo a su comprobante para imprimir. */
export async function crearIngreso(formData: FormData) {
  const { empresaId, personaId, rol } = await sesion();

  if (rol !== "ADMIN" && rol !== "SECRETARIA") {
    throw new Error("Solo administración o la secretaria de la parada pueden registrar ingresos");
  }

  const paradaId = campo(formData, "paradaId");
  const tipoIngresoId = campo(formData, "tipoIngresoId");
  const montoTexto = campo(formData, "monto");
  const fechaTexto = campo(formData, "fecha");
  const pagadorId = campo(formData, "personaId");
  const recibidoDeTexto = campo(formData, "recibidoDe");

  if (!paradaId || !tipoIngresoId || !montoTexto || !fechaTexto) {
    throw new Error("Faltan datos obligatorios del ingreso");
  }

  const monto = Number(montoTexto);
  if (!Number.isFinite(monto) || monto <= 0) {
    throw new Error("El monto debe ser mayor a cero");
  }

  // La parada y el tipo tienen que ser de esta empresa (nunca confiar en el id que llega del formulario).
  const [parada, tipoIngreso] = await Promise.all([
    prisma.parada.findFirst({ where: { id: paradaId, empresaId } }),
    prisma.tipoIngreso.findFirst({ where: { id: tipoIngresoId, empresaId } }),
  ]);
  if (!parada) throw new Error("Parada no encontrada");
  if (!tipoIngreso) throw new Error("Tipo de ingreso no encontrado");

  // Una secretaria solo puede cobrar en su propia parada.
  if (rol === "SECRETARIA" && parada.secretariaId !== personaId) {
    throw new Error("Solo podés registrar ingresos de tu propia parada");
  }

  // Quién entrega el dinero: una persona registrada o un nombre libre.
  let pagadorPersonaId: string | null = null;
  let recibidoDe = recibidoDeTexto;
  if (pagadorId) {
    const pagador = await prisma.persona.findFirst({ where: { id: pagadorId, empresaId } });
    if (!pagador) throw new Error("La persona seleccionada no existe");
    pagadorPersonaId = pagador.id;
    recibidoDe = pagador.nombre;
  }
  if (!recibidoDe) {
    throw new Error("Indicá de quién se recibe el dinero (elegí una persona o escribí el nombre)");
  }

  const ingreso = await prisma.ingreso.create({
    data: {
      empresaId,
      paradaId,
      tipoIngresoId,
      recibidoDe,
      personaId: pagadorPersonaId,
      concepto: campo(formData, "concepto"),
      monto,
      fecha: new Date(fechaTexto),
      registradoPorId: personaId,
    },
  });

  revalidatePath("/dashboard/caja");
  revalidatePath("/dashboard");
  redirect(`/dashboard/caja/comprobante/${ingreso.id}`);
}

/**
 * Un comprobante emitido no se borra (rompería la numeración): se anula con motivo
 * y deja de sumar en la caja. Solo administración.
 */
export async function anularIngreso(id: string, formData: FormData) {
  const { empresaId, rol } = await sesion();
  if (rol !== "ADMIN") throw new Error("Solo administración puede anular comprobantes");

  const motivo = campo(formData, "motivo");
  if (!motivo) throw new Error("Escribí el motivo de la anulación");

  const resultado = await prisma.ingreso.updateMany({
    where: { id, empresaId, anulado: false },
    data: { anulado: true, motivoAnulacion: motivo },
  });
  if (resultado.count === 0) throw new Error("Comprobante no encontrado o ya anulado");

  revalidatePath("/dashboard/caja");
  revalidatePath(`/dashboard/caja/comprobante/${id}`);
}
