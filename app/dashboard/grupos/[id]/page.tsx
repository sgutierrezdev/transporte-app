import Link from "next/link";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { cambiarJefeGrupo, eliminarGrupo } from "@/lib/actions/grupos";

export default async function DetalleGrupoPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  const empresaId = (session!.user as any).empresaId as string;

  const [grupo, personas] = await Promise.all([
    prisma.grupo.findFirst({
      where: { id: params.id, empresaId },
      include: {
        subgrupos: { include: { moviles: true }, orderBy: { nombre: "asc" } },
        jefeHistorial: {
          include: { jefe: true },
          orderBy: { fechaInicio: "desc" },
        },
      },
    }),
    prisma.persona.findMany({ where: { empresaId }, orderBy: { nombre: "asc" } }),
  ]);
  if (!grupo) notFound();

  const jefeActual = grupo.jefeHistorial.find((h) => h.fechaFin === null);
  const cambiarJefe = cambiarJefeGrupo.bind(null, grupo.id);
  const eliminar = eliminarGrupo.bind(null, grupo.id);

  return (
    <main style={{ maxWidth: 700, margin: "0 auto", padding: "2rem 1rem" }}>
      <h1 style={{ fontSize: 24, marginBottom: 4 }}>Grupo {grupo.nombre}</h1>
      <p style={{ fontSize: 13, color: "#5b6591", marginBottom: 24 }}>
        Jefe de línea actual: {jefeActual?.jefe.nombre ?? "sin asignar"}
      </p>

      <section style={{ marginBottom: 24 }}>
        <p style={{ fontWeight: 500, marginBottom: 8 }}>Subgrupos</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {grupo.subgrupos.map((s) => (
            <div
              key={s.id}
              style={{
                padding: "12px 16px",
                background: "#fff",
                border: "0.5px solid #d9deee",
                borderRadius: 12,
              }}
            >
              <p style={{ fontWeight: 500, margin: 0 }}>Subgrupo {s.nombre}</p>
              <p style={{ fontSize: 13, color: "#5b6591", margin: 0 }}>
                {s.moviles.length} móviles
              </p>
            </div>
          ))}
        </div>
      </section>

      <section
        style={{
          background: "#fff",
          border: "0.5px solid #d9deee",
          borderRadius: 12,
          padding: "1.25rem",
          marginBottom: 24,
        }}
      >
        <p style={{ fontWeight: 500, marginTop: 0, marginBottom: 12 }}>Cambiar jefe de línea</p>
        <form action={cambiarJefe} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <Campo label="Nuevo jefe">
            <select name="jefeId" defaultValue="" required style={estiloInput}>
              <option value="" disabled>
                Elegir persona
              </option>
              {personas.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nombre}
                </option>
              ))}
            </select>
          </Campo>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Campo label="Efectivo desde">
              <input
                name="fecha"
                type="date"
                defaultValue={new Date().toISOString().slice(0, 10)}
                style={estiloInput}
              />
            </Campo>
            <Campo label="Motivo (opcional)">
              <input name="motivo" style={estiloInput} placeholder="Ej. renuncia, rotación" />
            </Campo>
          </div>
          <button type="submit" style={estiloBotonPrimario}>
            Registrar cambio de jefe
          </button>
        </form>
      </section>

      <section style={{ marginBottom: 24 }}>
        <p style={{ fontWeight: 500, marginBottom: 8 }}>Historial de jefes de línea</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {grupo.jefeHistorial.length === 0 && (
            <p style={{ fontSize: 13, color: "#5b6591" }}>Sin historial todavía.</p>
          )}
          {grupo.jefeHistorial.map((h) => (
            <div
              key={h.id}
              style={{
                padding: "10px 14px",
                background: "#fff",
                border: "0.5px solid #d9deee",
                borderRadius: 10,
                fontSize: 13,
              }}
            >
              <strong>{h.jefe.nombre}</strong> — desde{" "}
              {h.fechaInicio.toISOString().slice(0, 10)} hasta{" "}
              {h.fechaFin ? h.fechaFin.toISOString().slice(0, 10) : "hoy"}
              {h.motivo ? ` · ${h.motivo}` : ""}
            </div>
          ))}
        </div>
      </section>

      <form action={eliminar}>
        <button type="submit" style={estiloBotonPeligro}>
          Eliminar grupo
        </button>
      </form>

      <p style={{ marginTop: 24 }}>
        <Link href="/dashboard/grupos" style={{ fontSize: 13, color: "#5b6591" }}>
          ← Volver a grupos
        </Link>
      </p>
    </main>
  );
}

function Campo({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label style={{ display: "block" }}>
      <span style={{ fontSize: 13, color: "#5b6591", display: "block", marginBottom: 4 }}>
        {label}
      </span>
      {children}
    </label>
  );
}

const estiloInput: React.CSSProperties = {
  width: "100%",
  padding: "8px 10px",
  borderRadius: 8,
  border: "1px solid #d9deee",
};

const estiloBotonPrimario: React.CSSProperties = {
  padding: "10px",
  borderRadius: 8,
  border: "none",
  background: "#1e2761",
  color: "#fff",
  fontWeight: 500,
  cursor: "pointer",
};

const estiloBotonPeligro: React.CSSProperties = {
  padding: "8px 14px",
  borderRadius: 8,
  border: "1px solid #e3b3b3",
  background: "#fff",
  color: "#a32d2d",
  cursor: "pointer",
  fontSize: 13,
};
