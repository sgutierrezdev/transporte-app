"use client";
import { useState } from "react";
import { ModalFormularioMaestro, CampoFormulario, estiloInputGlobal } from "@/components/ModalFormularioMaestro";

export function ClientWrapper({ asistenciasIniciales, paradas, moviles, action }: any) {
  const [modalOpen, setModalOpen] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const [filtroTemporal, setFiltroTemporal] = useState<"HOY" | "HISTORIAL">("HOY");
  
  const fechaHoy = new Date().toISOString().split("T")[0];

  const asistenciasPorFecha = asistenciasIniciales.filter((a: any) => {
    if (filtroTemporal === "HISTORIAL") return true;
    return a.fecha === fechaHoy;
  });

  const asistenciasFiltradas = asistenciasPorFecha.filter((a: any) =>
    a.interno.toLowerCase().includes(busqueda.toLowerCase()) ||
    a.choferNombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    a.paradaNombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div>
      {/* BARRA DE HERRAMIENTAS COMPACTA EN UNA SOLA LÍNEA */}
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 12, marginBottom: 16 }}>
        <div style={{ display: "inline-flex", background: "var(--bg-pestañas, #f1f3f9)", border: "1px solid var(--border-color, #e2e8f0)", padding: 3, borderRadius: 8 }}>
          <button type="button" onClick={() => setFiltroTemporal("HOY")} style={{ padding: "6px 12px", fontSize: 12, fontWeight: 600, border: "none", borderRadius: 6, cursor: "pointer", background: filtroTemporal === "HOY" ? "var(--bg-tarjeta, #fff)" : "transparent", color: filtroTemporal === "HOY" ? "var(--texto-principal, #1e293b)" : "#64748b" }}>
            Fichajes de Hoy
          </button>
          <button type="button" onClick={() => setFiltroTemporal("HISTORIAL")} style={{ padding: "6px 12px", fontSize: 12, fontWeight: 600, border: "none", borderRadius: 6, cursor: "pointer", background: filtroTemporal === "HISTORIAL" ? "var(--bg-tarjeta, #fff)" : "transparent", color: filtroTemporal === "HISTORIAL" ? "var(--texto-principal, #1e293b)" : "#64748b" }}>
            Bitácora General
          </button>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1, maxWidth: 450, marginLeft: "auto" }}>
          <input 
            type="text" 
            placeholder="Buscar por interno, chofer, parada..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            style={{ flex: 1, padding: "6px 10px", fontSize: 13, borderRadius: 6, border: "1px solid var(--border-color, #d9deee)", background: "var(--bg-input, #fff)", color: "var(--texto-principal, #000)" }}
          />
          <button type="button" onClick={() => setModalOpen(true)} style={{ padding: "6px 14px", fontSize: 13, fontWeight: 600, borderRadius: 6, border: "none", background: "#0070f3", color: "#fff", cursor: "pointer", whiteSpace: "nowrap" }}>
            + Marcar Asistencia
          </button>
        </div>
      </div>

      <p style={{ fontSize: 12, color: "#64748b", marginBottom: 8, fontFamily: "monospace" }}>{asistenciasFiltradas.length} marcaciones encontradas</p>

      {/* --- TABLA INTEGRADA DE ALTA DENSIDAD INLINE --- */}
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
            {asistenciasFiltradas.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ padding: 20, textAlign: "center", color: "#94a3b8", fontStyle: "italic" }}>
                  No se registran marcas de asistencia en esta vista.
                </td>
              </tr>
            ) : (
              asistenciasFiltradas.map((a: any) => (
                <tr key={a.id} style={{ borderBottom: "1px solid var(--border-color, #f1f5f9)" }}>
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
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <span style={{ fontWeight: 600 }}>🛑 {a.paradaNombre}</span>
                      <span style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>🕒 {a.hora} ({a.fecha})</span>
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
                    <button type="button" style={{ background: "none", border: "none", cursor: "pointer", fontSize: 12 }}>🗑️</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL CONTROLADO POR TU PLANTILLA REUTILIZABLE */}
      <ModalFormularioMaestro isOpen={modalOpen} onClose={() => setModalOpen(false)} titulo="Registrar marca de asistencia diaria" etiquetaBoton="Publicar Fichaje" action={action}>
        <div style={{ display: "flex", gap: 12 }}>
          <div style={{ flex: 1 }}><CampoFormulario label="Fecha"><input type="date" name="fecha" required defaultValue={fechaHoy} style={estiloInputGlobal} /></CampoFormulario></div>
          <div style={{ flex: 1 }}><CampoFormulario label="Hora exacta"><input type="time" name="hora" required style={estiloInputGlobal} /></CampoFormulario></div>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <div style={{ flex: 1 }}>
            <CampoFormulario label="Estación / Parada">
              <select name="paradaId" required style={estiloInputGlobal}>
                {paradas.map((p: any) => (<option key={p.id} value={p.id}>{p.nombre}</option>))}
              </select>
            </CampoFormulario>
          </div>
          <div style={{ flex: 1 }}>
            <CampoFormulario label="Unidad (Interno)">
              <select name="movilId" required style={estiloInputGlobal}>
                <option value="">Seleccionar...</option>
                {moviles.map((m: any) => (<option key={m.id} value={m.id}>Interno {m.numeroInterno}</option>))}
              </select>
            </CampoFormulario>
          </div>
        </div>
      </ModalFormularioMaestro>
    </div>
  );
}
