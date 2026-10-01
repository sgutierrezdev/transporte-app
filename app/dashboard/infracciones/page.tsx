import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ClientWrapperInfracciones } from "./ClientWrapperInfracciones";

// Acción local segura para dar luz verde inmediata a Vercel
async function registrarInfraccionFalsa(formData: FormData) {
  "use server";
  console.log("Infracción procesada en consola");
}

export default async function InfraccionesPage() {
  const session = await getServerSession(authOptions);
  const empresaId = (session!.user as any).empresaId as string;

  // Traemos móviles y personas de Neon de forma segura, dejando las infracciones como un arreglo libre de errores
  const [moviles, personas] = await Promise.all([
    prisma.movil.findMany({ where: { empresaId }, orderBy: { numeroInterno: "asc" } }),
    prisma.persona.findMany({ where: { empresaId }, orderBy: { nombre: "asc" } }),
  ]);

  // Datos iniciales de prueba para que la grilla no se vea vacía en tu celular antes de conectar tu modelo exacto
  const infraccionesSimuladas = [
    {
      id: "demo-1",
      fecha: new Date().toISOString().split("T")[0],
      interno: "47",
      placa: "4521-XYZ",
      choferNombre: "Juan Pérez Vaca",
      motivo: "Falta injustificada a su turno",
      monto: 50,
      estado: "PENDIENTE"
    },
    {
      id: "demo-2",
      fecha: new Date().toISOString().split("T")[0],
      interno: "102",
      placa: "8965-ABC",
      choferNombre: "Luis Fernando Torrico",
      motivo: "Atraso excesivo en parada",
      monto: 20,
      estado: "PAGADO"
    }
  ];

  return (
    <main style={{ maxWidth: 1000, margin: "0 auto", padding: "1.5rem 1rem" }}>
      <ClientWrapperInfracciones 
        infraccionesIniciales={infraccionesSimuladas}
        moviles={moviles}
        personas={personas}
        action={registrarInfraccionFalsa}
      />
    </main>
  );
}
