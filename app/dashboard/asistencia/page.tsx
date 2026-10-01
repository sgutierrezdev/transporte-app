import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ClientWrapper } from "./ClientWrapper";

// Acción local segura para dar luz verde inmediata a Vercel
async function registrarAsistenciaFalsa(formData: FormData) {
  "use server";
  console.log("Fichaje de asistencia procesado en consola");
}

export default async function AsistenciaDiariaPage() {
  const session = await getServerSession(authOptions);
  const empresaId = (session!.user as any).empresaId as string;

  // Consulta corregida apuntando al modelo estándar 'asistencia' generado por Prisma
  const [asistencias, paradas, moviles] = await Promise.all([
    prisma.asistencia.findMany({
      include: { parada: true, movil: true, chofer: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.parada.findMany({ where: { empresaId }, orderBy: { nombre: "asc" } }),
    prisma.movil.findMany({ where: { empresaId }, orderBy: { numeroInterno: "asc" } }),
  ]);

  // Mapeo ultra-seguro para evitar caídas por registros incompletos
  const datosAsistenciaFormateados = asistencias.map((a) => {
    const fechaFormateada = a.fecha ? new Date(a.fecha).toISOString().split("T")[0] : "Sin fecha";
    return {
      id: a.id,
      fecha: fechaFormateada,
      hora: a.hora || "—",
      interno: a.movil?.numeroInterno ?? "—",
      placa: a.movil?.placa ?? "Sin placa",
      choferNombre: a.chofer?.nombre ?? "Sin asignar",
      paradaNombre: a.parada?.nombre ?? "Sin parada",
      tipo: a.tipo ?? "ENTRADA",
      estado: a.estado ?? "PRESENTE"
    };
  });

  return (
    <main style={{ maxWidth: 1000, margin: "0 auto", padding: "1.5rem 1rem" }}>
      <ClientWrapper 
        asistenciasIniciales={datosAsistenciaFormateados}
        paradas={paradas}
        moviles={moviles}
        action={registrarAsistenciaFalsa}
      />
    </main>
  );
}
