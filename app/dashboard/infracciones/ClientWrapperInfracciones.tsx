"use client";
import { useState } from "react";
import { ModalFormularioMaestro, CampoFormulario, estiloInputGlobal } from "@/components/ModalFormularioMaestro";

export function ClientWrapperInfracciones({ infraccionesIniciales, moviles, personas, action }: any) {
  const [modalOpen, setModalOpen] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState<"TODAS" | "PENDIENTE" | "PAGADO">("TODAS");
  
  const fechaHoy = new Date().toISOString().split("T")[0];

  // 1. Filtrado dinámico por estado de pago (Pestañas)
  const infraccionesPorEstado = infraccionesIniciales.filter((i: any) => {
    if (filtroEstado === "TODAS") return true;
    return i.estado === filtroEstado;
  });

  // 2. Filtrado dinámico por coincidencia en el buscador
  const infraccionesFiltradas = infraccionesPorEstado.filter((i: any) =>
    i.interno.toLowerCase().includes(busqueda.toLowerCase()) ||
    i.choferNombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    i.motivo.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div>
      {/* BARRA DE HERRAMIENTAS COMPACTA EN UNA SOLA LÍNEA */}
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 12, marginBottom: 16 }}>
        
        {/* Pestañas de Filtro de Multas */}
        <div style={{ display: "inline-flex", background: "var(--bg-pestañas, #f1f3f9)", border: "1px solid var(--border-color, #e2e8f0)", padding: 3, borderRadius: 8 }}>
          <button type="button" onClick={() => setFiltroEstado("TODAS")} style={{ padding: "6px 12px", fontSize: 12, fontWeight: 600, border: "none", borderRadius: 6, cursor: "pointer", background: filtroEstado === "TODAS" ? "var(--bg-tarjeta, #fff)" : "transparent", color: filtroEstado === "TODAS" ? "var(--texto-principal, #1e293b)" : "#64748b" }}>
            Todas
          </button>
          <button type="button" onClick={() => setFiltroEstado("PENDIENTE")} style={{ padding: "6px 12px", fontSize: 12, fontWeight: 600, border: "none", borderRadius: 6, cursor: "pointer", background: filtroEstado === "PENDIENTE" ? "var(--bg-tarjeta, #fff)" : "transparent", color: filtroEstado === "PENDIENTE" ? "var(--texto-principal, #1e293b)" : "#64748b" }}>
            ⚖️ Pendientes
          </button>
          <button type="button" onClick={() => setFiltroEstado("PAGADO")} style={{ padding: "6px 12px", fontSize: 12, fontWeight: 600, border: "none", borderRadius: 6, cursor: "pointer", background: filtroEstado === "PAGADO" ? "var(--bg-tarjeta, #fff)" : "transparent", color: filtroEstado === "PAGADO" ? "var(--texto-principal, #1e293b)" : "#64748b" }}>
            ✅ Pagadas
          </button>
        </div>

        {/* Buscador de grilla y botón alineados en la misma franja horizontal */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1, maxWidth: 450, marginLeft: "auto" }}>
          <input 
            type="text" 
            placeholder="Buscar por interno, chofer, motivo..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            style={{ flex: 1, padding: "6px 10px", fontSize: 13, borderRadius: 6, border: "1px solid var(--border-color, #d9deee)", background: "var(--bg-input, #fff)", color: "var(--texto-principal, #000)" }}
          />
          <button type="button" onClick={() => setModalOpen(true)} style={{ padding: "6px 14px", fontSize: 13, fontWeight: 600, borderRadius: 6, border: "none", background: "#0070f3", color: "#fff", cursor: "pointer", whiteSpace: "nowrap" }}>
            + Nueva Infracción
          </button>
        </div>
      </div>

      <p style={{ fontSize: 12, color: "#64748b", marginBottom: 8, fontFamily: "monospace" }}>{infraccionesFiltradas.length} sanciones registradas</p>

      {/* --- TABLA INTEGRADA DE ALTA DENSIDAD INLINE (CERO TRABAS) --- */}
      <div style={{ overflowX: "auto", borderRadius: 10, border: "1px solid var(--border-color, #e2e8f0)", background: "var(--bg-tarjeta, #fff)" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: 13 }}>
          <thead>
            <tr style={{ background: "var(--bg-cabecera, #f8fafc)", borderBottom: "1px solid var(--border-color, #e2e8f0)", color: "#64748b", fontSize: 11, textTransform: "uppercase", fontWeight: 700 }}>
              <th style={{ padding: "8px 12px", width: 60, textAlign: "center" }}>Int.</th>
              <th style={{ padding: "8px 12px" }}>Unidad Sancionada / Chofer</th>
              <th style={{ padding: "8px 12px" }}>Detalle del Reporte de Infracción</th>
              <th style={{ padding: "8px 12px", width: 110 }}>Estado Multa</th>
              <th style={{ padding: "8px 12px", textAlign: "right", paddingRight: 20, width: 60 }}>Acciones</th>
            </tr>
          </thead>
          <tbody style={{ color: "var(--texto-principal, #334155)" }}>
            {infraccionesFiltradas.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ padding: 20, textAlign: "center", color: "#94a3b8", fontStyle: "italic" }}>
                  No se registran reportes de infracción en esta sección.
                </td>
              </tr>
            ) : (
              infraccionesFiltradas.map((i: any) => (
                <tr key={i.id} style={{ borderBottom: "1px solid var(--border-color, #f1f5f9)" }}>
                  <td style={{ padding: "10px 12px", textAlign: "center", fontWeight: "bold", fontSize: 15 }}>{i.interno}</td>
                  <td style={{ padding: "10px 12px" }}>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <span style={{ fontWeight: 600 }}>{i.choferNombre}</span>
                      <span style={{ fontSize: 11, color: "#94a3b8", marginTop: 2, fontFamily: "monospace" }}>Placa: {i.placa}</span>
                    </div>
                  </td>
                  <td style={{ padding: "10px 12px" }}>
                    {/* Agrupación vertical limpia de Motivo, Monto y Fecha */}
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <span style={{ fontWeight: 600, color: "#c5221f" }}>⚠️ {i.motivo}</span>
                      <span style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>💰 Multa: Bs. {i.monto} | Fecha: {i.fecha}</span>
                    </div>
                  </td>
                  <td style={{ padding: "10px 12px" }}>
                    <span style={{ fontSize: 11, padding: "2px 6px", borderRadius: 12, fontWeight: 600, background: i.estado === "PAGADO" ? "#e6f4ea" : "#fce8e6", color: i.estado === "PAGADO" ? "#137333" : "#c5221f" }}>
                      {i.estado === "PAGADO" ? "✔ PAGADA" : "⏳ PENDIENTE"}
                    </span>
                  </td>
                  <td style={{ padding: "10px 12px", textAlign: "right", paddingRight: 20 }}>
                    <button type="button" style={{ background: "none", border: "none", cursor: "pointer", fontSize: 12 }} title="Cobrar Multa">💵</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* REUTILIZACIÓN DE NUESTRA PLANTILLA MAESTRA DE FORMULARIOS */}
      <ModalFormularioMaestro isOpen={modalOpen} onClose={() => setModalOpen(false)} titulo="Registrar nueva infracción / multa" etiquetaBoton="Publicar Sanción de Unidad" action={action}>
        <div style={{ display: "flex", gap: 12 }}>
          <div style={{ flex: 1 }}>
            <CampoFormulario label="Fecha del incidente">
              <input type="date" name="fecha" required defaultValue={fechaHoy} style={estiloInputGlobal} />
            </CampoFormulario>
          </div>
          <div style={{ flex: 1 }}>
            <CampoFormulario label="Monto de la multa (Bs.)">
              <input type="number" name="monto" required placeholder="Ej. 50" style={estiloInputGlobal} />
            </CampoFormulario>
          </div>
        </div>

        <div style={{ display: "flex", gap: 12 }}>
          <div style={{ flex: 1 }}>
            <CampoFormulario label="Unidad Móvil (Interno)">
              <select name="movilId" required style={estiloInputGlobal}>
                <option value="">Seleccionar...</option>
                {moviles.map((m: any) => (<option key={m.id} value={m.id}>Interno {m.numeroInterno}</option>))}
              </select>
            </CampoFormulario>
          </div>
          <div style={{ flex: 1 }}>
            <CampoFormulario label="Chofer Infractor">
              <select name="choferId" required style={estiloInputGlobal}>
                <option value="">Seleccionar...</option>
                {personas.map((p: any) => (<option key={p.id} value={p.id}>{p.nombre}</option>))}
              </select>
            </CampoFormulario>
          </div>
        </div>

        <div>
          <CampoFormulario label="Motivo de la infracción / Falta">
            <select name="motivo" defaultValue="Falta a su turno" style={estiloInputGlobal}>
              <option value="Falta a su turno">Falta injustificada a su turno</option>
              <option value="Atraso en parada">Atraso excesivo en parada</option>
              <option value="Uniforme incompleto">Infracción por uniforme o aseo</option>
              <option value="Falta de respeto">Falta de respeto a la secretaria/pasajero</option>
              <option value="Exceso de velocidad">Conducción peligrosa / Exceso de velocidad</option>
            </select>
          </CampoFormulario>
        </div>
      </ModalFormularioMaestro>
    </div>
  );
}
