"use client";
import { useState } from "react";
import { TablaGruposCompacta } from "@/components/TablaGrupos";
import { ModalFormularioMaestro, CampoFormulario, estiloInputGlobal } from "@/components/ModalFormularioMaestro";

export function ComponenteGruposCliente({ gruposIniciales, personas, crearGrupoAction }: any) {
  const [modalOpen, setModalOpen] = useState(false);
  const [busqueda, setBusqueda] = useState("");

  // Filtrado de coincidencia en la misma línea
  const gruposFiltrados = gruposIniciales.filter((g: any) =>
    g.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    g.jefeNombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div>
      {/* BARRA DE HERRAMIENTAS COMPACTA EN UNA SOLA LÍNEA */}
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 12, marginBottom: 16 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>Módulos de Grupos y Líneas</h2>
          <p style={{ margin: 0, fontSize: 12, color: "#64748b", fontFamily: "monospace", marginTop: 2 }}>
            {gruposFiltrados.length} grupos registrados · Subgrupos A/B autogenerados
          </p>
        </div>

        {/* Buscador de grilla y botón alineados a la derecha */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1, maxWidth: 450, marginLeft: "auto" }}>
          <input 
            type="text" 
            placeholder="Buscar por grupo o jefe de línea..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            style={{ flex: 1, padding: "6px 10px", fontSize: 13, borderRadius: 6, border: "1px solid var(--border-color, #d9deee)", background: "var(--bg-input, #fff)", color: "var(--texto-principal, #000)" }}
          />
          <button 
            onClick={() => setModalOpen(true)}
            style={{ padding: "6px 14px", fontSize: 13, fontWeight: 600, borderRadius: 6, border: "none", background: "#0070f3", color: "#fff", cursor: "pointer", whiteSpace: "nowrap" }}
          >
            + Nuevo grupo
          </button>
        </div>
      </div>

      {/* Renderizado de la tabla compacta */}
      <TablaGruposCompacta datos={gruposFiltrados} />

      {/* USO DE TU PLANTILLA REUTILIZABLE (ModalFormularioMaestro) */}
      <ModalFormularioMaestro
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        titulo="Registrar nuevo grupo de rotación"
        etiquetaBoton="Registrar Grupo (Genera Subgrupos A y B)"
        action={crearGrupoAction}
      >
        <CampoFormulario label="Nombre del grupo (ej. 1, 2, 3)">
          <input name="nombre" required placeholder="Ej. 5" style={estiloInputGlobal} />
        </CampoFormulario>

        <CampoFormulario label="Jefe de línea (Opcional, asignable después)">
          <select name="jefeId" defaultValue="" style={estiloInputGlobal}>
            <option value="">Sin asignar</option>
            {personas.map((p: any) => (
              <option key={p.id} value={p.id}>{p.nombre}</option>
            ))}
          </select>
        </CampoFormulario>
      </ModalFormularioMaestro>
    </div>
  );
}
