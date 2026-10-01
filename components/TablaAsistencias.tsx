"use client";

export function TablaAsistenciasCompacta({ datos }: { datos: any[] }) {
  return (
    <div style={{ overflowX: "auto", borderRadius: 10, border: "1px solid var(--border-color, #e2e8f0)", background: "var(--bg-tarjeta, #fff)" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: 13 }}>
        <thead>
          <tr style={{ background: "var(--bg-cabecera, #f8fafc)", borderBottom: "1px solid var(--border-color, #e2e8f0)", color: "#64748b", fontSize: 11, textTransform: "uppercase", fontWeight: 700 }}>
            <th style={{ padding: "8px 12px", width: 60, textAlign: "center" }}>Int.</th>
            <th style={{ padding: "8px 12px" }}>Información del Chofer / Unidad</th>
            <th style={{ padding: "8px 12px" }}>Control de Parada y Horario</th>
            <th style={{ padding: "8px 12px", width: 100 }}>Fichaje</th>
            <th style={{ padding: "8px 12px", textAlign: "right", paddingRight: 20, width: 60 }}>Acciones</th>
          </tr>
        </thead>
        <tbody style={{ color: "var(--texto-principal, #334155)" }}>
          {datos.length === 0 ? (
            <tr>
              <td colSpan={5} style={{ padding: 20, textAlign: "center", color: "#94a3b8", fontStyle: "italic" }}>
                No se registran marcas de asistencia el día de hoy.
              </td>
            </tr>
          ) : (
            datos.map((a) => (
              <tr key={a.id} className="group-row" style={{ borderBottom: "1px solid var(--border-color, #f1f5f9)" }}>
                <td style={{ padding: "10px 12px", textAlign: "center", fontWeight: "bold", fontSize: 15 }}>
                  {a.interno}
                </td>
                <td style={{ padding: "10px 12px" }}>
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <span style={{ fontWeight: 600 }}>{a.choferNombre}</span>
                    <span style={{ fontSize: 11, color: "#94a3b8", marginTop: 2, fontFamily: "monospace" }}>Placa: {a.placa}</span>
                  </div>
                </td>
                <td style={{ padding: "10px 12px" }}>
                  {/* Agrupación vertical de estación, hora y fecha */}
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <span style={{ fontWeight: 600 }}>🛑 {a.paradaNombre}</span>
                    <span style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>🕒 Marcado a las {a.hora} ({a.fecha})</span>
                  </div>
                </td>
                <td style={{ padding: "10px 12px" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                    <span style={{ fontSize: 10, fontWeight: 700, padding: "1px 5px", borderRadius: 4, background: a.tipo === "ENTRADA" ? "#e8f0fe" : "#f1f3f4", color: a.tipo === "ENTRADA" ? "#1a73e8" : "#5f6368", width: "fit-content" }}>
                      {a.tipo}
                    </span>
                    <span style={{ fontSize: 11, fontWeight: 600, color: a.estado === "PRESENTE" ? "#137333" : a.estado === "TARDE" ? "#b06000" : "#c5221f" }}>
                      ● {a.estado}
                    </span>
                  </div>
                </td>
                <td style={{ padding: "10px 12px", textAlign: "right", paddingRight: 20 }}>
                  <button style={{ background: "none", border: "none", cursor: "pointer", fontSize: 12 }} title="Anular Marca">🗑️</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
