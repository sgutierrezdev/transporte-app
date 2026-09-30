import Link from "next/link";

const REPORTES = [
  {
    href: "/dashboard/reportes/asistencia-por-chofer",
    titulo: "Asistencia por chofer",
    descripcion: "Presencias, reemplazos y ausencias de cada chofer titular en un período.",
    listo: true,
  },
  {
    href: "#",
    titulo: "Historial de interno",
    descripcion: "Todos los choferes y subgrupos que tuvo un interno, con fechas.",
    listo: false,
  },
  {
    href: "#",
    titulo: "Historial de socio",
    descripcion: "Internos de un socio, su chofer actual y días activos de cada uno.",
    listo: false,
  },
  {
    href: "#",
    titulo: "Rotación de paradas por grupo",
    descripcion: "A qué paradas fue cada subgrupo a lo largo del tiempo.",
    listo: false,
  },
  {
    href: "#",
    titulo: "Ranking de tardanzas y ausencias",
    descripcion: "Choferes ordenados de mayor a menor incumplimiento, con monto penalizado.",
    listo: false,
  },
  {
    href: "#",
    titulo: "Historial de jefes de línea",
    descripcion: "Quién fue jefe de cada grupo y en qué fechas exactas.",
    listo: false,
  },
  {
    href: "#",
    titulo: "Ocupación de paradas",
    descripcion: "Qué paradas reciben más o menos grupos, para detectar sobrecarga.",
    listo: false,
  },
  {
    href: "#",
    titulo: "Resumen ejecutivo mensual",
    descripcion: "Una página con los totales clave del mes, lista para imprimir para la reunión de socios.",
    listo: false,
  },
];

export default function ReportesPage() {
  return (
    <main style={{ maxWidth: 900, margin: "0 auto", padding: "2rem 1rem" }}>
      <h1 style={{ fontSize: 24, marginBottom: 4 }}>Reportes</h1>
      <p style={{ fontSize: 13, color: "#5b6591", marginBottom: 20 }}>
        Elegí un reporte. Los que todavía no están armados se van agregando bajo pedido.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 12 }}>
        {REPORTES.map((r) => {
          const contenido = (
            <div
              style={{
                background: "#fff",
                border: "0.5px solid #d9deee",
                borderRadius: 12,
                padding: "1rem",
                height: "100%",
                opacity: r.listo ? 1 : 0.55,
              }}
            >
              <p style={{ fontWeight: 500, margin: "0 0 6px" }}>{r.titulo}</p>
              <p style={{ fontSize: 13, color: "#5b6591", margin: 0 }}>{r.descripcion}</p>
              {!r.listo && (
                <p style={{ fontSize: 12, color: "#8a6d1d", margin: "8px 0 0" }}>Próximamente</p>
              )}
            </div>
          );
          return r.listo ? (
            <Link key={r.titulo} href={r.href} style={{ textDecoration: "none", color: "inherit" }}>
              {contenido}
            </Link>
          ) : (
            <div key={r.titulo}>{contenido}</div>
          );
        })}
      </div>
    </main>
  );
}
