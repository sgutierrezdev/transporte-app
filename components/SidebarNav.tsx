"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import BotonCerrarSesion from "./BotonCerrarSesion";

const GRUPOS: { titulo: string | null; enlaces: { href: string; label: string }[] }[] = [
  { titulo: null, enlaces: [{ href: "/dashboard", label: "Panel" }] },
  {
    titulo: "Gestión",
    enlaces: [
      { href: "/dashboard/personas", label: "Personas" },
      { href: "/dashboard/moviles", label: "Móviles" },
      { href: "/dashboard/grupos", label: "Grupos" },
      { href: "/dashboard/paradas", label: "Paradas" },
    ],
  },
  {
    titulo: "Operación",
    enlaces: [
      { href: "/dashboard/rotacion", label: "Rotación diaria" },
      { href: "/dashboard/programacion", label: "Programación diaria" },
      { href: "/dashboard/asistencia", label: "Asistencia diaria" },
      { href: "/dashboard/caja", label: "Caja por parada" },
      { href: "/dashboard/infracciones", label: "Infracciones y Sanciones" }, // <-- INTEGRADOR MAESTRO AQUÍ
    ],
  },
  {
    titulo: "Análisis",
    enlaces: [
      { href: "/dashboard/reportes", label: "Reportes" },
      { href: "/dashboard/importar", label: "Importar Excel" },
    ],
  },
];

export default function SidebarNav() {
  const pathname = usePathname();
  const [abierto, setAbierto] = useState(false);

  return (
    <>
      <div className="dash-mobile-bar">
        <button onClick={() => setAbierto(true)} aria-label="Abrir menú" className="dash-hamburger">
          ☰
        </button>
        <strong style={{ fontSize: 14 }}>Sistema de transporte</strong>
      </div>

      {abierto && <div className="dash-overlay" onClick={() => setAbierto(false)} />}

      <aside className={`dash-sidebar${abierto ? " open" : ""}`}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <strong style={{ fontSize: 15 }}>Sistema de transporte</strong>
          <button
            onClick={() => setAbierto(false)}
            aria-label="Cerrar menú"
            className="dash-cerrar-movil"
          >
            ✕
          </button>
        </div>
        <p style={{ fontSize: 12, color: "#cadcfc", margin: "2px 0 20px" }}>Administración</p>

        {GRUPOS.map((grupo, i) => (
          <div key={i}>
            {grupo.titulo && <p className="dash-nav-titulo">{grupo.titulo}</p>}
            {grupo.enlaces.map((enlace) => {
              const activo = pathname === enlace.href;
              return (
                <Link
                  key={enlace.href}
                  href={enlace.href}
                  onClick={() => setAbierto(false)}
                  className={`dash-nav-item${activo ? " active" : ""}`}
                >
                  {enlace.label}
                </Link>
              );
            })}
          </div>
        ))}

        <div style={{ marginTop: 24, paddingTop: 16, borderTop: "0.5px solid rgba(255,255,255,.15)" }}>
          <BotonCerrarSesion claro />
        </div>
      </aside>
    </>
  );
}
