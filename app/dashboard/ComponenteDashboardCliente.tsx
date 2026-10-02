"use client";
import React from "react";
import { useRouter } from "next/navigation";

export function ComponenteDashboardCliente({ metricas, paradas }: any) {
  const router = useRouter();

  const navegarA = (ruta: string) => {
    router.push(ruta);
  };

  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "12px", boxSizing: "border-box" }}>
      
      {/* GRILLA DE DOS COLUMNAS RESPONSIVAS AL ESTILO ADMINLTE */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "10px", width: "100%" }}>
        
        {/* COLUMNA IZQUIERDA: GESTIÓN */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          
          <div onClick={() => navegarA("/dashboard/personas")} style={estiloCaja}>
            <span>PERSONAL</span>
            <h3>{metricas.personas}</h3>
            <p style={{ margin: 0, color: "#94a3b8" }}>Socios y choferes</p>
          </div>

          <div onClick={() => navegarA("/dashboard/grupos")} style={estiloCaja}>
            <span>GRUPOS</span>
            <h3>{metricas.grupos}</h3>
            <p style={{ margin: 0, color: "#94a3b8" }}>Líneas de trabajo</p>
          </div>

          <div onClick={() => navegarA("/dashboard/moviles")} style={{ ...estiloCaja, background: "#f8fafc" }}>
            <span style={{ color: "#0070f3", display: "block", marginBottom: "4px" }}>⚡ ESTADO FLOTA</span>
            <div style={estiloL}><span>Total:</span><strong>{metricas.moviles}</strong></div>
            <div style={estiloL}><span>En Ruta:</span><strong style={{ color: "#137333" }}>{Math.round(metricas.moviles * 0.75)}</strong></div>
          </div>

        </div>

        {/* COLUMNA DERECHA: OPERACIÓN */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          
          <div onClick={() => navegarA("/dashboard/paradas")} style={estiloCaja}>
            <span>PARADAS</span>
            <h3>{metricas.paradas}</h3>
            <p style={{ margin: 0, color: "#94a3b8" }}>Terminales activas</p>
          </div>

          <div onClick={() => navegarA("/dashboard/caja")} style={{ ...estiloCaja, borderLeft: "3px solid #137333" }}>
            <span style={{ color: "#137333", display: "block", marginBottom: "4px" }}>💵 RECAUDACIÓN</span>
            <div style={estiloL}><span>Caja Total:</span><strong style={{ color: "#137333", fontWeight: "bold" }}>Bs. 450</strong></div>
            <div style={estiloL}><span>Aportes:</span><strong>Bs. 300</strong></div>
          </div>

          <div onClick={() => navegarA("/dashboard/infracciones")} style={{ ...estiloCaja, borderLeft: "3px solid #c5221f" }}>
            <span style={{ color: "#c5221f", display: "block", marginBottom: "4px" }}>🚨 INCIDENCIAS</span>
            <div style={estiloL}><span>Multas:</span><strong style={{ color: "#c5221f", fontWeight: "bold" }}>2 activas</strong></div>
            <div style={estiloL}><span>Atrasos:</span><strong>1 reporte</strong></div>
          </div>

        </div>

      </div>

      {/* SECCIÓN INFERIOR: RESUMEN DE PARADAS */}
      <div style={{ marginTop: "4px" }}>
        <p style={{ margin: 0, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em" }}>Resumen de Paradas</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "8px", marginTop: "8px" }}>
          {paradas.map((p: any) => (
            <div key={p.id} onClick={() => navegarA("/dashboard/paradas")} style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: "8px", padding: "10px", boxSizing: "border-box", cursor: "pointer" }}>
              <h4 style={{ margin: 0, fontWeight: 700, color: "var(--texto-principal, #1e293b)" }}>{p.nombre}</h4>
              <p style={{ margin: "2px 0 0 0", color: "#64748b" }}>{p.detalles}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

const estiloCaja = { background: "#fff", border: "1px solid #e2e8f0", borderRadius: "10px", padding: "12px 14px", boxSizing: "border-box" as const, cursor: "pointer" };
const estiloL = { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "3px 0", borderBottom: "1px dashed #f1f5f9" };
