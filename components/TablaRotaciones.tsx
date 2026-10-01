"use client";

export function TablaRotacionesCompacta({ datos }: { datos: any[] }) {
  return (
    <div style={{ overflowX: "auto", borderRadius: 10, border: "1px solid var(--border-color, #e2e8f0)", background: "var(--bg-tarjeta, #fff)" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: 13 }}>
        <thead>
          <tr style={{ background: "var(--bg-cabecera, #f8fafc)", borderBottom: "1px solid var(--border-color, #e2e8f0)", color: "#64748b", fontSize: 11, textTransform: "uppercase", fontWeight: 700 }}>
            <th style={{ padding: "8px 12px", width: 120 }}>Fecha de Control</th>
            <th style={{ padding: "8px 12px" }}>Estación / Terminal Cubierta</th>
            <th style={{ padding: "8px 12px" }}>Flota y Subgrupo en Servicio</th>
            <th style={{ padding: "8px 12px", textAlign: "right", paddingRight: 20, width: 80 }}>Acciones</th>
          </tr>
        </thead>
        <tbody style={{ color: "var(--texto-principal, #334155)" }}>
          {datos.length === 0 ? (
            <tr>
              <td colSpan={4} style={{ padding: 20, textCenter: "center", textAlign: "center", color: "#94a3b8", fontStyle: "italic" }}>
                No hay rotaciones registradas para el filtro seleccionado.
              </td>
            </tr>
          ) : (
            datos.map((r) => (
              <tr key={r.id} className="group-row" style={{ borderBottom: "1px solid var(--border-color, #f1f5f9)" }}>
                <td style={{ padding: "10px 12px", fontFamily: "monospace", fontWeight: 600, color: "#64748b" }}>
                  📅 {r.fecha}
                </td>
                <td style={{ padding: "10px 12px" }}>
                  {/* Bloque vertical unificado de parada */}
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <span style={{ fontWeight: 700, fontSize: 14 }}>{r.paradaNombre}</span>
                    <span style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>Jurisdicción: {r.jurisdiccion}</span>
                  </div>
                </td>
                <td style={{ padding: "10px 12px" }}>
                  <span style={{ fontSize: 12, padding: "3px 8px", background: "var(--bg-pestañas, #f1f3f9)", border: "1px solid var(--border-color, #e2e8f0)", borderRadius: 6, fontWeight: 600, color: "#0070f3" }}>
                    🚌 {r.grupoAsignado}
                  </span>
                </td>
                <td style={{ padding: "10px 12px", textAlign: "right", paddingRight: 20 }}>
                  <div style={{ display: "inline-flex", gap: 10 }}>
                    <button style={{ background: "none", border: "none", cursor: "pointer", fontSize: 12 }} title="Modificar">✏️</button>
                    <button style={{ background: "none", border: "none", cursor: "pointer", fontSize: 12 }} title="Eliminar">🗑️</button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
