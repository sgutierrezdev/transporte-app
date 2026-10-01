import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { crearParada } from "@/lib/actions/paradas";
import { ComponenteParadasCliente } from "./ComponenteParadasCliente";

export default async function ParadasPage() {
  const session = await getServerSession(authOptions);
  const empresaId = (session!.user as any).empresaId as string;

  // Ejecutamos tu consulta original conectada a Neon en paralelo
  const [paradas, personas] = await Promise.all([
    prisma.parada.findMany({
      where: { empresaId },
      include: { secretaria: true },
      orderBy: { nombre: "asc" },
    }),
    prisma.persona.findMany({ where: { empresaId }, orderBy: { nombre: "asc" } }),
  ]);

  // Formateamos los campos planos legibles para el componente interactivo
  const datosParadasFormateados = paradas.map((p) => ({
    id: p.id,
    nombre: p.nombre,
    ubicacion: p.ubicacion,
    secretariaNombre: p.secretaria?.nombre ?? "Sin asignar"
  }));

  return (
    <main style={{ maxWidth: 1000, margin: "0 auto", padding: "1.5rem 1rem" }}>
      <ComponenteParadasCliente 
        paradasIniciales={datosParadasFormateados}
        personas={personas}
        crearParadaAction={crearParada}
      />
    </main>
  );
}
