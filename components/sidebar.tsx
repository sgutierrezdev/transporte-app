"use client";
import { useState } from "react";
import Link from "next/link";
import BotonCerrarSesion from "@/components/BotonCerrarSesion";

const ENLACES = [
  { href: "/dashboard", label: "Panel", icon: "📊" },
  { href: "/dashboard/personas", label: "Personas", icon: "👥" },
  { href: "/dashboard/moviles", label: "Móviles", icon: "🚘" },
  { href: "/dashboard/grupos", label: "Grupos", icon: "📁" },
  { href: "/dashboard/paradas", label: "Paradas", icon: "📍" },
  { href: "/dashboard/rotacion", label: "Rotación diaria", icon: "🔄" },
  { href: "/dashboard/programacion", label: "Programación diaria", icon: "📅" },
  { href: "/dashboard/reportes", label: "Reportes", icon: "📈" },
  { href: "/dashboard/importar", label: "Importar Excel", icon: "📥" },
];

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Estilos CSS Nativos para manejar la responsividad de forma limpia */}
      <style jsx global>{`
        .sidebar-container {
          width: 260px;
          min-width: 260px;
          background: #ffffff;
          border-right: 0.5px solid #d9deee;
          display: flex;
          flex-direction: column;
          justifyContent: space-between;
          height: 100vh;
          position: sticky;
          top: 0;
          padding: 24px 16px;
          box-sizing: border-box;
          z-index: 100;
          transition: transform 0.3s ease;
        }

        .menu-toggle-btn {
          display: none;
          position: fixed;
          top: 12px;
          left: 12px;
          z-index: 110;
          background: #1e2761;
          color: white;
          border: none;
          padding: 8px 12px;
          border-radius: 6px;
          font-size: 16px;
          cursor: pointer;
        }

        .sidebar-overlay {
          display: none;
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(0, 0, 0, 0.4);
          z-index: 90;
        }

        @media (max-width: 768px) {
          .menu-toggle-btn {
            display: block;
          }
          .sidebar-container {
            position: fixed;
            left: 0;
            top: 0;
            transform: translateX(${isOpen ? "0" : "-100%"});
          }
          .sidebar-overlay {
            display: ${isOpen ? "block" : "none"};
          }
        }
      `}</style>

      {/* Botón Hamburguesa móvil */}
      <button className="menu-toggle-btn" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? "✕" : "☰"}
      </button>

      {/* Fondo oscuro al abrir menú en móvil */}
      <div className="sidebar-overlay" onClick={() => setIsOpen(false)} />

      {/* Barra lateral */}
      <aside className="sidebar-container">
        <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
          <div style={{ paddingLeft: "8px", marginTop: "35px", marginBottom: "0px" }}>
            <style jsx>{`
              @media (min-width: 769px) { div { marginTop: 0px !important; } }
            `}</style>
            <strong style={{ color: "#1e2761", fontSize: 16 }}>
              🚌 Sistema de transporte
            </strong>
          </div>

          <nav style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {ENLACES.map((enlace) => (
              <Link
                key={enlace.href}
                href={enlace.href}
                onClick={() => setIsOpen(false)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  fontSize: 14,
                  color: "#5b6591",
                  textDecoration: "none",
                  padding: "10px 12px",
                  borderRadius: 8,
                }}
              >
                <span style={{ fontSize: 16 }}>{enlace.icon}</span>
                <span style={{ fontWeight: 500 }}>{enlace.label}</span>
              </Link>
            ))}
          </nav>
        </div>

        <div style={{ borderTop: "0.5px solid #eef2fb", paddingTop: 16, paddingLeft: 8 }}>
          <BotonCerrarSesion />
        </div>
      </aside>
    </>
  );
}
