"use client";
import { useState } from "react";
import { TablaParadasCompacta } from "@/components/TablaParadas";
import { ModalFormularioMaestro, CampoFormulario, estiloInputGlobal } from "@/components/ModalFormularioMaestro";

export function ComponenteParadasCliente({ paradasIniciales, personas, crearParadaAction }: any) {
  const [modalOpen, setModalOpen] = useState(false);
  const [busqueda, setBusqueda] = useState("");

  // Filtrado de concordancia del buscador en la misma línea
  const paradasFiltradas = paradasIniciales.filter((p: any) =>
    p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    p.ubicacion.toLowerCase().includes(busqueda.toLowerCase()) ||
    p.secretariaNombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div>
      {/* BARRA DE HERRAMIENTAS COMPACTA EN UNA SOLA LÍNEA */}
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 12, marginBottom: 16 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>Módulos de Terminales y Paradas</h2>
          <p style={{ margin: 0, fontSize: 12, color: "#64748b", fontFamily: "monospace", marginTop: 2 }}>
            {paradasFiltradas.length} paradas operacionales en el sistema
          </p>
        </div>

        {/* Buscador de grilla y botón alineados en la misma franja horizontal */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1, maxWidth: 450, marginLeft: "auto" }}>
          <input 
            type="text" 
            placeholder="Buscar por parada, ubicación, encargada..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            style={{ flex: 1, padding: "6px 10px", fontSize: 13, borderRadius: 6, border: "1px solid var(--border-color, #d9deee)", background: "var(--bg-input, #fff)", color: "var(--texto-principal, #000)" }}
          />
          <button 
            onClick={() => setModalOpen(true)}
            style={{ padding: "6px 14px", fontSize: 13, fontWeight: 600, borderRadius: 6, border: "none", background: "#0070f3", color: "#fff", cursor: "pointer", whiteSpace: "nowrap" }}
          >
            + Nueva parada
          </button>
        </div>
      </div>

      {/* Renderizado de la tabla compacta */}
      <TablaParadasCompacta datos={paradasFiltradas} />

      {/* REUTILIZACIÓN DE TU PLANTILLA MAESTRA DE FORMULARIOS */}
      <ModalFormularioMaestro
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        titulo="Registrar nueva parada de transporte"
        etiquetaBoton="Registrar Terminal"
        action={crearParadaAction}
      >
        <CampoFormulario label="Nombre de la estación / Parada">
          <input name="nombre" required placeholder="Ej. Okinawa Uno, Warnes" style={estiloInputGlobal} />
        </CampoFormulario>

        {/* Fila Dual Corta usando Flexbox */}
        <div style={{ display: "flex", gap: 12 }}>
          <div style={{ flex: 1 }}>
            <CampoFormulario label="Ubicación geográfica">
              <select name="ubicacion" defaultValue="Ciudad" style={estiloInputGlobal}>
                <option value="Ciudad">Ciudad</option>
                <option value="Provincia">Provincia</option>
              </select>
            </CampoFormulario>
          </div>
          <div style={{ flex: 1 }}>
            <CampoFormulario label="Secretaria / Encargada de Caja">
              <select name="secretariaId" defaultValue="" style={estiloInputGlobal}>
                <option value="">Sin asignar</option>
                {personas.map((s: any) => (
                  <option key={s.id} value={s.id}>{s.nombre}</option>
                ))}
              </select>
            </CampoFormulario>
          </div>
        </div>
      </ModalFormularioMaestro>
    </div>
  );
}
