"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

export function ComponenteDashboardCliente({ metricas, paradas, actividad }: any) {
  const router = useRouter();

  // Escala: 1 = Normal, 1.15 = Mediano, 1.3 = Grande
  const [escala, setEscala] = useState<number>(1);

  const navegarA = (ruta: string) => {
    router.push(ruta);
  };

  const fSize = (base: number) => {
    return `${Math.round(base * escala)}px`;
  };

  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "12px", boxSizing: "border-box" }}>
      
      {/* BARRA DE ACCESIBILIDAD SUPERIOR */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#fff", border: "1px solid #e2e8f0", borderRadius: "8px", padding: "6px 12px" }}>
        <span style={{ fontSize: fSize(11), fontWeight: 700, color: "#64748b" }}>🔍 Letra:</span>
        <div style={{ display: "inline-flex", gap: "4px", background: "#f1f3f9", padding: "2px", borderRadius: "6px" }}>
          <button type="button" onClick={() => setEscala(1)} style={{ padding: "4px 8px", fontSize: "11px", fontWeight: 700, border: "none", borderRadius: "4px", cursor: "pointer", background: escala === 1 ? "#1e2761" : "transparent", color: escala === 1 ? "#fff" : "#64748b" }}>A-</button>
          <button type="button" onClick={() => setEscala(1.15)} style={{ padding: "4px 8px", fontSize: "11px", fontWeight: 700, border: "none", borderRadius: "4px", cursor: "pointer", background: escala === 1.15 ? "#1e2761" : "transparent", color: escala === 1.15 ? "#fff" : "#64748b" }}>A</button>
          <button type="button" onClick={() => setEscala(1.3)} style={{ padding: "4px 8px", fontSize: "11px", fontWeight: 700, border: "none", borderRadius: "4px", cursor: "pointer", background: escala === 1.3 ? "#1e2761" : "transparent", color: escala === 1.3 ? "#fff" : "#64748b" }}>A+</button>
        </div>
      </div>
      {/* GRILLA DE DOS COLUMNAS RESPONSIVAS */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "10px", width: "100%" }}>
        
        {/* COLUMNA IZQUIERDA: GESTIÓN */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          
          <div onClick={() => navegarA("/dashboard/personas")} style={estiloCaja}>
            <span style={{ fontSize: fSize(11), fontWeight: 700, color: "#64748b" }}>PERSONAL</span>
            <h3 style={{ margin: "2px 0", fontSize: fSize(24), fontWeight: 800 }}>{metricas.personas}</h3>
            <p style={{ margin: 0, fontSize: fSize(11), color: "#94a3b8" }}>Socios y choferes</p>
          </div>

          <div onClick={() => navegarA("/dashboard/grupos")} style={estiloCaja}>
            <span style={{ fontSize: fSize(11), fontWeight: 700, color: "#64748b" }}>GRUPOS</span>
            <h3 style={{ margin: "2px 0", fontSize: fSize(24), fontWeight: 800 }}>{metricas.grupos}</h3>
            <p style={{ margin: 0, fontSize: fSize(11), color: "#94a3b8" }}>Líneas de trabajo</p>
          </div>

          <div onClick={() => navegarA("/dashboard/moviles")} style={{ ...estiloCaja, background: "#f8fafc" }}>
            <span style={{ fontSize: fSize(11), fontWeight: 700, color: "#0070f3", display: "block", marginBottom: "4px" }}>⚡ ESTADO FLOTA</span>
            <div style={estiloL}><span style={{ fontSize: fSize(11), color: "#64748b" }}>Total:</span><strong style={{ fontSize: fSize(11) }}>{metricas.moviles}</strong></div>
            <div style={estiloL}><span style={{ fontSize: fSize(11), color: "#64748b" }}>En Ruta:</span><strong style={{ fontSize: fSize(11), color: "#137333" }}>{Math.round(metricas.moviles * 0.75)}</strong></div>
          </div>

        </div>
        {/* COLUMNA DERECHA: OPERACIÓN */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          
          <div onClick={() => navegarA("/dashboard/paradas")} style={estiloCaja}>
            <span style={{ fontSize: fSize(11), fontWeight: 700, color: "#64748b" }}>PARADAS</span>
            <h3 style={{ margin: "2px 0", fontSize: fSize(24), fontWeight: 800 }}>{metricas.paradas}</h3>
            <p style={{ margin: 0, fontSize: fSize(11), color: "#94a3b8" }}>Terminales activas</p>
          </div>

          <div onClick={() => navegarA("/dashboard/caja")} style={{ ...estiloCaja, borderLeft: "3px solid #137333" }}>
            <span style={{ fontSize: fSize(11), fontWeight: 700, color: "#137333", display: "block", marginBottom: "4px" }}>💵 RECAUDACIÓN</span>
            <div style={estiloL}><span style={{ fontSize: fSize(11), color: "#64748b" }}>Total:</span><strong style={{ fontSize: fSize(12), color: "#137333", fontWeight: "bold" }}>Bs. 450</strong></div>
            <div style={estiloL}><span style={{ fontSize: fSize(11), color: "#64748b" }}>Aportes:</span><strong style={{ fontSize: fSize(11) }}>Bs. 300</strong></div>
          </div>

          <div onClick={() => navegarA("/dashboard/infracciones")} style={{ ...estiloCaja, borderLeft: "3px solid #c5221f" }}>
            <span style={{ fontSize: fSize(11), fontWeight: 700, color: "#c5221f", display: "block", marginBottom: "4px" }}>🚨 INCIDENCIAS</span>
            <div style={estiloL}><span style={{ fontSize: fSize(11), color: "#64748b" }}>Multas:</span><strong style={{ fontSize: fSize(11), color: "#c5221f", fontWeight: "bold" }}>2 activas</strong></div>
            <div style={estiloL}><span style={{ fontSize: fSize(11), color: "#64748b" }}>Atrasos:</span><strong style={{ fontSize: fSize(11) }}>1 reporte</strong></div>
          </div>

        </div>

      </div>
    </div>
  );
}

const estiloCaja = { background: "#fff", border: "1px solid #e2e8f0", borderRadius: "10px", padding: "12px 14px", boxSizing: "border-box" as const, cursor: "pointer" };
const estiloL = { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "3px 0", borderBottom: "1px dashed #f1f5f9" };
