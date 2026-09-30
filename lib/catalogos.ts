import { prisma } from "@/lib/prisma";

export const TIPO_COBRO_MULTA = "Cobro de multa";

/**
 * Crea los tipos por defecto que falten (multas, gastos e ingresos) sin tocar
 * los que ya existen. Se puede llamar las veces que haga falta.
 * Los montos de las multas son un punto de partida: la empresa los define.
 */
export async function asegurarCatalogos(empresaId: string) {
  await prisma.tipoInfraccion.createMany({
    data: [
      { empresaId, nombre: "Tardanza", montoFijo: 20 },
      { empresaId, nombre: "Ausencia", montoFijo: 50 },
      { empresaId, nombre: "Abandono de ruta", montoFijo: 80 },
    ],
    skipDuplicates: true,
  });

  await prisma.tipoGasto.createMany({
    data: [
      { empresaId, nombre: "Sueldo secretaria" },
      { empresaId, nombre: "Insumos de limpieza" },
      { empresaId, nombre: "Mantenimiento" },
      { empresaId, nombre: "Otros" },
    ],
    skipDuplicates: true,
  });

  await prisma.tipoIngreso.createMany({
    data: [
      { empresaId, nombre: TIPO_COBRO_MULTA },
      { empresaId, nombre: "Caja chica" },
      { empresaId, nombre: "Cuota de socio" },
      { empresaId, nombre: "Donación" },
      { empresaId, nombre: "Otro ingreso" },
    ],
    skipDuplicates: true,
  });
}
