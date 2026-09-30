import { prisma } from "@/lib/prisma";

export type FilaAsistencia = {
  choferId: string;
  nombre: string;
  grupoNombre: string;
  diasProgramados: number;
  presentes: number;
  reemplazos: number;
  ausencias: number;
  pct: number;
  estado: "Buena" | "Regular" | "Crítica" | "Sin datos";
};

export function calcularEstado(pct: number, diasProgramados: number): FilaAsistencia["estado"] {
  if (diasProgramados === 0) return "Sin datos";
  if (pct >= 90) return "Buena";
  if (pct >= 75) return "Regular";
  return "Crítica";
}

export async function calcularAsistenciaPorChofer(
  empresaId: string,
  desde: Date,
  hasta: Date,
  grupoId?: string
) {
  // Un chofer "titular" es cualquier persona asignada como choferTitular de al menos un móvil.
  const moviles = await prisma.movil.findMany({
    where: {
      empresaId,
      choferTitularId: { not: null },
      ...(grupoId ? { subgrupo: { grupoId } } : {}),
    },
    include: {
      choferTitular: true,
      subgrupo: { include: { grupo: true } },
    },
  });

  if (moviles.length === 0) return [];

  const movilIds = moviles.map((m) => m.id);

  const programacion = await prisma.programacionDiaria.findMany({
    where: {
      movilId: { in: movilIds },
      fecha: { gte: desde, lte: hasta },
    },
    select: { movilId: true, choferId: true },
  });

  const porMovil = new Map<string, { choferId: string | null }[]>();
  for (const p of programacion) {
    const lista = porMovil.get(p.movilId) ?? [];
    lista.push({ choferId: p.choferId });
    porMovil.set(p.movilId, lista);
  }

  type Acumulado = {
    nombre: string;
    grupoNombre: string;
    diasProgramados: number;
    presentes: number;
    reemplazos: number;
    ausencias: number;
  };
  const porChofer = new Map<string, Acumulado>();

  for (const movil of moviles) {
    const choferTitularId = movil.choferTitularId!;
    const acumulado = porChofer.get(choferTitularId) ?? {
      nombre: movil.choferTitular!.nombre,
      grupoNombre: movil.subgrupo ? `Gr.${movil.subgrupo.grupo.nombre} ${movil.subgrupo.nombre}` : "Sin grupo",
      diasProgramados: 0,
      presentes: 0,
      reemplazos: 0,
      ausencias: 0,
    };

    const filas = porMovil.get(movil.id) ?? [];
    for (const fila of filas) {
      acumulado.diasProgramados++;
      if (fila.choferId === choferTitularId) acumulado.presentes++;
      else if (fila.choferId) acumulado.reemplazos++;
      else acumulado.ausencias++;
    }

    porChofer.set(choferTitularId, acumulado);
  }

  const resultado: FilaAsistencia[] = Array.from(porChofer.entries()).map(([choferId, a]) => {
    const pct = a.diasProgramados > 0 ? Math.round((a.presentes / a.diasProgramados) * 100) : 0;
    return {
      choferId,
      nombre: a.nombre,
      grupoNombre: a.grupoNombre,
      diasProgramados: a.diasProgramados,
      presentes: a.presentes,
      reemplazos: a.reemplazos,
      ausencias: a.ausencias,
      pct,
      estado: calcularEstado(pct, a.diasProgramados),
    };
  });

  resultado.sort((a, b) => b.pct - a.pct);
  return resultado;
}
