import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { crearGrupo } from "@/lib/actions/grupos";

export default async function GruposPage() {
  const session = await getServerSession(authOptions);
  const empresaId = (session!.user as any).empresaId as string;

  const [grupos, personas] = await Promise.all([
    prisma.grupo.findMany({
      where: { empresaId },
      include: {
        subgrupos: { include: { moviles: true } },
        jefeHistorial: { where: { fechaFin: null }, include: { jefe: true } },
      },
      orderBy: { nombre: "asc" },
    }),
    prisma.persona.findMany({ where: { empresaId }, orderBy: { nombre: "asc" } }),
  ]);

  return (
    <main style={{ maxWidth: 900, margin: "0 auto", padding: "2rem 1rem" }}>
      <h1 style={{ fontSize: 24, marginBottom: 4 }}>Grupos</h1>
      <p style={{ fontSize: 13, color: "#5b6591", marginBottom: 20 }}>
        {grupos.length} registrados · cada grupo se crea con sus subgrupos A y B
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 32 }}>
        {grupos.length === 0 && (
          <p style={{ fontSize: 13, color: "#5b6591" }}>Todavía no hay grupos registrados.</p>
        )}
        {grupos.map((g) => {
          const totalMoviles = g.subgrupos.reduce((acc, s) => acc + s.moviles.length, 0);
          const jefe = g.jefeHistorial[0]?.jefe;
          return (
            <Link
              key={g.id}
              href={`/dashboard/grupos/${g.id}`}
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
                  <p style={{ fontWeight: 500, margin: 0 }}>Grupo {g.nombre}</p>
                  <p style={{ fontSize: 13, color: "#5b6591", margin: 0 }}>
                    Jefe de línea: {jefe?.nombre ?? "sin asignar"} · {totalMoviles} móviles en
                    subgrupos A/B
                  </p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      <div
        style={{
          background: "#fff",
          border: "0.5px solid #d9deee",
          borderRadius: 12,
          padding: "1.25rem",
        }}
      >
        <p style={{ fontWeight: 500, marginTop: 0, marginBottom: 16 }}>Nuevo grupo</p>
        <form action={crearGrupo} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <Campo label="Nombre (ej. 1, 2, 3)">
            <input name="nombre" required style={estiloInput} />
          </Campo>
          <Campo label="Jefe de línea (opcional, se puede asignar después)">
            <select name="jefeId" defaultValue="" style={estiloInput}>
              <option value="">Sin asignar</option>
              {personas.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nombre}
                </option>
              ))}
            </select>
          </Campo>
          <button type="submit" style={estiloBotonPrimario}>
            Registrar grupo (crea subgrupos A y B)
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
