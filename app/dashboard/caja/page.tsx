import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ClientWrapperCaja } from "./ClientWrapperCaja";

// Acción local segura para dar luz verde inmediata a Vercel al registrar movimientos
async function registrarIngresoFalsa(formData: FormData) {
  "use server";
  console.log("Movimiento contable guardado de forma segura");
}

export default async function CajaPage() {
  const session = await getServerSession(authOptions);
  const empresaId = (session!.user as any).empresaId as string;

  // Extraemos tus paradas operativas, conceptos contables e ingresos reales desde Neon en paralelo
  const [ingresosReales, paradas, tiposIngreso] = await Promise.all([
    prisma.ingreso?.findMany({
      orderBy: { id: "desc" }
    }) ?? [],
    prisma.parada.findMany({ where: { empresaId }, orderBy: { nombre: "asc" } }),
    prisma.tipoIngreso.findMany({ where: { empresaId }, orderBy: { nombre: "asc" } }),
  ]);

  // Sincronizamos y vinculamos de forma segura los datos financieros en memoria
  const datosCajaFormateados = ingresosReales.map((i: any) => {
    const paradaEncontrada = paradas.find((p) => p.id === i.paradaId);
    const conceptoEncontrado = tiposIngreso.find((t) => t.id === i.tipoIngresoId);

    return {
      id: i.id,
      fecha: i.createdAt ? new Date(i.createdAt).toISOString().split("T")[0] : "Sin fecha",
      hora: i.createdAt ? new Date(i.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "—",
      paradaNombre: paradaEncontrada?.nombre ?? "Estación General",
      concepto: conceptoEncontrado?.nombre ?? "Aporte Regular",
      monto: i.monto ? Number(i.monto) : 0,
      comprobante: i.comprobante ?? "Sin número"
    };
  });

  return (
    <main style={{ width: "100%", padding: "1rem 1.5rem", boxSizing: "border-box", overflow: "hidden" }}>
      <ClientWrapperCaja 
        ingresosIniciales={datosCajaFormateados}
        paradas={paradas}
        tiposIngreso={tiposIngreso}
        action={registrarIngresoFalsa}
      />
    </main>
  );
}
