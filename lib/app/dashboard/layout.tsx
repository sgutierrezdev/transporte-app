import Link from "next/link";
import BotonCerrarSesion from "@/components/BotonCerrarSesion";

const ENLACES = [
  { href: "/dashboard", label: "Panel" },
  { href: "/dashboard/personas", label: "Personas" },
  { href: "/dashboard/moviles", label: "Móviles" },
  { href: "/dashboard/grupos", label: "Grupos" },
  { href: "/dashboard/paradas", label: "Paradas" },
  { href: "/dashboard/rotacion", label: "Rotación diaria" },
  { href: "/dashboard/programacion", label: "Programación diaria" },
  { href: "/dashboard/importar", label: "Importar Excel" },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ minHeight: "100vh" }}>
      <header
        style={{
          background: "#fff",
          borderBottom: "0.5px solid #d9deee",
          padding: "12px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
          <strong style={{ color: "#1e2761" }}>Sistema de transporte</strong>
          <nav style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            {ENLACES.map((enlace) => (
              <Link
                key={enlace.href}
                href={enlace.href}
                style={{ fontSize: 13, color: "#5b6591", textDecoration: "none" }}
              >
                {enlace.label}
              </Link>
            ))}
          </nav>
        </div>
        <BotonCerrarSesion />
      </header>
      {children}
    </div>
  );
}
