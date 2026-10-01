"use client";

import React, { useState } from "react";

// Datos estáticos seguros para dar luz verde inmediata a Next.js sin dependencias
const datosCajaPrueba = [
  { id: "c-1", fecha: "2026-10-01", hora: "08:30", paradaNombre: "Okinawa Uno", concepto: "Aporte Regular", monto: 15, comprobante: "REC-01" },
  { id: "c-2", fecha: "2026-10-01", hora: "09:15", paradaNombre: "Warnes", concepto: "Tarjeta Diaria", monto: 10, comprobante: "REC-02" }
];

export default function CajaPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [busqueda, setBusqueda] = useState("");

  const filtrados = datosCajaPrueba.filter((i) =>
    i.paradaNombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    i.concepto.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <main style={{ width: "100%", padding: "1rem 1.5rem", boxSizing: "border-box", overflow: "hidden" }}>
      
      {/* BARRA DE HERRAMIENTAS CONTABLE EN UNA SOLA LÍNEA */}
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 12, marginBottom: 16 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>Flujo de Caja y Recaudación</h2>
          <p style={{ margin: 0, fontSize: 12, color: "#64748b", fontFamily: "monospace", marginTop: 2 }}>
            {filtrados.length} transacciones registradas en caja
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1, maxWidth: 450, marginLeft: "auto" }}>
          <input 
            type="text" 
            placeholder="Buscar por parada o concepto..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            style={{ flex: 1, padding: "6px 10px", fontSize: 13, borderRadius: 6, border: "1px solid #d9deee", background: "#fff", color: "#000" }}
          />
          <button 
            type="button" 
            onClick={() => setModalOpen(true)} 
            style={{ padding: "6px 14px", fontSize: 13, fontWeight: 600, borderRadius: 6, border: "none", background: "#0070f3", color: "#fff", cursor: "pointer", whiteSpace: "nowrap" }}
          >
            + Registrar Ingreso
          </button>
        </div>
      </div>

      {/* --- TABLA CONTABLE RESPONSIVA INTEGRADA AL ESTILO ADMINLTE --- */}
      <div style={{ width: "100%", overflowX: "auto", WebkitOverflowScrolling: "touch", borderRadius: 10, border: "1px solid #e2e8f0", background: "#fff", boxSizing: "border-box" }}>
        <table style={{ width: "100%", minWidth: 650, borderCollapse: "collapse", textAlign: "left", fontSize: 13 }}>
          <thead>
            <tr style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0", color: "#64748b", fontSize: 11, textTransform: "uppercase", fontWeight: 700 }}>
              <th style={{ padding: "10px 12px" }}>Estación de Control</th>
              <th style={{ padding: "10px 12px" }}>Detalle Contable / Cuenta</th>
              <th style={{ padding: "10px 12px", width: 140 }}>Monto Registrado</th>
              <th style={{ padding: "10px 12px", textAlign: "right", paddingRight: 20, width: 60 }}>Acciones</th>
            </tr>
          </thead>
          <tbody style={{ color: "#334155" }}>
            {filtrados.map((i) => (
              <tr key={i.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                <td style={{ padding: "12px 12px", fontWeight: "bold", fontSize: 14 }}>🛑 {i.paradaNombre}</td>
                <td style={{ padding: "12px 12px" }}>
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <span style={{ fontWeight: 600 }}>{i.concepto}</span>
                    <span style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>Recibo: {i.comprobante} | 🕒 {i.hora} ({i.fecha})</span>
                  </div>
                </td>
                <td style={{ padding: "12px 12px", fontWeight: "bold", color: "#137333", fontSize: 14 }}>
                  Bs. {i.monto}
                </td>
                <td style={{ padding: "12px 12px", textAlign: "right", paddingRight: 20 }}>
                  <button type="button" style={{ background: "none", border: "none", cursor: "pointer", fontSize: 12 }}>🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* --- MODAL FORMULARIO DE CAJA --- */}
      {modalOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.4)", padding: 16 }}>
          <div style={{ width: "100%", maxWidth: 460, background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, padding: 16, boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #e2e8f0", paddingBottom: 8, marginBottom: 16 }}>
              <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700 }}>Registrar ingreso de dinero a caja</h3>
              <button type="button" onClick={() => setModalOpen(false)} style={{ fontSize: 11, fontWeight: 600, padding: "4px 10px", borderRadius: 6, border: "1px solid #ccc", cursor: "pointer", background: "transparent" }}>Cancelar</button>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); setModalOpen(false); }} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ display: "flex", gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <span style={{ fontSize: 11, color: "#64748b", display: "block", marginBottom: 4 }}>Monto en efectivo (Bs.)</span>
                  <input type="number" required placeholder="Ej. 15" style={{ width: "100%", padding: "6px 8px", borderRadius: 6, border: "1px solid #d9deee" }} />
                </div>
              </div>
              <button type="submit" style={{ padding: "10px", borderRadius: 6, border: "none", background: "#0070f3", color: "#fff", fontWeight: 600, cursor: "pointer", fontSize: 13, marginTop: 8 }}>
                Publicar Movimiento Contable
              </button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
