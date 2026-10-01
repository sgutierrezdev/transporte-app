import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// Función auxiliar para leer los datos del formulario de forma segura
function campo(formData: FormData, llave: string): string {
  const valor = formData.get(llave);
  return valor ? String(valor).trim() : "";
}

export async function crearSocio(empresaId: string, formData: FormData) {
  const nombre = campo(formData, "nombre");
  const carnet = campo(formData, "carnet") || null;
  const celular = campo(formData, "celular") || null;
  const email = campo(formData, "email") || null;
  const codigo = campo(formData, "codigo") || null;

  if (!nombre) throw new Error("El nombre es obligatorio");

  try {
    // 1. En Prisma, primero creamos la Persona con el rol obligatorio
    const nuevaPersona = await prisma.persona.create({
      data: {
        nombre,
        carnet,
        celular,
        email,
        rol: "SOCIO" as any, // Asegura compatibilidad con tu ENUM local
        empresa: {
          connect: { id: empresaId }
        }
      }
    });

    // 2. Ahora creamos el Socio vinculándolo a la Persona y a la Empresa
    await prisma.socio.create({
      data: {
        codigo,
        estado: "ACTIVO",
        persona: {
          connect: { id: nuevaPersona.id }
        },
        empresa: {
          connect: { id: empresaId }
        }
      }
    });

  } catch (error) {
    console.error("Error al crear socio:", error);
    throw new Error("No se pudo registrar el socio");
  }

  revalidatePath("/dashboard/socios");
  redirect("/dashboard/socios");
}

export async function actualizarSocio(socioId: string, formData: FormData) {
  const nombre = campo(formData, "nombre");
  const carnet = campo(formData, "carnet") || null;
  const celular = campo(formData, "celular") || null;
  const email = campo(formData, "email") || null;
  const codigo = campo(formData, "codigo") || null;

  try {
    // 1. Buscamos el socio actual para obtener su personaId
    const socioActual = await prisma.socio.findUnique({
      where: { id: socioId }
    });

    if (!socioActual) throw new Error("Socio no encontrado");

    // 2. Actualizamos los datos del formulario en la tabla Persona
    await prisma.persona.update({
      where: { id: socioActual.personaId },
      data: {
        nombre,
        carnet,
        celular,
        email
      }
    });

    // 3. Actualizamos los datos propios del Socio
    await prisma.socio.update({
      where: { id: socioId },
      data: {
        codigo
      }
    });

  } catch (error) {
    console.error("Error al actualizar socio:", error);
    throw new Error("No se pudieron guardar los cambios");
  }

  revalidatePath("/dashboard/socios");
  redirect("/dashboard/socios");
}
