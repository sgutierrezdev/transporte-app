import { prisma } from "@/lib/prisma";

export type EventoActividad = {
  fecha: Date;
  icono: "persona" | "chofer" | "rotacion" | "programacion" | "asistencia" | "gasto" | "ingreso";
  texto: string;
};

export async function obtenerActividadReciente(empresaId: string, limite = 8) {
  const [personas, cambiosChofer, rotaciones, asistencias, programacionReciente, gastos, ingresos] = await Promise.all([
    prisma.persona.findMany({
      where: { empresaId },
      orderBy: { createdAt: "desc" },
      take: limite,
      select: { nombre: true, createdAt: true },
    }),
    prisma.movilChoferHistorial.findMany({
      where: { movil: { empresaId } },
      orderBy: { createdAt: "desc" },
      take: limite,
      include: { movil: true, chofer: true },
    }),
    prisma.rotacionDiaria.findMany({
      where: { subgrupo: { grupo: { empresaId } } },
      orderBy: { createdAt: "desc" },
      take: limite,
      include: { subgrupo: { include: { grupo: true } }, parada: true },
    }),
    prisma.asistencia.findMany({
      where: { programacionDiaria: { movil: { empresaId } } },
      orderBy: { createdAt: "desc" },
      take: limite,
      include: { persona: true },
    }),
    prisma.programacionDiaria.groupBy({
      by: ["fecha"],
      where: { movil: { empresaId } },
      _count: { _all: true },
      _max: { createdAt: true },
      orderBy: { _max: { createdAt: "desc" } },
      take: 3,
    }),
    prisma.gasto.findMany({
      where: { empresaId },
      orderBy: { createdAt: "desc" },
      take: limite,
      include: { tipoGasto: true, parada: true },
    }),
    prisma.ingreso.findMany({
      where: { empresaId, anulado: false },
      orderBy: { createdAt: "desc" },
      take: limite,
      include: { tipoIngreso: true, parada: true },
    }),
  ]);

  const eventos: EventoActividad[] = [];

  for (const p of personas) {
    eventos.push({ fecha: p.createdAt, icono: "persona", texto: `Nueva persona registrada: ${p.nombre}` });
  }
  for (const c of cambiosChofer) {
    eventos.push({
      fecha: c.createdAt,
      icono: "chofer",
      texto: `Interno ${c.movil.numeroInterno} — chofer titular: ${c.chofer.nombre}`,
    });
  }
  for (const r of rotaciones) {
    eventos.push({
      fecha: r.createdAt,
      icono: "rotacion",
      texto: `Rotación Grupo ${r.subgrupo.grupo.nombre} — Subgrupo ${r.subgrupo.nombre} asignado a ${r.parada.nombre}`,
    });
  }
  for (const a of asistencias) {
    const label = a.estado === "A_TIEMPO" ? "a tiempo" : a.estado === "TARDANZA" ? "con tardanza" : a.estado === "ABANDONO" ? "abandono de ruta" : "ausente";
    eventos.push({
      fecha: a.createdAt,
      icono: "asistencia",
      texto: `${a.persona.nombre} — asistencia registrada (${label})`,
    });
  }
  for (const g of programacionReciente) {
    if (!g._max.createdAt) continue;
    eventos.push({
      fecha: g._max.createdAt,
      icono: "programacion",
      texto: `Programación del ${g.fecha.toLocaleDateString("es-BO")} generada (${g._count._all} filas)`,
    });
  }
  for (const gasto of gastos) {
    eventos.push({
      fecha: gasto.createdAt,
      icono: "gasto",
      texto: `Gasto en ${gasto.parada.nombre}: ${gasto.tipoGasto.nombre} — Bs ${Number(gasto.monto).toFixed(2)}`,
    });
  }

  for (const i of ingresos) {
    eventos.push({
      fecha: i.createdAt,
      icono: "ingreso",
      texto: `Ingreso en ${i.parada.nombre}: ${i.tipoIngreso.nombre} — Bs ${Number(i.monto).toFixed(2)} (comprobante N° ${String(i.numeroComprobante).padStart(6, "0")})`,
    });
  }

  eventos.sort((a, b) => b.fecha.getTime() - a.fecha.getTime());
  return eventos.slice(0, limite);
}
