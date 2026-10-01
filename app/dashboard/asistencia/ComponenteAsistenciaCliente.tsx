"use client";
import { useState } from "react";
import { TablaAsistenciasCompacta } from "@/components/TablaAsistencias";
import { ModalFormularioMaestro, CampoFormulario, estiloInputGlobal } from "@/components/ModalFormularioMaestro";

export function ComponenteAsistenciaCliente({ asistenciasIniciales, paradas, moviles, registrarAction }: any) {
  const [modalOpen, setModalOpen] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  
  const fechaHoy = new Date().toISOString().split("T")[0];
  const [filtroTemporal, setFiltroTemporal] = useState<"HOY" | "HISTORIAL">("HOY");

  // 1. Filtrado dinámico temporal (Ver solo el control de hoy o la bitácora completa)
  const asistenciasPorFecha = asistenciasIniciales.filter((a: any) => {
    if (filtroTemporal === "HISTORIAL") return true;
    return a.fecha === fechaHoy;
  });

  // 2. Filtrado dinámico por texto (Interno, chofer, parada)
  const asistenciasFiltradas = asistenciasPorFecha.filter((a: any) =>
    a.interno.toLowerCase().includes(busqueda.toLowerCase()) ||
    a.choferNombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    a.paradaNombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div>
      {/* BARRA DE HERRAMIENTAS SUPERIOR COMPACTA */}
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 12, marginBottom: 16 }}>
        
        {/* Selector de Segmentación Temporal */}
        <div style={{ display: "inline-flex", background: "var(--bg-pestañas, #f1f3f9)", border: "1px solid var(--border-color, #e2e8f0)", padding: 3, borderRadius: 8 }}>
          <button 
            onClick={() => setFiltroTemporal("HOY")}
            style={{ padding: "6px 12px", fontSize: 12, fontWeight: 600, border: "none", borderRadius: 6, cursor: "pointer", background: filtroTemporal === "HOY" ? "var(--bg-tarjeta, #fff)" : "transparent", color: filtroTemporal === "HOY" ? "var(--texto-principal, #1e293b)" : "#64748b" }}
          >
            Fichajes de Hoy
          </button>
          <button 
            onClick={() => setFiltroTemporal("HISTORIAL")}
            style={{ padding: "6px 12px", fontSize: 12, fontWeight: 600, border: "none", borderRadius: 6, cursor: "pointer", background: filtroTemporal === "HISTORIAL" ? "var(--bg-tarjeta, #fff)" : "transparent", color: filtroTemporal === "HISTORIAL" ? "var(--texto-principal, #1e293b)" : "#64748b" }}
          >
            Bitácora General
          </button>
        </div>

        {/* Controles del buscador unificados a la derecha */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1, maxWidth: 450, marginLeft: "auto" }}>
          <input 
            type="text" 
            placeholder="Buscar por interno, chofer, parada..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            style={{ flex: 1, padding: "6px 10px", fontSize: 13, borderRadius: 6, border: "1px solid var(--border-color, #d9deee)", background: "var(--bg-input, #fff)", color: "var(--texto-principal, #000)" }}
          />
          <button 
            onClick={() => setModalOpen(true)}
            style={{ padding: "6px 14px", fontSize: 13, fontWeight: 600, borderRadius: 6, border: "none", background: "#0070f3", color: "#fff", cursor: "pointer", whiteSpace: "nowrap" }}
          >
            + Marcar Asistencia
          </button>
        </div>
      </div>

      <p style={{ fontSize: 12, color: "#64748b", marginBottom: 8, fontFamily: "monospace" }}>{asistenciasFiltradas.length} marcaciones en esta vista</p>

      {/* Renderizado de la tabla compacta */}
      <TablaAsistenciasCompacta datos={asistenciasFiltradas} />

      {/* REUTILIZACIÓN DE NUESTRA PLANTILLA MAESTRA FORMULARIOS */}
      <ModalFormularioMaestro
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        titulo="Registrar marca de asistencia diaria"
        etiquetaBoton="Publicar Fichaje de Unidad"
        action={registrarAction}
      >
        <div style={{ display: "flex", gap: 12 }}>
          <div style={{ flex: 1 }}>
            <CampoFormulario label="Fecha">
              <input type="date" name="fecha" required defaultValue={fechaHoy} style={estiloInputGlobal} />
            </CampoFormulario>
          </div>
          <div style={{ flex: 1 }}>
            <CampoFormulario label="Hora exacta">
              <input type="time" name="hora" required style={estiloInputGlobal} />
            </CampoFormulario>
          </div>
        </div>

        <div style={{ display: "flex", gap: 12 }}>
          <div style={{ flex: 1 }}>
            <CampoFormulario label="Estación / Parada">
              <select name="paradaId" required style={estiloInputGlobal}>
                {paradas.map((p: any) => (
                  <option key={p.id} value={p.id}>{p.nombre}</option>
                ))}
              </select>
            </CampoFormulario>
          </div>
          <div style={{ flex: 1 }}>
            <CampoFormulario label="Unidad Móvil (Interno)">
              <select name="movilId" required style={estiloInputGlobal}>
                <option value="">Seleccionar interno...</option>
                {moviles.map((m: any) => (
                  <option key={m.id} value={m.id}>Interno {m.numeroInterno} ({m.placa || "Sin placa"})</option>
                ))}
              </select>
            </CampoFormulario>
          </div>
        </div>

        <div style={{ display: "flex", gap: 12 }}>
          <div style={{ flex: 1 }}>
            <CampoFormulario label="Tipo de Registro">
              <select name="tipo" defaultValue="ENTRADA" style={estiloInputGlobal}>
                <option value="ENTRADA">Entrada al turno</option>
                <option value="SALIDA">Salida del turno</option>
              </select>
            </CampoFormulario>
          </div>
          <div style={{ flex: 1 }}>
            <CampoFormulario label="Calificación / Estado">
              <select name="estado" defaultValue="PRESENTE" style={estiloInputGlobal}>
                <option value="PRESENTE">A tiempo / Presente</option>
                <option value="TARDE">Atraso / Tarde</option>
                <option value="FALTA">Falta / No se presentó</option>
              </select>
            </CampoFormulario>
          </div>
        </div>
      </ModalFormularioMaestro>
    </div>
  );
}
