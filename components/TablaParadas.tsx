"use client";
import Link from "next/link";

export function TablaParadasCompacta({ datos }: { datos: any[] }) {
  return (
    <div style={{ overflowX: "auto", borderRadius: 10, border: "1px solid var(--border-color, #e2e8f0)", background: "var(--bg-tarjeta, #fff)" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: 13 }}>
        <thead>
          <tr style={{ background: "var(--bg-cabecera, #f8fafc)", borderBottom: "1px solid var(--border-color, #e2e8f0)", color: "#64748b", fontSize: 11, textTransform: "uppercase", fontWeight: 700 }}>
            <th style={{ padding: "8px 12px" }}>Nombre de la Terminal</th>
            <th style={{ padding: "8px 12px" }}>Ubicación y Personal Asignado</th>
            <th style={{ padding: "8px 12px", textAlign: "right", paddingRight: 20, width: 80 }}>Acciones</th>
          </tr>
        </thead>
        <tbody style={{ color: "var(--texto-principal, #334155)" }}>
          {datos.map((p) => (
            <tr key={p.id} className="group-row" style={{ borderBottom: "1px solid var(--border-color, #f1f5f9)" }}>
              <td style={{ padding: "10px 12px", fontWeight: "bold", fontSize: 14 }}>{p.nombre}</td>
              <td style={{ padding: "10px 12px" }}>
                {/* Agrupación vertical limpia de Zona y Secretaria */}
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <span style={{ fontWeight: 600 }}>📍 Jurisdicción: {p.ubicacion}</span>
                  <span style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>👩‍💼 Secretaria: {p.secretariaNombre}</span>
                </div>
              </td>
              <td style={{ padding: "10px 12px", textAlign: "right", paddingRight: 20 }}>
                <div style={{ display: "inline-flex", gap: 10 }}>
                  <Link href={`/dashboard/paradas/${p.id}`} style={{ textDecoration: "none", fontSize: 12 }}>✏️</Link>
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
