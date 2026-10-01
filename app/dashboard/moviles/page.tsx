import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { crearMovil } from "@/lib/actions/moviles";
import { ComponenteMovilesCliente } from "./ComponenteMovilesCliente";

export default async function MovilesPage() {
  const session = await getServerSession(authOptions);
  const empresaId = (session!.user as any).empresaId as string;

  // Traemos tus 123 móviles reales y los listados para los desplegables
  const [moviles, subgrupos, personas] = await Promise.all([
    prisma.movil.findMany({
      where: { empresaId },
      include: { subgrupo: { include: { grupo: true } }, socio: true, choferTitular: true },
      orderBy: { numeroInterno: "asc" },
    }),
    prisma.subgrupo.findMany({
      where: { grupo: { empresaId } },
      include: { grupo: true },
      orderBy: [{ grupo: { nombre: "asc" } }, { nombre: "asc" }],
    }),
    prisma.persona.findMany({ where: { empresaId }, orderBy: { nombre: "asc" } }),
  ]);

  // Formateamos los datos limpios para enviárselos al componente interactivo
  const datosMovilesFormateados = moviles.map((m) => ({
    id: m.id,
    interno: m.numeroInterno,
    placa: m.placa ?? "Sin placa",
    socioNombre: m.socio?.nombre ?? "Sin asignar",
    choferNombre: m.choferTitular?.nombre ?? m.socio?.nombre ?? "Sin asignar",
    grupoTexto: m.subgrupo ? `Grupo ${m.subgrupo.grupo.nombre}-${m.subgrupo.nombre}` : "Sin subgrupo"
  }));

  return (
    <main style={{ maxWidth: 1000, margin: "0 auto", padding: "1.5rem 1rem" }}>
      <ComponenteMovilesCliente 
        movilesIniciales={datosMovilesFormateados} 
        subgrupos={subgrupos}
        personas={personas}
        crearMovilAction={crearMovil}
      />
    </main>
  );
}
