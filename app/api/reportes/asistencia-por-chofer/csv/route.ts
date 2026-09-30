import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { calcularAsistenciaPorChofer } from "@/lib/reportes/asistenciaPorChofer";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const empresaId = (session.user as any).empresaId as string;

  const { searchParams } = new URL(req.url);
  const desdeStr = searchParams.get("desde");
  const hastaStr = searchParams.get("hasta");
  const grupoId = searchParams.get("grupo") || undefined;
  const estadoFiltro = searchParams.get("estado") || "";

  const desde = desdeStr ? new Date(desdeStr) : new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  const hasta = hastaStr ? new Date(hastaStr) : new Date();

  let filas = await calcularAsistenciaPorChofer(empresaId, desde, hasta, grupoId);
  if (estadoFiltro) filas = filas.filter((f) => f.estado === estadoFiltro);

  const encabezado = "Chofer,Grupo,Dias programados,Presentes,Reemplazos,Ausencias,% Asistencia,Estado";
  const filasCsv = filas.map((f) =>
    [f.nombre, f.grupoNombre, f.diasProgramados, f.presentes, f.reemplazos, f.ausencias, `${f.pct}%`, f.estado]
      .map((v) => `"${String(v).replace(/"/g, '""')}"`)
      .join(",")
  );
  const csv = [encabezado, ...filasCsv].join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="asistencia-por-chofer.csv"`,
    },
  });
}
