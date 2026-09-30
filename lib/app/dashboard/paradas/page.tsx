import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { crearParada } from "@/lib/actions/paradas";

export default async function ParadasPage() {
  const session = await getServerSession(authOptions);
  const empresaId = (session!.user as any).empresaId as string;

  const [paradas, personas] = await Promise.all([
    prisma.parada.findMany({
      where: { empresaId },
      include: { secretaria: true },
      orderBy: { nombre: "asc" },
    }),
    prisma.persona.findMany({ where: { empresaId }, orderBy: { nombre: "asc" } }),
  ]);

  return (
    <main style={{ maxWidth: 900, margin: "0 auto", padding: "2rem 1rem" }}>
      <h1 style={{ fontSize: 24, marginBottom: 4 }}>Paradas</h1>
      <p style={{ fontSize: 13, color: "#5b6591", marginBottom: 20 }}>
        {paradas.length} registradas
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 32 }}>
        {paradas.length === 0 && (
          <p style={{ fontSize: 13, color: "#5b6591" }}>Todavía no hay paradas registradas.</p>
        )}
        {paradas.map((p) => (
          <Link
            key={p.id}
            href={`/dashboard/paradas/${p.id}`}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <div
              style={{
                padding: "12px 16px",
                background: "#fff",
                border: "0.5px solid #d9deee",
                borderRadius: 12,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <p style={{ fontWeight: 500, margin: 0 }}>{p.nombre}</p>
                <p style={{ fontSize: 13, color: "#5b6591", margin: 0 }}>
                  {p.ubicacion} · Secretaria: {p.secretaria?.nombre ?? "sin asignar"}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div
        style={{
          background: "#fff",
          border: "0.5px solid #d9deee",
          borderRadius: 12,
          padding: "1.25rem",
        }}
      >
        <p style={{ fontWeight: 500, marginTop: 0, marginBottom: 16 }}>Nueva parada</p>
        <form action={crearParada} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <Campo label="Nombre">
            <input name="nombre" required style={estiloInput} />
          </Campo>
          <Campo label="Ubicación">
            <select name="ubicacion" defaultValue="Ciudad" style={estiloInput}>
              <option value="Ciudad">Ciudad</option>
              <option value="Provincia">Provincia</option>
            </select>
          </Campo>
          <Campo label="Secretaria">
            <select name="secretariaId" defaultValue="" style={estiloInput}>
              <option value="">Sin asignar</option>
              {personas.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.nombre}
                </option>
              ))}
            </select>
          </Campo>
          <button type="submit" style={estiloBotonPrimario}>
            Registrar parada
          </button>
        </form>
      </div>
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
