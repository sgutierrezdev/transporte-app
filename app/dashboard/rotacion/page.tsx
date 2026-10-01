import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
// Asumimos que tu acción de guardar la asignación se llama asignarRotacion
import { asignarRotacion } from "@/lib/actions/rotaciones"; 
import { ComponenteRotacionCliente } from "./ComponenteRotacionCliente";

export default async function RotacionDiariaPage() {
  const session = await getServerSession(authOptions);
  const empresaId = (session!.user as any).empresaId as string;

  // Traemos los datos operativos en paralelo desde tu base de datos en la nube
  const [rotaciones, paradas, subgrupos] = await Promise.all([
    prisma.rotacionDiaria.findMany({
      where: { empresaId },
      include: { parada: true, subgrupo: { include: { grupo: true } } },
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
    fecha: r.fecha.toISOString().split("T")[0], // Formato YYYY-MM-DD
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
        asignarAction={asignarRotacion}
      />
    </main>
  );
}
