import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { calcularAsistenciaPorChofer } from "@/lib/reportes/asistenciaPorChofer";
import BotonImprimir from "@/components/BotonImprimir";
import BuscadorLista from "@/components/BuscadorLista";

function inicioDeMes() {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth(), 1).toISOString().slice(0, 10);
}
function hoy() {
  return new Date().toISOString().slice(0, 10);
}

const COLOR_ESTADO: Record<string, { bg: string; fg: string }> = {
  Buena: { bg: "#e6f4ea", fg: "#1e7e34" },
  Regular: { bg: "#fff6d9", fg: "#8a6d1d" },
  Crítica: { bg: "#fbe7e7", fg: "#a32d2d" },
  "Sin datos": { bg: "#eef2fb", fg: "#5b6591" },
};

export default async function ReporteAsistenciaPorChoferPage({
  searchParams,
}: {
  searchParams: { desde?: string; hasta?: string; grupo?: string; estado?: string };
}) {
  const session = await getServerSession(authOptions);
  const empresaId = (session!.user as any).empresaId as string;

  const desdeStr = searchParams.desde || inicioDeMes();
  const hastaStr = searchParams.hasta || hoy();
  const grupoId = searchParams.grupo || "";
  const estadoFiltro = searchParams.estado || "";

  const desde = new Date(desdeStr);
  const hasta = new Date(hastaStr);

  const [grupos, filas] = await Promise.all([
    prisma.grupo.findMany({ where: { empresaId }, orderBy: { nombre: "asc" } }),
    calcularAsistenciaPorChofer(empresaId, desde, hasta, grupoId || undefined),
  ]);

  const filasFiltradas = estadoFiltro ? filas.filter((f) => f.estado === estadoFiltro) : filas;

  const choferesAnalizados = filasFiltradas.length;
  const promedioAsistencia = choferesAnalizados
    ? Math.round(filasFiltradas.reduce((acc, f) => acc + f.pct, 0) / choferesAnalizados)
    : 0;
  const reemplazosTotales = filasFiltradas.reduce((acc, f) => acc + f.reemplazos, 0);
  const ausenciasTotales = filasFiltradas.reduce((acc, f) => acc + f.ausencias, 0);
  const criticos = filasFiltradas.filter((f) => f.estado === "Crítica").length;

  const items = filasFiltradas.map((f) => ({
    id: f.choferId,
    texto: f.nombre,
    nodo: (
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr 1fr 1fr",
          gap: 8,
          alignItems: "center",
          padding: "10px 16px",
          background: "#fff",
          border: "0.5px solid #d9deee",
          borderRadius: 12,
          fontSize: 13,
        }}
      >
        <span style={{ fontWeight: 500 }}>{f.nombre}</span>
        <span style={{ color: "#5b6591" }}>{f.grupoNombre}</span>
        <span>{f.diasProgramados}</span>
        <span style={{ color: "#1e7e34" }}>{f.presentes}</span>
        <span style={{ color: "#8a6d1d" }}>{f.reemplazos}</span>
        <span style={{ color: "#a32d2d" }}>{f.ausencias}</span>
        <span
          style={{
            justifySelf: "start",
            padding: "3px 10px",
            borderRadius: 999,
            fontSize: 12,
            background: COLOR_ESTADO[f.estado].bg,
            color: COLOR_ESTADO[f.estado].fg,
          }}
        >
          {f.pct}% · {f.estado}
        </span>
      </div>
    ),
  }));

  return (
    <main style={{ maxWidth: 1100, margin: "0 auto", padding: "2rem 1rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 24, marginBottom: 4 }}>Asistencia por chofer</h1>
          <p style={{ fontSize: 13, color: "#5b6591", margin: 0 }}>
            Período {new Date(desdeStr).toLocaleDateString("es-BO")} — {new Date(hastaStr).toLocaleDateString("es-BO")}
          </p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <BotonImprimir />
          <a
            href={`/api/reportes/asistencia-por-chofer/csv?desde=${desdeStr}&hasta=${hastaStr}&grupo=${grupoId}&estado=${estadoFiltro}`}
            style={{
              padding: "8px 14px",
              borderRadius: 8,
              border: "none",
              background: "#1e2761",
              color: "#fff",
              fontSize: 13,
              textDecoration: "none",
            }}
          >
            Exportar CSV
          </a>
        </div>
      </div>

      <form
        method="get"
        style={{
          display: "flex",
          gap: 12,
          flexWrap: "wrap",
          alignItems: "flex-end",
          background: "#fff",
          border: "0.5px solid #d9deee",
          borderRadius: 12,
          padding: "1rem",
          margin: "16px 0",
        }}
      >
        <Campo label="Desde">
          <input type="date" name="desde" defaultValue={desdeStr} style={estiloInput} />
        </Campo>
        <Campo label="Hasta">
          <input type="date" name="hasta" defaultValue={hastaStr} style={estiloInput} />
        </Campo>
        <Campo label="Grupo">
          <select name="grupo" defaultValue={grupoId} style={estiloInput}>
            <option value="">Todos los grupos</option>
            {grupos.map((g) => (
              <option key={g.id} value={g.id}>
                Grupo {g.nombre}
              </option>
            ))}
          </select>
        </Campo>
        <Campo label="Estado">
          <select name="estado" defaultValue={estadoFiltro} style={estiloInput}>
            <option value="">Todos</option>
            <option value="Buena">Buena</option>
            <option value="Regular">Regular</option>
            <option value="Crítica">Crítica</option>
            <option value="Sin datos">Sin datos</option>
          </select>
        </Campo>
        <button type="submit" style={estiloBotonPrimario}>
          Aplicar
        </button>
        <a href="/dashboard/reportes/asistencia-por-chofer" style={{ fontSize: 13, color: "#5b6591" }}>
          Limpiar
        </a>
      </form>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 12, marginBottom: 20 }}>
        <Metrica label="Choferes analizados" valor={choferesAnalizados} />
        <Metrica label="Asistencia promedio" valor={`${promedioAsistencia}%`} />
        <Metrica label="Reemplazos totales" valor={reemplazosTotales} />
        <Metrica label="Ausencias totales" valor={ausenciasTotales} />
        <Metrica label="Con asistencia crítica" valor={criticos} />
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr 1fr 1fr",
          gap: 8,
          padding: "0 16px",
          marginBottom: 8,
          fontSize: 12,
          color: "#5b6591",
        }}
      >
        <span>Chofer</span>
        <span>Grupo</span>
        <span>Días prog.</span>
        <span>Presentes</span>
        <span>Reemplazos</span>
        <span>Ausencias</span>
        <span>% Asistencia</span>
      </div>

      <BuscadorLista items={items} placeholder="Buscar chofer..." />
    </main>
  );
}

function Campo({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label style={{ display: "block" }}>
      <span style={{ fontSize: 12, color: "#5b6591", display: "block", marginBottom: 4 }}>{label}</span>
      {children}
    </label>
  );
}

function Metrica({ label, valor }: { label: string; valor: string | number }) {
  return (
    <div style={{ background: "#eef2fb", borderRadius: 8, padding: "1rem" }}>
      <p style={{ fontSize: 12, color: "#5b6591", margin: "0 0 4px" }}>{label}</p>
      <p style={{ fontSize: 22, fontWeight: 500, margin: 0 }}>{valor}</p>
    </div>
  );
}

const estiloInput: React.CSSProperties = {
  padding: "8px 10px",
  borderRadius: 8,
  border: "1px solid #d9deee",
};

const estiloBotonPrimario: React.CSSProperties = {
  padding: "9px 16px",
  borderRadius: 8,
  border: "none",
  background: "#1e2761",
  color: "#fff",
  fontWeight: 500,
  fontSize: 13,
  cursor: "pointer",
};
