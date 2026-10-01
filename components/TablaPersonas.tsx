"use client";
import Link from "next/link";

export function TablaPersonasCompacta({ datos, nombreRol, nombreEstado }: any) {
  return (
    // EL CONTENEDOR MAESTRO: Obliga a que el bloque se ajuste al ancho del celular sin desbordar el diseño global
    <div style={{ 
      width: "100%", 
      maxWidth: "100%", 
      overflowX: "auto",                      // <-- Activa el arrastre SOLAMENTE aquí adentro
      WebkitOverflowScrolling: "touch",       // Deslizamiento suave en Android/iPhone
      borderRadius: 10, 
      border: "1px solid var(--border-color, #e2e8f0)", 
      background: "var(--bg-tarjeta, #fff)",
      boxSizing: "border-box"
    }}>
      <table style={{ 
        width: "100%", 
        minWidth: 700,                        // <-- Obliga a la tabla a mantener sus columnas legibles al deslizar
        borderCollapse: "collapse", 
        textAlign: "left", 
        fontSize: 13 
      }}>
        <thead>
          <tr style={{ background: "var(--bg-cabecera, #f8fafc)", borderBottom: "1px solid var(--border-color, #e2e8f0)", color: "#64748b", fontSize: 11, textTransform: "uppercase", fontWeight: 700 }}>
            <th style={{ padding: "10px 12px" }}>Nombre Completo / Rol</th>
            <th style={{ padding: "10px 12px", width: 110 }}>Carnet</th>
            <th style={{ padding: "10px 12px" }}>Información de Contacto</th>
            <th style={{ padding: "10px 12px", width: 90 }}>Estado</th>
            <th style={{ padding: "10px 12px", textAlign: "right", paddingRight: 20, width: 80 }}>Acciones</th>
          </tr>
        </thead>
        <tbody style={{ color: "var(--texto-principal, #334155)" }}>
          {datos.map((p: any) => (
            <tr key={p.id} className="group-row" style={{ borderBottom: "1px solid var(--border-color, #f1f5f9)" }}>
              <td style={{ padding: "10px 12px" }}>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <span style={{ fontWeight: 600 }}>{p.nombre}</span>
                  <span style={{ fontSize: 11, color: "#0070f3", marginTop: 2, fontWeight: 500 }}>{nombreRol[p.rol]}</span>
                </div>
              </td>
              <td style={{ padding: "10px 12px", fontFamily: "monospace", color: "#64748b" }}>{p.carnet || "—"}</td>
              <td style={{ padding: "10px 12px" }}>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <span style={{ fontWeight: 500 }}>{p.celular ? `📞 ${p.celular}` : "Sin celular"}</span>
                  {p.email && <span style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>✉️ {p.email}</span>}
                </div>
              </td>
              <td style={{ padding: "10px 12px" }}>
                <span style={{ fontSize: 11, padding: "2px 6px", borderRadius: 12, fontWeight: 600, background: p.estado === "ACTIVO" ? "#e6f4ea" : "#fce8e6", color: p.estado === "ACTIVO" ? "#137333" : "#c5221f" }}>
                  {nombreEstado[p.estado]}
                </span>
              </td>
              <td style={{ padding: "10px 12px", textAlign: "right", paddingRight: 20 }}>
                <div style={{ display: "inline-flex", gap: 10 }}>
                  <Link href={`/dashboard/personas/${p.id}`} style={{ textDecoration: "none", fontSize: 12 }}>✏️</Link>
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
