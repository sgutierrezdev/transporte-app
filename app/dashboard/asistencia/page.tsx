import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { registrarAsistencia } from "@/lib/actions/asistencia"; 
import { ComponenteAsistenciaCliente } from "./ComponenteAsistenciaCliente";

export default async function AsistenciaDiariaPage() {
  const session = await getServerSession(authOptions);
  const empresaId = (session!.user as any).empresaId as string;

  // Traemos los registros de asistencia, paradas y móviles conectados de forma relacional
  const [asistencias, paradas, moviles] = await Promise.all([
    prisma.asistenciaDiaria.findMany({
      where: { empresaId },
      include: { parada: true, movil: true, chofer: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.parada.findMany({ where: { empresaId }, orderBy: { nombre: "asc" } }),
    prisma.movil.findMany({ where: { empresaId }, orderBy: { numeroInterno: "asc" } }),
  ]);

  // Formateamos las líneas para que se acomoden verticalmente en el componente del cliente
  const datosAsistenciaFormateados = asistencias.map((a) => ({
    id: a.id,
    fecha: a.fecha.toISOString().split("T")[0],
    hora: a.hora || "—",
    interno: a.movil?.numeroInterno ?? "—",
    placa: a.movil?.placa ?? "Sin placa",
    choferNombre: a.chofer?.nombre ?? "Sin asignar",
    paradaNombre: a.parada?.nombre ?? "Sin parada",
    tipo: a.tipo ?? "ENTRADA", // ENTRADA o SALIDA
    estado: a.estado ?? "PRESENTE" // PRESENTE, TARDE, FALTA
  }));

  return (
    <main style={{ maxWidth: 1000, margin: "0 auto", padding: "1.5rem 1rem" }}>
      <ComponenteAsistenciaCliente 
        asistenciasIniciales={datosAsistenciaFormateados}
        paradas={paradas}
        moviles={moviles}
        registrarAction={registrarAsistencia}
      />
    </main>
  );
}
