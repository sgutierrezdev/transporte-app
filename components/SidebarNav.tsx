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
      { href: "/dashboard/infracciones", label: "Infracciones y Sanciones" },
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
  // Forzamos a que empiece estrictamente cerrado en falsy
  const [abierto, setAbierto] = useState(false);

  return (
    <>
      {/* BARRA SUPERIOR FIJA PARA CELULARES */}
      <div 
        className="dash-mobile-bar" 
        style={{
          position: "sticky",
          top: 0,
          zIndex: 40,
          width: "100%",
          display: "flex",
          alignItems: "center",
          gap: "12px",
          padding: "10px 16px",
          background: "#1e2761",
          color: "#fff",
          boxSizing: "border-box"
        }}
      >
        <button 
          onClick={() => setAbierto(true)} 
          aria-label="Abrir menú" 
          style={{ background: "none", border: "none", color: "#fff", fontSize: 20, cursor: "pointer", padding: 0 }}
        >
          ☰
        </button>
        <strong style={{ fontSize: 14 }}>Sistema de transporte</strong>
      </div>

      {/* CAPA OSCURA DE FONDO CUANDO EL MENÚ ESTÁ ABIERTO */}
      {abierto && (
        <div 
          onClick={() => setAbierto(false)} 
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 49 }} 
        />
      )}

      {/* MENÚ LATERAL AZUL (SIDEBAR) RESPONSIVO */}
      <aside 
        style={{
          position: "fixed",
          top: 0,
          bottom: 0,
          left: 0,
          width: "260px",
          background: "#1e2761",
          color: "#fff",
          padding: "20px 16px",
          zIndex: 50,
          boxSizing: "border-box",
          overflowY: "auto",
          transition: "transform 0.3s ease",
          // La magia responsiva: si está abierto en móvil se muestra, si no se oculta usando traslación
          transform: abierto ? "translateX(0)" : "translateX(-100%)",
        }}
        // Esta clase inline asegura compatibilidad con pantallas de escritorio grandes (donde siempre debe ser visible fijo)
        className={`custom-sidebar-desktop`}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
          <strong style={{ fontSize: 15 }}>Sistema de transporte</strong>
          <button
            onClick={() => setAbierto(false)}
            aria-label="Cerrar menú"
            style={{ background: "none", border: "none", color: "#fff", fontSize: 16, cursor: "pointer" }}
          >
            ✕
          </button>
        </div>
        <p style={{ fontSize: 12, color: "#cadcfc", margin: "0 0 20px 0" }}>Administración</p>

        {GRUPOS.map((grupo, i) => (
          <div key={i} style={{ marginBottom: 16 }}>
            {grupo.titulo && <p style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em", color: "#8aaeff", margin: "0 0 8px 0", fontWeight: 700 }}>{grupo.titulo}</p>}
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {grupo.enlaces.map((enlace) => {
                const activo = pathname === enlace.href;
                return (
                  <Link
                    key={enlace.href}
                    href={enlace.href}
                    onClick={() => setAbierto(false)}
                    style={{
                      padding: "8px 12px",
                      borderRadius: 6,
                      textDecoration: "none",
                      color: activo ? "#fff" : "#cadcfc",
                      background: activo ? "rgba(255,255,255,0.15)" : "transparent",
                      fontSize: 13,
                      fontWeight: activo ? 600 : 500,
                      display: "block"
                    }}
                  >
                    {enlace.label}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}

        <div style={{ marginTop: 24, paddingTop: 16, borderTop: "0.5px solid rgba(255,255,255,.15)" }}>
          <BotonCerrarSesion claro />
        </div>
      </aside>

      {/* ESTILO CSS AUXILIAR PARA ESCRITORIO (Para pantallas grandes la barra no se oculta) */}
      <style jsx global>{`
        @media (min-width: 992px) {
          .dash-mobile-bar { display: none !important; }
          .custom-sidebar-desktop {
            transform: translateX(0) !important;
            position: fixed !important;
          }
          main { margin-left: 260px !important; }
        }
      `}</style>
    </>
  );
}
