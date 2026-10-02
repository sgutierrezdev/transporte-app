"use client";
import React from "react";
import { useRouter } from "next/navigation";

export function ComponenteDashboardCliente({ metricas, paradas, actividad }: any) {
  const router = useRouter();

  const navegarA = (ruta: string) => {
    router.push(ruta);
  };

  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "14px", boxSizing: "border-box" }}>
      
      {/* --- REJILLA CENTRAL MAESTRA DE DOS COLUMNAS RESPONSIVAS EN EL CELULAR --- */}
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", 
        gap: "10px",
        width: "100%"
      }}>
        
        {/* ================= COLUMNA IZQUIERDA: GESTIÓN Y FLOTA ================= */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          
          {/* Caja Personas */}
          <div onClick={() => navegarA("/dashboard/personas")} style={estiloCajaMini}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "11px", fontWeight: 700, color: "#64748b", textTransform: "uppercase" }}>Personal</span>
              <span style={estiloBadgeMini}>👥</span>
            </div>
            <h3 style={estiloNumeroMini}>{metricas.personas}</h3>
            <p style={estiloSubtextoMini}>Socios y choferes</p>
          </div>

          {/* Caja Grupos */}
          <div onClick={() => navegarA("/dashboard/grupos")} style={estiloCajaMini}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "11px", fontWeight: 700, color: "#64748b", textTransform: "uppercase" }}>Grupos</span>
              <span style={estiloBadgeMini}>🗂️</span>
            </div>
            <h3 style={estiloNumeroMini}>{metricas.grupos}</h3>
            <p style={estiloSubtextoMini}>Líneas de trabajo</p>
          </div>

          {/* Caja Resumen de Flota (Datos Informativos Extra) */}
          <div onClick={() => navegarA("/dashboard/moviles")} style={{ ...estiloCajaMini, background: "var(--bg-tarjeta-destacada, #f8fafc)" }}>
            <span style={{ fontSize: "11px", fontWeight: 700, color: "#0070f3", textTransform: "uppercase", display: "block", marginBottom: "6px" }}>⚡ Estado Flota</span>
            <div style={estiloLineaInfo}><span style={estiloLabelInfo}>Total Móviles:</span><strong style={estiloValorInfo}>{metricas.moviles}</strong></div>
            <div style={estiloLineaInfo}><span style={estiloLabelInfo}>En Turno Hoy:</span><strong style={{ ...estiloValorInfo, color: "#137333" }}>{Math.round(metricas.moviles * 0.75)}</strong></div>
            <div style={estiloLineaInfo}><span style={estiloLabelInfo}>Unidades Libres:</span><strong style={{ ...estiloValorInfo, color: "#b06000" }}>{Math.round(metricas.moviles * 0.25)}</strong></div>
          </div>

        </div>

        {/* ================= COLUMNA DERECHA: OPERACIÓN Y FINANZAS ================= */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          
          {/* Caja Paradas Operativas */}
          <div onClick={() => navegarA("/dashboard/paradas")} style={estiloCajaMini}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "11px", fontWeight: 700, color: "#64748b", textTransform: "uppercase" }}>Paradas</span>
              <span style={estiloBadgeMini}>🛑</span>
            </div>
            <h3 style={estiloNumeroMini}>{metricas.paradas}</h3>
            <p style={estiloSubtextoMini}>Terminales activas</p>
          </div>

          {/* Caja Finanzas (Resumen de Caja Rápido) */}
          <div onClick={() => navegarA("/dashboard/caja")} style={{ ...estiloCajaMini, borderLeft: "3px solid #137333" }}>
            <span style={{ fontSize: "11px", fontWeight: 700, color: "#137333", textTransform: "uppercase", display: "block", marginBottom: "6px" }}>💵 Recaudación</span>
            <div style={estiloLineaInfo}><span style={estiloLabelInfo}>Caja Total:</span><strong style={{ ...estiloValorInfo, color: "#137333" }}>Bs. 450</strong></div>
            <div style={estiloLineaInfo}><span style={estiloLabelInfo}>Aportes:</span><strong style={estiloValorInfo}>Bs. 300</strong></div>
            <div style={estiloLineaInfo}><span style={estiloLabelInfo}>Tarjetas:</span><strong style={estiloValorInfo}>Bs. 150</strong></div>
          </div>

          {/* Caja Control Operativo (Asistencia y Multas) */}
          <div onClick={() => navegarA("/dashboard/infracciones")} style={{ ...estiloCajaMini, borderLeft: "3px solid #c5221f" }}>
            <span style={{ fontSize: "11px", fontWeight: 700, color: "#c5221f", textTransform: "uppercase", display: "block", marginBottom: "6px" }}>🚨 Incidencias</span>
            <div style={estiloLineaInfo}><span style={estiloLabelInfo}>Infracciones:</span><strong style={{ ...estiloValorInfo, color: "#c5221f" }}>2 activas</strong></div>
            <div style={estiloLineaInfo}><span style={estiloLabelInfo}>Tardanzas Hoy:</span><strong style={estiloValorInfo}>1 reporte</strong></div>
            <div style={estiloLineaInfo}><span style={estiloLabelInfo}>Ausentes:</span><strong style={estiloValorInfo}>0 unidades</strong></div>
          </div>

        </div>

      </div>

      {/* ================= SECCIÓN INFERIOR: PARADAS REGISTRADAS ================= */}
      <div style={{ marginTop: "6px" }}>
        <p style={{ margin: 0, fontSize: "11px", fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em" }}>Resumen de Paradas</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "8px", marginTop: "8px" }}>
          {paradas.map((p: any) => (
            <div 
              key={p.id} 
              onClick={() => navegarA("/dashboard/paradas")} 
              style={{ background: "var(--bg-tarjeta, #fff)", border: "1px solid var(--border-color, #e2e8f0)", borderRadius: "8px", padding: "8px 10px", boxSizing: "border-box", cursor: "pointer" }}
            >
              <h4 style={{ margin: 0, fontSize: "13px", fontWeight: 700, color: "var(--texto-principal, #1e293b)" }}>{p.nombre}</h4>
              <p style={{ margin: "2px 0 0 0", fontSize: "11px", color: "#64748b" }}>{p.detalles}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

// --- ESTILOS EN LÍNEA DE ALTA DENSIDAD MODULAR (DOS COLUMNAS) ---
const estiloCajaMini = {
  background: "var(--bg-tarjeta, #fff)",
  border: "1px solid var(--border-color, #e2e8f0)",
  borderRadius: "10px",
  padding: "12px 14px",
  boxSizing: "border-box" as const,
  cursor: "pointer",
  display: "flex",
  flexDirection: "column" as const,
  justifyContent: "center" as const
};

const estiloNumeroMini = { margin: "2px 0", fontSize: "22px", fontWeight: 800, color: "var(--texto-principal, #0f172a)", lineOrigin: 1 };
const estiloSubtextoMini = { margin: 0, fontSize: "11px", color: "#94a3b8" };

const estiloBadgeMini = {
  background: "var(--bg-pestañas, #f1f3f9)",
  width: "22px",
  height: "22px",
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "11px"
};

// Estilos de líneas informativas compactas (Efecto sinopsis)
const estiloLineaInfo = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "3px 0",
  borderBottom: "1px dashed var(--border-color, #f1f5f9)"
};

const estiloLabelInfo = { fontSize: "11px", color: "#64748b" };
const estiloValorInfo = { fontSize: "11px", fontFamily: "monospace", color: "var(--texto-principal, #334155)" };
