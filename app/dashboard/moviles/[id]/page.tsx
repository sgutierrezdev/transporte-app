import Link from "next/link";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  actualizarMovil,
  eliminarMovil,
  cambiarTitularMovil,
  registrarReemplazoDiario,
} from "@/lib/actions/moviles";

export default async function DetalleMovilPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  const empresaId = (session!.user as any).empresaId as string;

  const [movil, subgrupos, personas] = await Promise.all([
    prisma.movil.findFirst({
      where: { id: params.id, empresaId },
      include: {
        choferHistorial: { include: { chofer: true, autorizadoPor: true }, orderBy: { fechaInicio: "desc" } },
        reemplazos: { include: { chofer: true }, orderBy: { fecha: "desc" }, take: 10 },
      },
    }),
    prisma.subgrupo.findMany({
      where: { grupo: { empresaId } },
      include: { grupo: true },
      orderBy: [{ grupo: { nombre: "asc" } }, { nombre: "asc" }],
    }),
    prisma.persona.findMany({ where: { empresaId }, orderBy: { nombre: "asc" } }),
  ]);
  if (!movil) notFound();

  const actualizar = actualizarMovil.bind(null, movil.id);
  const eliminar = eliminarMovil.bind(null, movil.id);
  const cambiarTitular = cambiarTitularMovil.bind(null, movil.id);
  const registrarReemplazo = registrarReemplazoDiario.bind(null, movil.id);

  return (
    <main style={{ maxWidth: 700, margin: "0 auto", padding: "2rem 1rem" }}>
      <h1 style={{ fontSize: 24, marginBottom: 20 }}>Interno {movil.numeroInterno}</h1>

      <form
        action={actualizar}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 12,
          background: "#fff",
          border: "0.5px solid #d9deee",
          borderRadius: 12,
          padding: "1.25rem",
          marginBottom: 16,
        }}
      >
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <Campo label="Número de interno">
            <input name="numeroInterno" defaultValue={movil.numeroInterno} required style={estiloInput} />
          </Campo>
          <Campo label="Placa">
            <input name="placa" defaultValue={movil.placa ?? ""} style={estiloInput} />
          </Campo>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <Campo label="Capacidad">
            <input name="capacidad" type="number" defaultValue={movil.capacidad ?? ""} style={estiloInput} />
          </Campo>
          <Campo label="Subgrupo">
            <select name="subgrupoId" defaultValue={movil.subgrupoId ?? ""} style={estiloInput}>
              <option value="">Sin asignar</option>
              {subgrupos.map((s) => (
                <option key={s.id} value={s.id}>
                  Grupo {s.grupo.nombre} - {s.nombre}
                </option>
              ))}
            </select>
          </Campo>
        </div>
        <Campo label="Socio dueño">
          <select name="socioId" defaultValue={movil.socioId ?? ""} style={estiloInput}>
            <option value="">Sin asignar</option>
            {personas.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nombre}
              </option>
            ))}
          </select>
        </Campo>
        <button type="submit" style={estiloBotonPrimario}>
          Guardar cambios
        </button>
      </form>

      <section
        style={{
          background: "#fff",
          border: "0.5px solid #d9deee",
          borderRadius: 12,
          padding: "1.25rem",
          marginBottom: 16,
        }}
      >
        <p style={{ fontWeight: 500, marginTop: 0, marginBottom: 4 }}>
          Cambiar titular (definitivo)
        </p>
        <p style={{ fontSize: 12, color: "#5b6591", marginTop: 0, marginBottom: 12 }}>
          Queda registrado en el historial con fecha, motivo y quién lo autorizó.
        </p>
        <form action={cambiarTitular} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <Campo label="Nuevo titular">
            <select name="choferId" defaultValue="" required style={estiloInput}>
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
            <Campo label="Motivo">
              <input name="motivo" style={estiloInput} placeholder="Ej. renuncia, cambio de contrato" />
            </Campo>
          </div>
          <button type="submit" style={estiloBotonPrimario}>
            Registrar cambio de titular
          </button>
        </form>
      </section>

      <section
        style={{
          background: "#fff",
          border: "0.5px solid #d9deee",
          borderRadius: 12,
          padding: "1.25rem",
          marginBottom: 16,
        }}
      >
        <p style={{ fontWeight: 500, marginTop: 0, marginBottom: 4 }}>Reemplazo puntual</p>
        <p style={{ fontSize: 12, color: "#5b6591", marginTop: 0, marginBottom: 12 }}>
          Para un solo día, sin cambiar quién es el titular.
        </p>
        <form action={registrarReemplazo} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Campo label="Fecha">
              <input name="fecha" type="date" required style={estiloInput} />
            </Campo>
            <Campo label="Chofer reemplazante">
              <select name="choferId" defaultValue="" required style={estiloInput}>
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
          </div>
          <Campo label="Motivo (opcional)">
            <input name="motivo" style={estiloInput} />
          </Campo>
          <button type="submit" style={estiloBotonPrimario}>
            Registrar reemplazo
          </button>
        </form>

        {movil.reemplazos.length > 0 && (
          <div style={{ marginTop: 16 }}>
            <p style={{ fontSize: 13, fontWeight: 500, marginBottom: 6 }}>Últimos reemplazos</p>
            {movil.reemplazos.map((r) => (
              <div key={r.id} style={{ fontSize: 13, color: "#5b6591", marginBottom: 4 }}>
                {r.fecha.toISOString().slice(0, 10)} — {r.chofer.nombre}
                {r.motivo ? ` (${r.motivo})` : ""}
              </div>
            ))}
          </div>
        )}
      </section>

      <section style={{ marginBottom: 24 }}>
        <p style={{ fontWeight: 500, marginBottom: 8 }}>Historial de titulares</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {movil.choferHistorial.length === 0 && (
            <p style={{ fontSize: 13, color: "#5b6591" }}>Sin historial todavía.</p>
          )}
          {movil.choferHistorial.map((h) => (
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
              <strong>{h.chofer.nombre}</strong> — desde{" "}
              {h.fechaInicio.toISOString().slice(0, 10)} hasta{" "}
              {h.fechaFin ? h.fechaFin.toISOString().slice(0, 10) : "hoy"}
              {h.motivo ? ` · ${h.motivo}` : ""}
              {h.autorizadoPor ? ` · autorizó ${h.autorizadoPor.nombre}` : ""}
            </div>
          ))}
        </div>
      </section>

      <form action={eliminar}>
        <button type="submit" style={estiloBotonPeligro}>
          Eliminar móvil
        </button>
      </form>

      <p style={{ marginTop: 24 }}>
        <Link href="/dashboard/moviles" style={{ fontSize: 13, color: "#5b6591" }}>
          ← Volver a móviles
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
