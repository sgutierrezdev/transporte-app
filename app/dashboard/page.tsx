import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NOMBRE_ROL } from "@/lib/constants";
import { obtenerActividadReciente } from "@/lib/actividad";

const ICONO: Record<string, string> = {
  persona: "👤",
  chofer: "🚐",
  rotacion: "🔁",
  programacion: "📋",
  asistencia: "✅",
  gasto: "💸",
  ingreso: "💰",
};

function tiempoRelativo(fecha: Date) {
  const diffMs = Date.now() - fecha.getTime();
  const min = Math.floor(diffMs / 60000);
  if (min < 1) return "recién";
  if (min < 60) return `hace ${min} min`;
  const horas = Math.floor(min / 60);
  if (horas < 24) return `hace ${horas} h`;
  const dias = Math.floor(horas / 24);
  if (dias === 1) return "ayer";
  return `hace ${dias} días`;
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const rol = (session.user as any).rol as string;
  const empresaId = (session.user as any).empresaId as string;

  const [paradas, gruposCount, movilesCount, personasCount, actividad] = await Promise.all([
    prisma.parada.findMany({
      where: { empresaId },
      include: { secretaria: true },
    }),
    prisma.grupo.count({ where: { empresaId } }),
    prisma.movil.count({ where: { empresaId } }),
    prisma.persona.count({ where: { empresaId } }),
    obtenerActividadReciente(empresaId, 8),
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
        <MetricLink href="/dashboard/personas" label="Personas" value={personasCount} />
        <MetricLink href="/dashboard/grupos" label="Grupos" value={gruposCount} />
        <MetricLink href="/dashboard/moviles" label="Móviles" value={movilesCount} />
        <MetricLink href="/dashboard/paradas" label="Paradas registradas" value={paradas.length} />
      </div>

      <h2 style={{ fontSize: 16, marginTop: 24 }}>Paradas</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 24 }}>
        {paradas.length === 0 && (
          <p style={{ fontSize: 13, color: "#5b6591" }}>
            Todavía no hay paradas registradas.
          </p>
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
              }}
            >
              <p style={{ fontWeight: 500, margin: 0 }}>{p.nombre}</p>
              <p style={{ fontSize: 13, color: "#5b6591", margin: 0 }}>
                {p.ubicacion} · Secretaria: {p.secretaria?.nombre ?? "Sin asignar"}
              </p>
            </div>
          </Link>
        ))}
      </div>

      <h2 style={{ fontSize: 16, marginTop: 24 }}>Actividad reciente</h2>
      <div
        style={{
          background: "#fff",
          border: "0.5px solid #d9deee",
          borderRadius: 12,
          padding: "0.5rem 1rem",
        }}
      >
        {actividad.length === 0 && (
          <p style={{ fontSize: 13, color: "#5b6591", padding: "0.75rem 0" }}>
            Todavía no hay actividad registrada.
          </p>
        )}
        {actividad.map((ev, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              gap: 10,
              alignItems: "center",
              padding: "10px 0",
              borderBottom: i < actividad.length - 1 ? "0.5px solid #d9deee" : "none",
            }}
          >
            <span style={{ fontSize: 16 }} aria-hidden="true">
              {ICONO[ev.icono] ?? "•"}
            </span>
            <p style={{ margin: 0, fontSize: 13, flex: 1 }}>{ev.texto}</p>
            <span style={{ fontSize: 12, color: "#5b6591", whiteSpace: "nowrap" }}>
              {tiempoRelativo(ev.fecha)}
            </span>
          </div>
        ))}
      </div>
    </main>
  );
}

function MetricLink({ href, label, value }: { href: string; label: string; value: number }) {
  return (
    <Link href={href} style={{ textDecoration: "none", color: "inherit" }}>
      <div
        style={{
          background: "#eef2fb",
          borderRadius: 8,
          padding: "1rem",
        }}
      >
        <p
          style={{
            fontSize: 13,
            color: "#5b6591",
            margin: "0 0 4px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {label} <span aria-hidden="true">→</span>
        </p>
        <p style={{ fontSize: 24, fontWeight: 500, margin: 0 }}>{value}</p>
      </div>
    </Link>
  );
}
