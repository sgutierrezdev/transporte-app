"use client";
import React from "react";

export function ComponenteDashboardCliente({ metricas, paradas, actividad }: any) {
  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 24 }}>
      
      {/* 1. SECCIÓN DE MÉTRICAS SUPERIORES (Grilla Fluida de 4 columnas) */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
        
        {/* Tarjeta Personas */}
        <div style={estiloTarjetaMetrica}>
          <div>
            <p style={estiloEtiquetaMetrica}>Personas</p>
            <h3 style={estiloNumeroMetrica}>{metricas.personas}</h3>
            <p style={estiloSubtextoMetrica}>Socios, choferes y personal</p>
          </div>
          <span style={{ color: "#0070f3", fontSize: 18, fontWeight: "bold" }}>→</span>
        </div>

        {/* Tarjeta Grupos */}
        <div style={estiloTarjetaMetrica}>
          <div>
            <p style={estiloEtiquetaMetrica}>Grupos</p>
            <h3 style={estiloNumeroMetrica}>{metricas.grupos}</h3>
            <p style={estiloSubtextoMetrica}>Líneas y subgrupos de trabajo</p>
          </div>
          <span style={{ color: "#0070f3", fontSize: 18, fontWeight: "bold" }}>→</span>
        </div>

        {/* Tarjeta Móviles */}
        <div style={estiloTarjetaMetrica}>
          <div>
            <p style={estiloEtiquetaMetrica}>Móviles</p>
            <h3 style={estiloNumeroMetrica}>{metricas.moviles}</h3>
            <p style={estiloSubtextoMetrica}>Unidades vehiculares activas</p>
          </div>
          <span style={{ color: "#0070f3", fontSize: 18, fontWeight: "bold" }}>→</span>
        </div>

        {/* Tarjeta Paradas */}
        <div style={estiloTarjetaMetrica}>
          <div>
            <p style={estiloEtiquetaMetrica}>Paradas</p>
            <h3 style={estiloNumeroMetrica}>{metricas.paradas}</h3>
            <p style={estiloSubtextoMetrica}>Terminales de control activas</p>
          </div>
          <span style={{ color: "#0070f3", fontSize: 18, fontWeight: "bold" }}>→</span>
        </div>

      </div>

      {/* 2. SECCIÓN DE PARADAS REGISTRADAS (Grilla Fluida de 2 columnas) */}
      <div>
        <h2 style={estiloTituloSeccion}>Paradas registradas</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 12, marginTop: 12 }}>
          {paradas.map((p: any) => (
            <div key={p.id} style={estiloTarjetaParada}>
              <h4 style={{ margin: 0, fontSize: 14, fontWeight: 700 }}>{p.nombre}</h4>
              <p style={{ margin: "4px 0 0 0", fontSize: 12, color: "#64748b" }}>{p.detalles}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 3. SECCIÓN DE ACTIVIDAD RECIENTE (Bitácora Densa Unificada) */}
      <div>
        <h2 style={estiloTituloSeccion}>Actividad reciente</h2>
        <div style={estiloContenedorBitacora}>
          {actividad.length === 0 ? (
            <p style={{ padding: 16, margin: 0, fontSize: 13, color: "#94a3b8", fontStyle: "italic", textAlign: "center" }}>No se registran marcas de asistencia recientes en la flota.</p>
          ) : (
            actividad.map((a: any) => (
              <div key={a.id} style={estiloFilaBitacora}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={estiloCirculoIcono}>{a.icono}</div>
                  <p style={{ margin: 0, fontSize: 13, fontWeight: 500 }}>{a.texto}</p>
                </div>
                <span style={{ fontSize: 11, color: "#94a3b8", fontFamily: "monospace" }}>{a.hora}</span>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
}

// --- ESTILOS EN LÍNEA SEMÁNTICOS COMPACTOS (ADMINLTE STYLE) ---
const estiloTarjetaMetrica = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  background: "var(--bg-tarjeta, #fff)",
  border: "1px solid var(--border-color, #e2e8f0)",
  borderRadius: 12,
  padding: 16,
  boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
  boxSizing: "border-box" as const
};

const estiloEtiquetaMetrica = { margin: 0, fontSize: 12, color: "#64748b", fontWeight: 600, textTransform: "uppercase" as const, letterSpacing: "0.02em" };
const estiloNumeroMetrica = { margin: "4px 0", fontSize: 28, fontWeight: 800, color: "var(--texto-principal, #111827)" };
const estiloSubtextoMetrica = { margin: 0, fontSize: 11, color: "#94a3b8" };

const estiloTituloSeccion = { margin: 0, fontSize: 12, fontWeight: 700, color: "#64748b", textTransform: "uppercase" as const, letterSpacing: "0.05em" };

const estiloTarjetaParada = {
  background: "var(--bg-tarjeta, #fff)",
  border: "1px solid var(--border-color, #e2e8f0)",
  borderRadius: 8,
  padding: 12,
  boxSizing: "border-box" as const
};

const estiloContenedorBitacora = {
  background: "var(--bg-tarjeta, #fff)",
  border: "1px solid var(--border-color, #e2e8f0)",
  borderRadius: 12,
  padding: "4px 0",
  boxSizing: "border-box" as const,
  marginTop: 12
};

const estiloFilaBitacora = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "10px 16px",
  borderBottom: "1px solid var(--border-color, #f1f5f9)",
  boxSizing: "border-box" as const
};

const estiloCirculoIcono = {
  width: 28,
  height: 28,
  borderRadius: "50%",
  background: "var(--bg-pestañas, #f1f3f9)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: 14
};
