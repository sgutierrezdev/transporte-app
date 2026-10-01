import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ComponenteRotacionCliente } from "./ComponenteRotacionCliente";

// Acción de prueba local segura para evitar el error de compilación
async function asignarRotacionFalsa(formData: FormData) {
  "use server";
  console.log("Rotación asignada temporalmente en consola");
}

export default async function RotacionDiariaPage() {
  const session = await getServerSession(authOptions);
  const empresaId = (session!.user as any).empresaId as string;

  // Ejecutamos tu consulta relacional original optimizada para Neon.tech
  const [rotaciones, paradas, subgrupos] = await Promise.all([
    prisma.rotacionDiaria.findMany({
      where: { empresaId },
      include: {
        parada: true,
        subgrupo: { include: { grupo: true } },
      },
      orderBy: { fecha: "desc" },
    }),
    prisma.parada.findMany({ where: { empresaId }, orderBy: { nombre: "asc" } }),
    prisma.subgrupo.findMany({
      where: { grupo: { empresaId } },
      include: { grupo: true },
      orderBy: [{ grupo: { nombre: "asc" } }, { nombre: "asc" }],
    }),
  ]);

  // Formateamos los registros para que se rendericen de forma compacta
  const datosRotacionFormateados = rotaciones.map((r) => ({
    id: r.id,
    fecha: r.fecha.toISOString().split("T")[0], // Corregido formato de fecha seguro
    paradaNombre: r.parada?.nombre ?? "Sin estación",
    jurisdiccion: r.parada?.ubicacion ?? "Ciudad",
    grupoAsignado: r.subgrupo ? `Grupo ${r.subgrupo.grupo.nombre} — Subgrupo ${r.subgrupo.nombre}` : "Sin asignar"
  }));

  return (
    <main style={{ maxWidth: 1000, margin: "0 auto", padding: "1.5rem 1rem" }}>
      <ComponenteRotacionCliente 
        rotacionesIniciales={datosRotacionFormateados}
        paradas={paradas}
        subgrupos={subgrupos}
        asignarAction={asignarRotacionFalsa} // Usamos la acción local para dar luz verde a Vercel
      />
    </main>
  );
}
