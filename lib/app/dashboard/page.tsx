import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NOMBRE_ROL } from "@/lib/constants";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const rol = (session.user as any).rol as string;
  const empresaId = (session.user as any).empresaId as string;

  const [paradas, gruposCount, movilesCount, personasCount] = await Promise.all([
    prisma.parada.findMany({
      where: { empresaId },
      include: { secretaria: true },
    }),
    prisma.grupo.count({ where: { empresaId } }),
    prisma.movil.count({ where: { empresaId } }),
    prisma.persona.count({ where: { empresaId } }),
  ]);

  return (
    <main style={{ maxWidth: 900, margin: "0 auto", padding: "2rem 1rem" }}>
      <p style={{ fontSize: 13, color: "#5b6591" }}>
        Sesión iniciada como {NOMBRE_ROL[rol] ?? rol}
      </p>
      <h1 style={{ fontSize: 24, marginTop: 4 }}>Panel general</h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
          gap: 12,
          margin: "1.5rem 0",
        }}
      >
        <Metric label="Personas" value={personasCount} />
        <Metric label="Grupos" value={gruposCount} />
        <Metric label="Móviles" value={movilesCount} />
        <Metric label="Paradas registradas" value={paradas.length} />
      </div>

      <h2 style={{ fontSize: 16, marginTop: 24 }}>Paradas</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {paradas.length === 0 && (
          <p style={{ fontSize: 13, color: "#5b6591" }}>
            Todavía no hay paradas registradas.
          </p>
        )}
        {paradas.map((p) => (
          <div
            key={p.id}
            style={{
              padding: "12px 16px",
              background: "#fff",
              border: "0.5px solid #d9deee",
              borderRadius: 12,
            }}
          >
            <p style={{ fontWeight: 500, margin: 0 }}>{p.nombre}</p>
            <p style={{ fontSize: 13, color: "#5b6591", margin: 0 }}>
              {p.ubicacion} · Secretaria: {p.secretaria?.nombre ?? "Sin asignar"}
            </p>
          </div>
        ))}
      </div>
    </main>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div
      style={{
        background: "#eef2fb",
        borderRadius: 8,
        padding: "1rem",
      }}
    >
      <p style={{ fontSize: 13, color: "#5b6591", margin: "0 0 4px" }}>
        {label}
      </p>
      <p style={{ fontSize: 24, fontWeight: 500, margin: 0 }}>{value}</p>
    </div>
  );
}
