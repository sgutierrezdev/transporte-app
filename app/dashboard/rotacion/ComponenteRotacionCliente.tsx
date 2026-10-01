"use client";
import { useState } from "react";
import { TablaRotacionesCompacta } from "@/components/TablaRotaciones";
import { ModalFormularioMaestro, CampoFormulario, estiloInputGlobal } from "@/components/ModalFormularioMaestro";

export function ComponenteRotacionCliente({ rotacionesIniciales, paradas, subgrupos, asignarAction }: any) {
  const [modalOpen, setModalOpen] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  
  // Capturamos la fecha de hoy por defecto como filtro rápido opcional
  const fechaHoy = new Date().toISOString().split("T")[0];
  const [filtroFecha, setFiltroFecha] = useState<string>("TODAS");

  // 1. Filtrado dinámico por fecha (Hoy / Historial completo)
  const rotacionesPorFecha = rotacionesIniciales.filter((r: any) => {
    if (filtroFecha === "TODAS") return true;
    return r.fecha === fechaHoy;
  });

  // 2. Filtrado dinámico por texto en el buscador superior
  const rotacionesFiltradas = rotacionesPorFecha.filter((r: any) =>
    r.paradaNombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    r.grupoAsignado.toLowerCase().includes(busqueda.toLowerCase()) ||
    r.fecha.includes(busqueda)
  );

  return (
    <div>
      {/* BARRA DE HERRAMIENTAS EN UNA SOLA LÍNEA HORIZONTAL */}
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 12, marginBottom: 16 }}>
        
        {/* Pestañas de Filtro Temporal Rápido */}
        <div style={{ display: "inline-flex", background: "var(--bg-pestañas, #f1f3f9)", border: "1px solid var(--border-color, #e2e8f0)", padding: 3, borderRadius: 8 }}>
          <button 
            onClick={() => setFiltroFecha("TODAS")}
            style={{ padding: "6px 12px", fontSize: 12, fontWeight: 600, border: "none", borderRadius: 6, cursor: "pointer", background: filtroFecha === "TODAS" ? "var(--bg-tarjeta, #fff)" : "transparent", color: filtroFecha === "TODAS" ? "var(--texto-principal, #1e293b)" : "#64748b" }}
          >
            Historial de Cambios
          </button>
          <button 
            onClick={() => setFiltroFecha("HOY")}
            style={{ padding: "6px 12px", fontSize: 12, fontWeight: 600, border: "none", borderRadius: 6, cursor: "pointer", background: filtroFecha === "HOY" ? "var(--bg-tarjeta, #fff)" : "transparent", color: filtroFecha === "HOY" ? "var(--texto-principal, #1e293b)" : "#64748b" }}
          >
            Ver Solo Hoy
          </button>
        </div>

        {/* Buscador de grilla y botón en la misma línea */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1, maxWidth: 450, marginLeft: "auto" }}>
          <input 
            type="text" 
            placeholder="Buscar por parada, fecha o grupo..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            style={{ flex: 1, padding: "6px 10px", fontSize: 13, borderRadius: 6, border: "1px solid var(--border-color, #d9deee)", background: "var(--bg-input, #fff)", color: "var(--texto-principal, #000)" }}
          />
          <button 
            onClick={() => setModalOpen(true)}
            style={{ padding: "6px 14px", fontSize: 13, fontWeight: 600, borderRadius: 6, border: "none", background: "#0070f3", color: "#fff", cursor: "pointer", whiteSpace: "nowrap" }}
          >
            + Asignar Rotación
          </button>
        </div>
      </div>

      <p style={{ fontSize: 12, color: "#64748b", marginBottom: 8, fontFamily: "monospace" }}>{rotacionesFiltradas.length} roles operativos listados</p>

      {/* Renderizado de la tabla compacta */}
      <TablaRotacionesCompacta datos={rotacionesFiltradas} />

      {/* ACOPLAMIENTO DE TU PLANTILLA REUTILIZABLE (ModalFormularioMaestro) */}
      <ModalFormularioMaestro
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        titulo="Asignar rotación diaria de subgrupos"
        etiquetaBoton="Confirmar y Publicar Rotación"
        action={asignarAction}
      >
        <div>
          <CampoFormulario label="Fecha de ejecución">
            <input type="date" name="fecha" required defaultValue={fechaHoy} style={estiloInputGlobal} />
          </CampoFormulario>
        </div>

        {/* Fila paralela corta usando Flexbox */}
        <div style={{ display: "flex", gap: 12 }}>
          <div style={{ flex: 1 }}>
            <CampoFormulario label="Terminal / Parada de destino">
              <select name="paradaId" required style={estiloInputGlobal}>
                {paradas.map((p: any) => (
                  <option key={p.id} value={p.id}>{p.nombre}</option>
                ))}
              </select>
            </CampoFormulario>
          </div>
          <div style={{ flex: 1 }}>
            <CampoFormulario label="Subgrupo asignado">
              <select name="subgrupoId" required style={estiloInputGlobal}>
                {subgrupos.map((s: any) => (
                  <option key={s.id} value={s.id}>Grupo {s.grupo.nombre} — {s.nombre}</option>
                ))}
              </select>
            </CampoFormulario>
          </div>
        </div>
      </ModalFormularioMaestro>
    </div>
  );
}
