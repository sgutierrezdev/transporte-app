"use client";
import React from "react";
import { useRouter } from "next/navigation";

export function ComponenteDashboardCliente({ metricas, paradas, actividad }: any) {
  const router = useRouter();

  const navegarA = (ruta: string) => {
    router.push(ruta);
  };

  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "20px" }}>
      
      {/* 1. SECCIÓN DE MÉTRICAS CON CONTROL EN LÍNEA POR ONCLICK */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "12px" }}>
        
        {/* Tarjeta Personas */}
        <div 
          onClick={() => navegarA("/dashboard/personas")} 
          style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "var(--bg-tarjeta, #fff)", border: "1px solid var(--border-color, #e2e8f0)", borderRadius: "10px", padding: "14px 16px", boxSizing: "border-box", cursor: "pointer" }}
        >
          <div>
            <p style={{ margin: 0, fontSize: "11px", color: "#64748b", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>Personas</p>
            <h3 style={{ margin: "2px 0", fontSize: "26px", fontWeight: 800, color: "var(--texto-principal, #0f172a)" }}>{metricas.personas}</h3>
            <p style={{ margin: 0, fontSize: "11px", color: "#94a3b8" }}>Socios, choferes y personal</p>
          </div>
          <span style={{ color: "#0070f3", fontSize: "16px", fontWeight: "bold", background: "var(--bg-pestañas, #f1f3f9)", width: "28px", height: "28px", borderRadius: "6px", display: "flex", alignItems: "center", justifyCenter: "center", justifyContent: "center" }}>→</span>
        </div>

        {/* Tarjeta Grupos */}
        <div 
          onClick={() => navegarA("/dashboard/grupos")} 
          style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "var(--bg-tarjeta, #fff)", border: "1px solid var(--border-color, #e2e8f0)", borderRadius: "10px", padding: "14px 16px", boxSizing: "border-box", cursor: "pointer" }}
        >
          <div>
            <p style={{ margin: 0, fontSize: "11px", color: "#64748b", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>Grupos</p>
            <h3 style={{ margin: "2px 0", fontSize: "26px", fontWeight: 800, color: "var(--texto-principal, #0f172a)" }}>{metricas.grupos}</h3>
            <p style={{ margin: 0, fontSize: "11px", color: "#94a3b8" }}>Líneas y subgrupos de trabajo</p>
          </div>
          <span style={{ color: "#0070f3", fontSize: "16px", fontWeight: "bold", background: "var(--bg-pestañas, #f1f3f9)", width: "28px", height: "28px", borderRadius: "6px", display: "flex", alignItems: "center", justifyCenter: "center", justifyContent: "center" }}>→</span>
        </div>

        {/* Tarjeta Móviles */}
        <div 
          onClick={() => navegarA("/dashboard/moviles")} 
          style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "var(--bg-tarjeta, #fff)", border: "1px solid var(--border-color, #e2e8f0)", borderRadius: "10px", padding: "14px 16px", boxSizing: "border-box", cursor: "pointer" }}
        >
          <div>
            <p style={{ margin: 0, fontSize: "11px", color: "#64748b", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>Móviles</p>
            <h3 style={{ margin: "2px 0", fontSize: "26px", fontWeight: 800, color: "var(--texto-principal, #0f172a)" }}>{metricas.moviles}</h3>
            <p style={{ margin: 0, fontSize: "11px", color: "#94a3b8" }}>Unidades vehiculares activas</p>
          </div>
          <span style={{ color: "#0070f3", fontSize: "16px", fontWeight: "bold", background: "var(--bg-pestañas, #f1f3f9)", width: "28px", height: "28px", borderRadius: "6px", display: "flex", alignItems: "center", justifyCenter: "center", justifyContent: "center" }}>→</span>
        </div>

        {/* Tarjeta Paradas */}
        <div 
          onClick={() => navegarA("/dashboard/paradas")} 
          style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "var(--bg-tarjeta, #fff)", border: "1px solid var(--border-color, #e2e8f0)", borderRadius: "10px", padding: "14px 16px", boxSizing: "border-box", cursor: "pointer" }}
        >
          <div>
            <p style={{ margin: 0, fontSize: "11px", color: "#64748b", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>Paradas</p>
            <h3 style={{ margin: "2px 0", fontSize: "26px", fontWeight: 800, color: "var(--texto-principal, #0f172a)" }}>{metricas.paradas}</h3>
            <p style={{ margin: 0, fontSize: "11px", color: "#94a3b8" }}>Terminales de control activas</p>
          </div>
          <span style={{ color: "#0070f3", fontSize: "16px", fontWeight: "bold", background: "var(--bg-pestañas, #f1f3f9)", width: "28px", height: "28px", borderRadius: "6px", display: "flex", alignItems: "center", justifyCenter: "center", justifyContent: "center" }}>→</span>
        </div>

      </div>

      {/* 2. SECCIÓN DE PARADAS REGISTRADAS COMPACTAS */}
      <div style={{ marginTop: "8px" }}>
        <p style={{ margin: 0, fontSize: "11px", fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em" }}>Paradas registradas</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "10px", marginTop: "10px" }}>
          {paradas.map((p: any) => (
            <div 
              key={p.id} 
              onClick={() => navegarA("/dashboard/paradas")} 
              style={{ background: "var(--bg-tarjeta, #fff)", border: "1px solid var(--border-color, #e2e8f0)", borderRadius: "8px", padding: "10px 12px", boxSizing: "border-box", cursor: "pointer" }}
            >
              <h4 style={{ margin: 0, fontSize: "13px", fontWeight: 700, color: "var(--texto-principal, #1e293b)" }}>{p.nombre}</h4>
              <p style={{ margin: "2px 0 0 0", fontSize: "11px", color: "#64748b" }}>{p.detalles}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 3. SECCIÓN DE ACTIVIDAD RECIENTE */}
      <div style={{ marginTop: "8px" }}>
        <p style={{ margin: 0, fontSize: "11px", fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em" }}>Actividad reciente</p>
        <div style={{ background: "var(--bg-tarjeta, #fff)", border: "1px solid var(--border-color, #e2e8f0)", borderRadius: "10px", padding: "2px 0", boxSizing: "border-box", marginTop: "8px" }}>
          {actividad.length === 0 ? (
            <p style={{ padding: "16px", margin: 0, fontSize: "12px", color: "#94a3b8", fontStyle: "italic", textAlign: "center" }}>No se registran movimientos recientes.</p>
          ) : (
            actividad.map((a: any, index: number) => (
              <div key={a.id || index} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 14px", borderBottom: "1px solid var(--border-color, #f1f5f9)", boxSizing: "border-box" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <div style={{ width: "24px", height: "24px", borderRadius: "50%", background: "var(--bg-pestañas, #f1f3f9)", display: "flex", alignItems: "center", justifyCenter: "center", justifyContent: "center", fontSize: "12px" }}>{a.icono}</div>
                  <p style={{ margin: 0, fontSize: "12px", fontWeight: 500, color: "var(--texto-principal, #334155)" }}>{a.texto}</p>
                </div>
                <span style={{ fontSize: "11px", color: "#94a3b8", fontFamily: "monospace" }}>{a.hora}</span>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
}
