"use client";
import { useState } from "react";
import { ModalFormularioMaestro, CampoFormulario, estiloInputGlobal } from "@/components/ModalFormularioMaestro";

export function ClientWrapperCaja({ ingresosIniciales, paradas, tiposIngreso, action }: any) {
  const [modalOpen, setModalOpen] = useState(false);
  const [busqueda, setBusqueda] = useState("");

  const ingresosFiltrados = ingresosIniciales.filter((i: any) =>
    i.paradaNombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    i.concepto.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div style={{ width: "100%", maxWidth: "100%", overflow: "hidden", boxSizing: "border-box" }}>
      {/* BARRA DE HERRAMIENTAS CONTABLE EN UNA SOLA LÍNEA */}
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 12, marginBottom: 16 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>Flujo de Caja y Recaudación</h2>
          <p style={{ margin: 0, fontSize: 12, color: "#64748b", fontFamily: "monospace", marginTop: 2 }}>
            {ingresosFiltrados.length} transacciones registradas en caja
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1, maxWidth: 450, marginLeft: "auto" }}>
          <input 
            type="text" 
            placeholder="Buscar por parada o concepto..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            style={{ flex: 1, padding: "6px 10px", fontSize: 13, borderRadius: 6, border: "1px solid var(--border-color, #d9deee)", background: "var(--bg-input, #fff)", color: "var(--texto-principal, #000)" }}
          />
          <button type="button" onClick={() => setModalOpen(true)} style={{ padding: "6px 14px", fontSize: 13, fontWeight: 600, borderRadius: 6, border: "none", background: "#0070f3", color: "#fff", cursor: "pointer", whiteSpace: "nowrap" }}>
            + Registrar Ingreso
          </button>
        </div>
      </div>

      {/* --- TABLA CONTABLE RESPONSIVA INTEGRADA AL ESTILO ADMINLTE --- */}
      <div style={{ width: "100%", overflowX: "auto", WebkitOverflowScrolling: "touch", borderRadius: 10, border: "1px solid var(--border-color, #e2e8f0)", background: "var(--bg-tarjeta, #fff)", boxSizing: "border-box" }}>
        <table style={{ width: "100%", minWidth: 650, borderCollapse: "collapse", textAlign: "left", fontSize: 13 }}>
          <thead>
            <tr style={{ background: "var(--bg-cabecera, #f8fafc)", borderBottom: "1px solid var(--border-color, #e2e8f0)", color: "#64748b", fontSize: 11, textTransform: "uppercase", fontWeight: 700 }}>
              <th style={{ padding: "10px 12px" }}>Estación de Control</th>
              <th style={{ padding: "10px 12px" }}>Detalle Contable / Cuenta</th>
              <th style={{ padding: "10px 12px", width: 140 }}>Monto Registrado</th>
              <th style={{ padding: "10px 12px", textAlign: "right", paddingRight: 20, width: 60 }}>Acciones</th>
            </tr>
          </thead>
          <tbody style={{ color: "var(--texto-principal, #334155)" }}>
            {ingresosFiltrados.length === 0 ? (
              <tr>
                <td colSpan={4} style={{ padding: 20, textAlign: "center", color: "#94a3b8", fontStyle: "italic" }}>
                  No se registran movimientos de ingresos de caja en el sistema.
                </td>
              </tr>
            ) : (
              ingresosFiltrados.map((i: any) => (
                <tr key={i.id} style={{ borderBottom: "1px solid var(--border-color, #f1f5f9)" }}>
                  <td style={{ padding: "12px 12px", fontWeight: "bold", fontSize: 14 }}>🛑 {i.paradaNombre}</td>
                  <td style={{ padding: "12px 12px" }}>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <span style={{ fontWeight: 600 }}>{i.concepto}</span>
                      <span style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>Recibo: {i.comprobante} | 🕒 {i.hora} ({i.fecha})</span>
                    </div>
                  </td>
                  <td style={{ padding: "12px 12px", fontWeight: "bold", color: "#137333", fontSize: 14 }}>
                    Bs. {i.monto}
                  </td>
                  <td style={{ padding: "12px 12px", textAlign: "right", paddingRight: 20 }}>
                    <button type="button" style={{ background: "none", border: "none", cursor: "pointer", fontSize: 12 }}>🗑️</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* REUTILIZACIÓN DE TU FORM TEMPLATE MAESTRO */}
      <ModalFormularioMaestro isOpen={modalOpen} onClose={() => setModalOpen(false)} titulo="Registrar ingreso de dinero a caja" etiquetaBoton="Publicar Movimiento Contable" action={action}>
        <div style={{ display: "flex", gap: 12 }}>
          <div style={{ flex: 1 }}>
            <CampoFormulario label="Monto en efectivo (Bs.)">
              <input type="number" name="monto" required placeholder="Ej. 15" style={estiloInputGlobal} />
            </CampoFormulario>
          </div>
          <div style={{ flex: 1 }}>
            <CampoFormulario label="Nº Recibo / Comprobante">
              <input type="text" name="comprobante" placeholder="Ej. 0412" style={estiloInputGlobal} />
            </CampoFormulario>
          </div>
        </div>

        <div style={{ display: "flex", gap: 12 }}>
          <div style={{ flex: 1 }}>
            <CampoFormulario label="Estación / Parada colectora">
              <select name="paradaId" required style={estiloInputGlobal}>
                {paradas.map((p: any) => (<option key={p.id} value={p.id}>{p.nombre}</option>))}
              </select>
            </CampoFormulario>
          </div>
          <div style={{ flex: 1 }}>
            <CampoFormulario label="Concepto / Cuenta de Ingreso">
              <select name="tipoIngresoId" required style={estiloInputGlobal}>
                {tiposIngreso.map((t: any) => (<option key={t.id} value={t.id}>{t.nombre}</option>))}
              </select>
            </CampoFormulario>
          </div>
        </div>
      </ModalFormularioMaestro>
    </div>
  );
}
