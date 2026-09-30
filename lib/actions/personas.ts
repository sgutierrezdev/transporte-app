"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
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

export async function crearPersona(formData: FormData) {
  const empresaId = await empresaIdDeSesion();
  const nombre = campo(formData, "nombre");
  if (!nombre) throw new Error("El nombre es obligatorio");

  const password = campo(formData, "password");

  await prisma.persona.create({
    data: {
      empresaId,
      nombre,
      carnet: campo(formData, "carnet"),
      celular: campo(formData, "celular"),
      email: campo(formData, "email"),
      password: password ? await bcrypt.hash(password, 10) : null,
      rol: (campo(formData, "rol") as any) ?? "SOCIO",
      estado: (campo(formData, "estado") as any) ?? "ACTIVO",
      fechaIngreso: campo(formData, "fechaIngreso")
        ? new Date(campo(formData, "fechaIngreso") as string)
        : null,
    },
  });

  revalidatePath("/dashboard/personas");
}

export async function actualizarPersona(id: string, formData: FormData) {
  await empresaIdDeSesion();
  const nombre = campo(formData, "nombre");
  if (!nombre) throw new Error("El nombre es obligatorio");

  const password = campo(formData, "password");

  await prisma.persona.update({
    where: { id },
    data: {
      nombre,
      carnet: campo(formData, "carnet"),
      celular: campo(formData, "celular"),
      email: campo(formData, "email"),
      ...(password ? { password: await bcrypt.hash(password, 10) } : {}),
      rol: campo(formData, "rol") as any,
      estado: campo(formData, "estado") as any,
      fechaIngreso: campo(formData, "fechaIngreso")
        ? new Date(campo(formData, "fechaIngreso") as string)
        : null,
    },
  });

  revalidatePath("/dashboard/personas");
  redirect("/dashboard/personas");
}

export async function eliminarPersona(id: string) {
  await empresaIdDeSesion();
  await prisma.persona.delete({ where: { id } });
  revalidatePath("/dashboard/personas");
  redirect("/dashboard/personas");
}
