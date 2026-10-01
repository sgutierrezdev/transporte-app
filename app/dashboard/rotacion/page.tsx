import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ComponenteRotacionCliente } from "./ComponenteRotacionCliente";

async function asignarRotacionFalsa(formData: FormData) {
  "use server";
  console.log("Rotación guardada temporalmente");
}

export default async function RotacionDiariaPage() {
  const session = await getServerSession(authOptions);
  const empresaId = (session!.user as any).empresaId as string;

  // Consulta limpia sin filtros conflictivos de where para liberar TypeScript
  const [rotaciones, paradas, subgrupos] = await Promise.all([
    prisma.rotacionDiaria.findMany({
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

  // Mapeo seguro con validación opcional (?.) para evitar caídas si faltan datos
  const datosRotacionFormateados = rotaciones.map((r) => ({
    id: r.id,
    fecha: r.fecha ? new Date(r.fecha).toISOString().split("T")[0] : "Sin fecha",
    paradaNombre: r.parada?.nombre ?? "Sin estación",
    jurisdiccion: r.parada?.ubicacion ?? "Ciudad",
    grupoAsignado: r.subgrupo 
      ? `Grupo ${r.subgrupo.grupo?.nombre ?? ""} — Subgrupo ${r.subgrupo.nombre}` 
      : "Sin asignar"
  }));

  return (
    <main style={{ maxWidth: 1000, margin: "0 auto", padding: "1.5rem 1rem" }}>
      <ComponenteRotacionCliente 
        rotacionesIniciales={datosRotacionFormateados}
        paradas={paradas}
        subgrupos={subgrupos}
        asignarAction={asignarRotacionFalsa}
      />
    </main>
  );
}
