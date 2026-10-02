"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import BotonCerrarSesion from "@/components/BotonCerrarSesion";

const GRUPOS = [
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

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [abierto, setAbierto] = useState(false);
  
  // ESTADO MAESTRO DE ACCESIBILIDAD: 100% (Chica), 115% (Mediana), 135% (Grande)
  const [zoom, setZoom] = useState<string>("100%");

  return (
    <div>
      {/* 1. CABECERA SUPERIOR RESPONSIVA FIJA PARA CELULARES */}
      <div className="dash-mobile-bar" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", height: "50px", background: "#1e2761", color: "#fff", padding: "0 16px", position: "fixed", top: 0, zIndex: 1030, boxSizing: "border-box" }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <button onClick={() => setAbierto(true)} className="dash-hamburger" style={{ background: "none", border: "none", color: "#fff", fontSize: 24, cursor: "pointer", marginRight: 12 }}>☰</button>
          <strong style={{ fontSize: "14px" }}>Sistema de Transporte</strong>
        </div>

        {/* SELECTOR ADAPTATIVO EN CABECERA MÓVIL */}
        <div style={{ display: "flex", gap: "3px", background: "rgba(255,255,255,0.1)", padding: "2px", borderRadius: "4px" }}>
          <button type="button" onClick={() => setZoom("85%")} style={{ padding: "3px 6px", fontSize: "10px", fontWeight: "bold", border: "none", borderRadius: "3px", cursor: "pointer", background: zoom === "85%" ? "#fff" : "transparent", color: zoom === "85%" ? "#1e2761" : "#fff" }}>A-</button>
          <button type="button" onClick={() => setZoom("100%")} style={{ padding: "3px 6px", fontSize: "10px", fontWeight: "bold", border: "none", borderRadius: "3px", cursor: "pointer", background: zoom === "100%" ? "#fff" : "transparent", color: zoom === "100%" ? "#1e2761" : "#fff" }}>A</button>
          <button type="button" onClick={() => setZoom("120%")} style={{ padding: "3px 6px", fontSize: "10px", fontWeight: "bold", border: "none", borderRadius: "3px", cursor: "pointer", background: zoom === "120%" ? "#fff" : "transparent", color: zoom === "120%" ? "#1e2761" : "#fff" }}>A+</button>
        </div>
      </div>

      {abierto && <div className="dash-overlay" onClick={() => setAbierto(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 1035 }} />}

      {/* 2. MENÚ LATERAL AZUL CLÁSICO DE ESCRITORIO */}
      <aside className={`dash-sidebar${abierto ? " open" : ""}`}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <strong style={{ fontSize: "15px" }}>Sistema de transporte</strong>
          <button onClick={() => setAbierto(false)} style={{ background: "none", border: "none", color: "#fff", fontSize: 18, cursor: "pointer" }}>✕</button>
        </div>
        <p style={{ fontSize: "12px", color: "#cadcfc", margin: "2px 0 20px" }}>Administración</p>

        {GRUPOS.map((grupo, i) => (
          <div key={i}>
            {grupo.titulo && <p className="dash-nav-titulo">{grupo.titulo}</p>}
            {grupo.enlaces.map((enlace) => {
              const activo = pathname === enlace.href;
              return (
                <Link key={enlace.href} href={enlace.href} onClick={() => setAbierto(false)} className={`dash-nav-item${activo ? " active" : ""}`}>
                  {enlace.label}
                </Link>
              );
            })}
          </div>
        ))}

        {/* SELECTOR INTEGRADO EN SIDEBAR PARA MONITORES Y LAPTOPS */}
        <div style={{ marginTop: "20px", paddingTop: "12px", borderTop: "0.5px solid rgba(255,255,255,.15)" }}>
          <p style={{ fontSize: "10px", color: "#8aaeff", margin: "0 0 6px 0", fontWeight: 700, textTransform: "uppercase" }}>Tamaño General</p>
          <div style={{ display: "flex", gap: "4px", background: "rgba(0,0,0,0.2)", padding: "3px", borderRadius: "6px" }}>
            <button type="button" onClick={() => setZoom("85%")} style={{ flex: 1, padding: "4px", fontSize: "11px", fontWeight: "bold", border: "none", borderRadius: "4px", cursor: "pointer", background: zoom === "85%" ? "#fff" : "transparent", color: zoom === "85%" ? "#1e2761" : "#cadcfc" }}>A-</button>
            <button type="button" onClick={() => setZoom("100%")} style={{ flex: 1, padding: "4px", fontSize: "11px", fontWeight: "bold", border: "none", borderRadius: "4px", cursor: "pointer", background: zoom === "100%" ? "#fff" : "transparent", color: zoom === "100%" ? "#1e2761" : "#cadcfc" }}>A</button>
            <button type="button" onClick={() => setZoom("120%")} style={{ flex: 1, padding: "4px", fontSize: "11px", fontWeight: "bold", border: "none", borderRadius: "4px", cursor: "pointer", background: zoom === "120%" ? "#fff" : "transparent", color: zoom === "120%" ? "#1e2761" : "#cadcfc" }}>A+</button>
          </div>
        </div>

        <div style={{ marginTop: 24, paddingTop: 16, borderTop: "0.5px solid rgba(255,255,255,.15)" }}>
          <BotonCerrarSesion claro />
        </div>
      </aside>

      {/* 3. ENVOLTORIO MAESTRO DE NAVEGACIÓN CON ZOOM REACTIVO FORZADO */}
      <div 
        className="admin-content-wrapper" 
        style={{ 
          fontSize: zoom,           // Inyección reactiva nativa
          transformOrigin: "top left"
        }}
      >
        {children}
      </div>
    </div>
  );
}
