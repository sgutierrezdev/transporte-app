import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ComponenteDashboardCliente } from "./ComponenteDashboardCliente";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  const empresaId = (session!.user as any).empresaId as string;

  // Extraemos los conteos y datos reales de la base de datos en paralelo
  const [conteoPersonas, conteoGrupos, conteoMoviles, paradas, asistencias] = await Promise.all([
    prisma.persona.count({ where: { empresaId } }),
    prisma.grupo.count({ where: { empresaId } }),
    prisma.movil.count({ where: { empresaId } }),
    prisma.parada.findMany({
      where: { empresaId },
      include: { secretaria: true },
      orderBy: { nombre: "asc" },
    }),
    prisma.asistencia.findMany({
      take: 5, // Traemos solo los últimos 5 fichajes para la bitácora de actividad reciente
      orderBy: { id: "desc" },
    }),
  ]);

  // Formateamos las paradas para la grilla modular
  const paradasFormateadas = paradas.map((p) => ({
    id: p.id,
    nombre: p.nombre,
    detalles: `${p.ubicacion} · ${p.secretaria?.nombre ?? "Sin asignar"}`
  }));

  // Formateamos la bitácora de actividad reciente de forma segura
  const actividadFormateada = asistencias.map((a: any) => {
    const horaTexto = a.createdAt ? new Date(a.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "00:00";
    return {
      id: a.id,
      texto: `Unidad registrada con estado ${a.estado ?? "A_TIEMPO"}`,
      hora: `Hoy, ${horaTexto}`,
      icono: "🚌"
    };
  });

  return (
    <main style={{ width: "100%", padding: "1rem 1.5rem", boxSizing: "border-box", overflow: "hidden" }}>
      <ComponenteDashboardCliente 
        metricas={{ personas: conteoPersonas, grupos: conteoGrupos, moviles: conteoMoviles, paradas: paradas.length }}
        paradas={paradasFormateadas}
        actividad={actividadFormateada}
      />
    </main>
  );
}
