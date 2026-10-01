import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { crearPersona } from "@/lib/actions/personas";
import { ROLES, ESTADOS_PERSONA, NOMBRE_ROL, NOMBRE_ESTADO } from "@/lib/constants";
import { ComponentePersonasCliente } from "./ComponentePersonasCliente";

export default async function PersonasPage() {
  const session = await getServerSession(authOptions);
  const empresaId = (session!.user as any).empresaId as string;

  // Extraemos las personas reales conectadas a tu base de datos en la nube
  const personas = await prisma.persona.findMany({
    where: { empresaId },
    orderBy: { nombre: "asc" },
  });

  // Pasamos los diccionarios de traducción nativos y la acción del servidor
  return (
    <main style={{ 
      width: "100%", 
      maxWidth: 1000, 
      margin: "0 auto", 
      padding: "1rem", 
      boxSizing: "border-box",
      overflow: "hidden" // <-- Evita que el buscador o título estiren toda la pantalla del móvil
    }}>
      <ComponentePersonasCliente ... />
    </main>
  );
}
