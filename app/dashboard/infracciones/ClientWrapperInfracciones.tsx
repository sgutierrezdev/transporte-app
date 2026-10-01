"use client";
import { useState } from "react";
import { ModalFormularioMaestro, CampoFormulario, estiloInputGlobal } from "@/components/ModalFormularioMaestro";

export function ClientWrapperInfracciones({ tarifas, infraccionesIniciales, moviles, personas, action }: any) {
  const [vistaActual, setVistaActual] = useState<"BITACORA" | "TARIFAS">("BITACORA");
  const [modalMultaOpen, setModalMultaOpen] = useState(false);
  const [modalTarifaOpen, setModalTarifaOpen] = useState(false);
  const [busqueda, setBusqueda] = useState("");

  const filtrados = infraccionesIniciales.filter((i: any) =>
    i.interno.toLowerCase().includes(busqueda.toLowerCase()) || i.choferNombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div>
      {/* CONTROL DE PESTAÑAS Y HERRAMIENTAS EN LA MISMA LÍNEA */}
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 12, marginBottom: 16 }}>
        
        {/* Selector de Sección Operativa */}
        <div style={{ display: "inline-flex", background: "var(--bg-pestañas, #f1f3f9)", border: "1px solid var(--border-color, #e2e8f0)", padding: 3, borderRadius: 8 }}>
          <button type="button" onClick={() => setVistaActual("BITACORA")} style={{ padding: "6px 12px", fontSize: 12, fontWeight: 600, border: "none", borderRadius: 6, cursor: "pointer", background: vistaActual === "BITACORA" ? "var(--bg-tarjeta, #fff)" : "transparent", color: vistaActual === "BITACORA" ? "var(--texto-principal, #1e293b)" : "#64748b" }}>
            📋 Historial de Multas
          </button>
          <button type="button" onClick={() => setVistaActual("TARIFAS")} style={{ padding: "6px 12px", fontSize: 12, fontWeight: 600, border: "none", borderRadius: 6, cursor: "pointer", background: vistaActual === "TARIFAS" ? "var(--bg-tarjeta, #fff)" : "transparent", color: vistaActual === "TARIFAS" ? "var(--texto-principal, #1e293b)" : "#64748b" }}>
            ⚙️ Configurar Tarifas y Faltas
          </button>
        </div>

        {/* Acciones contextuales dinámicas según la pestaña activa */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginLeft: "auto" }}>
          {vistaActual === "BITACORA" ? (
            <>
              <input type="text" placeholder="Buscar interno o chofer..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)} style={{ padding: "6px 10px", fontSize: 13, borderRadius: 6, border: "1px solid var(--border-color, #d9deee)", background: "var(--bg-input, #fff)", color: "var(--texto-principal, #000)" }} />
              <button type="button" onClick={() => setModalMultaOpen(true)} style={{ padding: "6px 14px", fontSize: 13, fontWeight: 600, borderRadius: 6, border: "none", background: "#0070f3", color: "#fff", cursor: "pointer" }}>+ Sancionar Unidad</button>
            </>
          ) : (
            <button type="button" onClick={() => setModalTarifaOpen(true)} style={{ padding: "6px 14px", fontSize: 13, fontWeight: 600, borderRadius: 6, border: "none", background: "#10b981", color: "#fff", cursor: "pointer" }}>+ Crear Tipo de Falta</button>
          )}
        </div>
      </div>

      {/* --- VISTA A: BITACORA DE MULTAS COMPACTA --- */}
      {vistaActual === "BITACORA" && (
        <div style={{ overflowX: "auto", borderRadius: 10, border: "1px solid var(--border-color, #e2e8f0)", background: "var(--bg-tarjeta, #fff)" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: 13 }}>
            <thead>
              <tr style={{ background: "var(--bg-cabecera, #f8fafc)", borderBottom: "1px solid var(--border-color, #e2e8f0)", color: "#64748b", fontSize: 11, textTransform: "uppercase", fontWeight: 700 }}><th style={{ padding: "8px 12px", textAlign: "center", width: 60 }}>Int.</th><th style={{ padding: "8px 12px" }}>Chofer / Unidad</th><th style={{ padding: "8px 12px" }}>Infracción y Costo</th><th style={{ padding: "8px 12px", width: 100 }}>Estado</th></tr>
            </thead>
            <tbody>
              {filtrados.map((i: any) => (
                <tr key={i.id} style={{ borderBottom: "1px solid var(--border-color, #f1f5f9)" }}>
                  <td style={{ padding: "10px 12px", textAlign: "center", fontWeight: "bold" }}>{i.interno}</td>
                  <td style={{ padding: "10px 12px" }}><div style={{ display: "flex", flexDirection: "column" }}><span style={{ fontWeight: 600 }}>{i.choferNombre}</span><span style={{ fontSize: 11, color: "#94a3b8" }}>Placa: {i.placa}</span></div></td>
                  <td style={{ padding: "10px 12px" }}><div style={{ display: "flex", flexDirection: "column" }}><span style={{ fontWeight: 600, color: "#c5221f" }}>⚠️ {i.motivo}</span><span style={{ fontSize: 11, color: "#64748b" }}>Monto: Bs. {i.monto} | Fecha: {i.fecha}</span></div></td>
                  <td style={{ padding: "10px 12px" }}><span style={{ fontSize: 11, padding: "2px 6px", borderRadius: 12, fontWeight: 600, background: i.estado === "PAGADO" ? "#e6f4ea" : "#fce8e6", color: i.estado === "PAGADO" ? "#137333" : "#c5221f" }}>{i.estado}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* --- VISTA B: PANEL DE TARIFAS (LO QUE PEDISTE CONTROLAR DESDE LA WEB) --- */}
      {vistaActual === "TARIFAS" && (
        <div style={{ overflowX: "auto", borderRadius: 10, border: "1px solid var(--border-color, #e2e8f0)", background: "var(--bg-tarjeta, #fff)" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: 13 }}>
            <thead>
              <tr style={{ background: "var(--bg-cabecera, #f8fafc)", borderBottom: "1px solid var(--border-color, #e2e8f0)", color: "#64748b", fontSize: 11, textTransform: "uppercase", fontWeight: 700 }}><th style={{ padding: "8px 12px" }}>Reglamento / Tipo de Falta</th><th style={{ padding: "8px 12px" }}>Monto Fijo Base</th><th style={{ padding: "8px 12px" }}>Tarifa Temporal Especial</th><th style={{ padding: "8px 12px", textAlign: "right", paddingRight: 20 }}>Acciones</th></tr>
            </thead>
            <tbody style={{ color: "var(--texto-principal, #334155)" }}>
              {tarifas.map((t: any) => (
                <tr key={t.id} style={{ borderBottom: "1px solid var(--border-color, #f1f5f9)" }}>
                  <td style={{ padding: "12px 12px", fontWeight: 600, fontSize: 14 }}>{t.nombre}</td>
                  <td style={{ padding: "12px 12px", fontWith: "bold", fontWeight: "bold" }}>Bs. {t.montoFijo}</td>
                  <td style={{ padding: "12px 12px" }}>
                    {t.montoEspecial ? (
                      <div style={{ display: "flex", flexDirection: "column" }}><span style={{ color: "#b06000", fontWeight: 600 }}>Bs. {t.montoEspecial} (Especial)</span><span style={{ fontSize: 11, color: "#94a3b8" }}>Vence: {t.fechaFin}</span></div>
                    ) : (
                      <span style={{ color: "#94a3b8", fontStyle: "italic" }}>Sin tarifa temporal activa</span>
                    )}
                  </td>
                  <td style={{ padding: "12px 12px", textAlign: "right", paddingRight: 20 }}><button type="button" style={{ background: "none", border: "none", cursor: "pointer", fontSize: 12 }} title="Ajustar Valores">✏️ Editar</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* --- FORMULARIO MAESTRO PARA CREAR/MODIFICAR TIPOS DE FALTA (PANEL DE CONTROL) --- */}
      <ModalFormularioMaestro isOpen={modalTarifaOpen} onClose={() => setModalTarifaOpen(false)} titulo="Administrar catálogo de infracciones" etiquetaBoton="Guardar Configuración de Tarifa" action={action}>
        <CampoFormulario label="Nombre de la infracción / Falta reglamentaria">
          <input name="nombre" required placeholder="Ej. Falta de Uniforme, Abandono de Parada" style={estiloInputGlobal} />
        </CampoFormulario>
        <div style={{ display: "flex", gap: 12 }}>
          <div style={{ flex: 1 }}><CampoFormulario label="Monto ordinario base (Bs.)"><input type="number" name="montoFijo" required placeholder="Bs. 20" style={estiloInputGlobal} /></CampoFormulario></div>
          <div style={{ flex: 1 }}><CampoFormulario label="Monto especial temporal (Opcional)"><input type="number" name="montoEspecial" placeholder="Bs. 40" style={estiloInputGlobal} /></CampoFormulario></div>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <div style={{ flex: 1 }}><CampoFormulario label="Inicio vigencia especial"><input type="date" name="fechaInicio" style={estiloInputGlobal} /></CampoFormulario></div>
          <div style={{ flex: 1 }}><CampoFormulario label="Fin vigencia especial"><input type="date" name="fechaFin" style={estiloInputGlobal} /></CampoFormulario></div>
        </div>
      </ModalFormularioMaestro>
    </div>
  );
}
