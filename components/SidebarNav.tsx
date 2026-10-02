"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import BotonCerrarSesion from "./BotonCerrarSesion";

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

export default function SidebarNav() {
  const pathname = usePathname();
  const [abierto, setAbierto] = useState(false);
  
  // Leemos el tamaño guardado o el mediano por defecto
  const [escala, setEscala] = useState<string>("mediana");

  useEffect(() => {
    const root = document.documentElement;
    if (escala === "chica") root.style.setProperty("--escala-fuente", "0.85rem");
    if (escala === "mediana") root.style.setProperty("--escala-fuente", "1rem");
    if (escala === "grande") root.style.setProperty("--escala-fuente", "1.2rem");
  }, [escala]);

  return (
    <>
      {/* CABECERA SUPERIOR MÓVIL ESTÁNDAR */}
      <div className="dash-mobile-bar">
        <button onClick={() => setAbierto(true)} className="dash-hamburger">☰</button>
        <strong style={{ fontSize: "14px" }}>Sistema de Transporte</strong>
        
        {/* SELECTOR ADAPTATIVO ADENTRO PARA QUE TAMBIÉN SE VEA EN MÓVILES */}
        <div style={{ display: "flex", gap: "2px", background: "rgba(255,255,255,0.1)", padding: "2px", borderRadius: "4px", marginLeft: "auto" }}>
          <button type="button" onClick={() => setEscala("chica")} style={{ padding: "3px 6px", fontSize: "10px", fontWeight: "bold", border: "none", borderRadius: "3px", cursor: "pointer", background: escala === "chica" ? "#fff" : "transparent", color: escala === "chica" ? "#1e2761" : "#fff" }}>A-</button>
          <button type="button" onClick={() => setEscala("mediana")} style={{ padding: "3px 6px", fontSize: "10px", fontWeight: "bold", border: "none", borderRadius: "3px", cursor: "pointer", background: escala === "mediana" ? "#fff" : "transparent", color: escala === "mediana" ? "#1e2761" : "#fff" }}>A</button>
          <button type="button" onClick={() => setEscala("grande")} style={{ padding: "3px 6px", fontSize: "10px", fontWeight: "bold", border: "none", borderRadius: "3px", cursor: "pointer", background: escala === "grande" ? "#fff" : "transparent", color: escala === "grande" ? "#1e2761" : "#fff" }}>A+</button>
        </div>
      </div>

      {abierto && <div className="dash-overlay" onClick={() => setAbierto(false)} />}

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

        {/* SELECTOR ADICIONAL EN LA BARRA LATERAL PARA PANTALLAS GRANDES */}
        <div style={{ marginTop: "20px", paddingTop: "12px", borderTop: "0.5px solid rgba(255,255,255,.15)" }}>
          <p style={{ fontSize: "10px", color: "#8aaeff", margin: "0 0 6px 0", fontWeight: 700, textTransform: "uppercase" }}>Tamaño de Pantalla</p>
          <div style={{ display: "flex", gap: "4px", background: "rgba(0,0,0,0.2)", padding: "3px", borderRadius: "6px" }}>
            <button type="button" onClick={() => setEscala("chica")} style={{ flex: 1, padding: "4px", fontSize: "11px", fontWeight: "bold", border: "none", borderRadius: "4px", cursor: "pointer", background: escala === "chica" ? "#fff" : "transparent", color: escala === "chica" ? "#1e2761" : "#cadcfc" }}>A-</button>
            <button type="button" onClick={() => setEscala("mediana")} style={{ flex: 1, padding: "4px", fontSize: "11px", fontWeight: "bold", border: "none", borderRadius: "4px", cursor: "pointer", background: escala === "mediana" ? "#fff" : "transparent", color: escala === "mediana" ? "#1e2761" : "#cadcfc" }}>A</button>
            <button type="button" onClick={() => setEscala("grande")} style={{ flex: 1, padding: "4px", fontSize: "11px", fontWeight: "bold", border: "none", borderRadius: "4px", cursor: "pointer", background: escala === "grande" ? "#fff" : "transparent", color: escala === "grande" ? "#1e2761" : "#cadcfc" }}>A+</button>
          </div>
        </div>

        <div style={{ marginTop: 24, paddingTop: 16, borderTop: "0.5px solid rgba(255,255,255,.15)" }}>
          <BotonCerrarSesion claro />
        </div>
      </aside>
    </>
  );
}
