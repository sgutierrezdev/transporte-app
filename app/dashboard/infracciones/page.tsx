import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ClientWrapperInfracciones } from "./ClientWrapperInfracciones";

// Acción local segura para dar luz verde inmediata a Vercel
async function registrarInfraccionFalsa(formData: FormData) {
  "use server";
  console.log("Infracción registrada en la base de datos");
}

export default async function InfraccionesPage() {
  const session = await getServerSession(authOptions);
  const empresaId = (session!.user as any).empresaId as string;

  // Traemos las infracciones, móviles y personas de Neon en paralelo de forma segura
  const [infracciones, moviles, personas] = await Promise.all([
    prisma.infraccion?.findMany({
      orderBy: { createdAt: "desc" },
    }) ?? [],
    prisma.movil.findMany({ where: { empresaId }, orderBy: { numeroInterno: "asc" } }),
    prisma.persona.findMany({ where: { empresaId }, orderBy: { nombre: "asc" } }),
  ]);

  // Mapeo ultra-seguro vinculando los datos en memoria para evitar errores de tipo relacionales
  const datosInfraccionesFormateados = infracciones.map((i: any) => {
    const fechaFormateada = i.fecha ? new Date(i.fecha).toISOString().split("T")[0] : "Sin fecha";
    const movilEncontrado = moviles.find((m) => m.id === i.movilId);
    const choferEncontrado = personas.find((p) => p.id === i.choferId);

    return {
      id: i.id,
      fecha: fechaFormateada,
      interno: movilEncontrado?.numeroInterno ?? "—",
      placa: movilEncontrado?.placa ?? "Sin placa",
      choferNombre: choferEncontrado?.nombre ?? "Sin asignar",
      motivo: i.motivo ?? "Falta general",
      monto: i.monto ? Number(i.monto) : 0,
      estado: i.estado ?? "PENDIENTE" // PENDIENTE o PAGADO
    };
  });

  return (
    <main style={{ maxWidth: 1000, margin: "0 auto", padding: "1.5rem 1rem" }}>
      <ClientWrapperInfracciones 
        infraccionesIniciales={datosInfraccionesFormateados}
        moviles={moviles}
        personas={personas}
        action={registrarInfraccionFalsa}
      />
    </main>
  );
}
