import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { ClientWrapperCaja } from "./ClientWrapperCaja";

// --- SERVER ACTION REAL INTEGRADA INLINE (Cero errores de importación) ---
async function crearIngresoCajaReal(formData: FormData) {
  "use server";
  
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("No autorizado");
  const empresaId = (session.user as any).empresaId as string;
  const usuarioId = (session.user as any).id as string;

  const montoStr = formData.get("monto") as string;
  const paradaId = formData.get("paradaId") as string;
  const tipoIngresoId = formData.get("tipoIngresoId") as string;

  if (!montoStr || !paradaId || !tipoIngresoId) {
    throw new Error("Monto, Parada y Concepto son obligatorios");
  }

  try {
    await prisma.ingreso.create({
      data: {
        monto: parseFloat(montoStr),
        empresa: { connect: { id: empresaId } },
        parada: { connect: { id: paradaId } },
        tipoIngreso: { connect: { id: tipoIngresoId } },
        registradoPor: { connect: { id: usuarioId } }
      }
    });

    revalidatePath("/dashboard/caja");
  } catch (error) {
    console.error("Error al registrar ingreso de caja:", error);
    throw new Error("Error en el servidor al procesar el flujo contable");
  }
}

// --- COMPONENTE DE LA PÁGINA PRINCIPAL ---
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
      comprobante: i.id.substring(0, 6).toUpperCase()
    };
  });

  return (
    <main style={{ width: "100%", padding: "1rem 1.5rem", boxSizing: "border-box", overflow: "hidden" }}>
      <ClientWrapperCaja 
        ingresosIniciales={datosCajaFormateados}
        paradas={paradas}
        tiposIngreso={tiposIngreso}
        action={crearIngresoCajaReal} // Conectamos la acción real local
      />
    </main>
  );
}
