"use client";
import Link from "next/link";

export function TablaGruposCompacta({ datos }: { datos: any[] }) {
  return (
    <div style={{ overflowX: "auto", borderRadius: 10, border: "1px solid var(--border-color, #e2e8f0)", background: "var(--bg-tarjeta, #fff)" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: 13 }}>
        <thead>
          <tr style={{ background: "var(--bg-cabecera, #f8fafc)", borderBottom: "1px solid var(--border-color, #e2e8f0)", color: "#64748b", fontSize: 11, textTransform: "uppercase", fontWeight: 700 }}>
            <th style={{ padding: "8px 12px" }}>Identificación del Grupo</th>
            <th style={{ padding: "8px 12px" }}>Personal y Flota Vinculada</th>
            <th style={{ padding: "8px 12px" }}>Subgrupos de Trabajo</th>
            <th style={{ padding: "8px 12px", textAlign: "right", paddingRight: 20, width: 80 }}>Acciones</th>
          </tr>
        </thead>
        <tbody style={{ color: "var(--texto-principal, #334155)" }}>
          {datos.map((g) => (
            <tr key={g.id} className="group-row" style={{ borderBottom: "1px solid var(--border-color, #f1f5f9)" }}>
              <td style={{ padding: "8px 12px", fontWeight: "bold", fontSize: 14 }}>{g.nombre}</td>
              <td style={{ padding: "8px 12px" }}>
                {/* Celda vertical compacta unificada de Jefe y número de móviles */}
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <span style={{ fontWeight: 600 }}>👨‍✈️ Jefe: {g.jefeNombre}</span>
                  <span style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>🚌 Flota activa: {g.totalMoviles} unidades</span>
                </div>
              </td>
              <td style={{ padding: "8px 12px" }}>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {g.subgrupos.map((sub: any) => (
                    <span key={sub.id} style={{ fontSize: 11, padding: "2px 8px", background: "var(--bg-pestañas, #f1f3f9)", borderRadius: 12, border: "1px solid var(--border-color, #e2e8f0)", fontWeight: 600 }}>
                      Subgrupo {sub.nombre}
                    </span>
                  ))}
                </div>
              </td>
              <td style={{ padding: "8px 12px", textAlign: "right", paddingRight: 20 }}>
                <div style={{ display: "inline-flex", gap: 10 }}>
                  <Link href={`/dashboard/grupos/${g.id}`} style={{ textDecoration: "none", fontSize: 12 }}>✏️</Link>
                  <button style={{ background: "none", border: "none", cursor: "pointer", fontSize: 12 }}>🗑️</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
