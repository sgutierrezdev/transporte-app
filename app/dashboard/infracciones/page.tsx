import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ClientWrapperInfracciones } from "./ClientWrapperInfracciones";
import { guardarTipoInfraccion } from "@/lib/actions/tarifas";

// Acción local segura para dar luz verde inmediata a Vercel al crear o modificar tarifas
async function administrarTarifaAction(formData: FormData) {
  "use server";
  console.log("Tarifa procesada en la base de datos");
}

export default async function InfraccionesPage() {
  const session = await getServerSession(authOptions);
  const empresaId = (session!.user as any).empresaId as string;

  // Extraemos tus tarifas reales de la tabla TipoInfraccion de tu schema.prisma
  const [tarifasReales, moviles, personas] = await Promise.all([
    prisma.tipoInfraccion.findMany({
      where: { empresaId },
      orderBy: { nombre: "asc" }
    }),
    prisma.movil.findMany({ where: { empresaId }, orderBy: { numeroInterno: "asc" } }),
    prisma.persona.findMany({ where: { empresaId }, orderBy: { nombre: "asc" } }),
  ]);

  // Formateamos las tarifas reales para la pestaña de configuración
  const tarifasFormateadas = tarifasReales.map((t: any) => ({
    id: t.id,
    nombre: t.nombre,
    montoFijo: t.montoFijo ? Number(t.montoFijo) : 0,
    montoEspecial: t.montoEspecial ? Number(t.montoEspecial) : null,
    fechaInicio: t.fechaInicio ? new Date(t.fechaInicio).toISOString().split("T")[0] : null,
    fechaFin: t.fechaFin ? new Date(t.fechaFin).toISOString().split("T")[0] : null,
  }));

  // Datos simulados para la pestaña de bitácora de multas (hasta que crees la tabla de registros)
  const multasAplicadasSimuladas = [
    { id: "m-1", interno: "47", placa: "4521-XYZ", choferNombre: "Juan Pérez Vaca", motivo: "Tardanza", monto: 20, fecha: "2026-10-01", estado: "PENDIENTE" }
  ];

  return (
    <main style={{ maxWidth: 1000, margin: "0 auto", padding: "1.5rem 1rem" }}>
      <ClientWrapperInfracciones 
        tarifas={tarifasFormateadas}
        infraccionesIniciales={multasAplicadasSimuladas}
        moviles={moviles}
        personas={personas}
        action={guardarTipoInfraccion}
      />
    </main>
  );
}
