"use client";
import Link from "next/link";

export function TablaMovilesCompacta({ datos, enfoque }: { datos: any[], enfoque: "socio" | "chofer" }) {
  return (
    <div style={{ overflowX: "auto", borderRadius: 10, border: "1px solid var(--border-color, #e2e8f0)", background: "var(--bg-tarjeta, #fff)" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: 13 }}>
        <thead>
          <tr style={{ background: "var(--bg-cabecera, #f8fafc)", borderBottom: "1px solid var(--border-color, #e2e8f0)", color: "#64748b", fontSize: 11, textTransform: "uppercase", fontWeight: 700 }}>
            <th style={{ padding: "8px 12px", textAlign: "center", width: 60 }}>Int.</th>
            <th style={{ padding: "8px 12px", width: 100 }}>Placa</th>
            <th style={{ padding: "8px 12px" }}>{enfoque === "socio" ? "Socio / Propietario" : "Chofer Asignado"}</th>
            <th style={{ padding: "8px 12px", textAlign: "right", paddingRight: 20, width: 80 }}>Acciones</th>
          </tr>
        </thead>
        <tbody style={{ color: "var(--texto-principal, #334155)" }}>
          {datos.map((m) => {
            const esMismo = m.socioNombre === m.choferNombre;
            return (
              <tr key={m.id} className="group-row" style={{ borderBottom: "1px solid var(--border-color, #f1f5f9)" }}>
                <td style={{ padding: "8px 12px", textAlign: "center", fontWeight: "bold" }}>{m.interno}</td>
                <td style={{ padding: "8px 12px", fontFamily: "monospace", fontSize: 12, color: "#94a3b8" }}>{m.placa}</td>
                <td style={{ padding: "8px 12px" }}>
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <span style={{ fontWeight: 600 }}>{enfoque === "socio" ? m.socioNombre : m.choferNombre}</span>
                    {!esMismo && (
                      <span style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>
                        {enfoque === "socio" ? `Chofer: ${m.choferNombre}` : `Dueño: ${m.socioNombre}`}
                      </span>
                    )}
                    <span style={{ fontSize: 11, color: "#0070f3", marginTop: 2, fontWeight: 500 }}>{m.grupoTexto}</span>
                  </div>
                </td>
                <td style={{ padding: "8px 12px", textAlign: "right", paddingRight: 20 }}>
                  <div style={{ display: "inline-flex", gap: 10 }}>
                    <Link href={`/dashboard/moviles/${m.id}`} style={{ textDecoration: "none", fontSize: 12 }}>✏️</Link>
                    <button style={{ background: "none", border: "none", cursor: "pointer", fontSize: 12 }}>🗑️</button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
