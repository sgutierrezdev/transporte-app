"use client";
import { useState } from "react";
import { TablaPersonasCompacta } from "@/components/TablaPersonas";
import { ModalPersonaCompacto } from "@/components/ModalPersona";

export function ComponentePersonasCliente({ personasIniciales, rolesConst, estadosConst, nombreRol, nombreEstado, crearPersonaAction }: any) {
  const [rolFiltro, setRolFiltro] = useState<string>("TODOS");
  const [modalOpen, setModalOpen] = useState(false);
  const [busqueda, setBusqueda] = useState("");

  // 1. Filtrado dinámico por la pestaña de Rol seleccionada
  const personasPorRol = personasIniciales.filter((p: any) => {
    if (rolFiltro === "TODOS") return true;
    return p.rol === rolFiltro;
  });

  // 2. Filtrado dinámico por caracteres ingresados en el buscador
  const personasFiltradas = personasPorRol.filter((p: any) =>
    p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    (p.carnet && p.carnet.toLowerCase().includes(busqueda.toLowerCase())) ||
    (nombreRol[p.rol] && nombreRol[p.rol].toLowerCase().includes(busqueda.toLowerCase()))
  );

  return (
    <div>
      {/* BARRA DE HERRAMIENTAS SUPERIOR EN UNA SOLA LÍNEA */}
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 12, marginBottom: 16 }}>
        
        {/* Pestañas de Roles Dinámicos */}
        <div style={{ display: "inline-flex", background: "var(--bg-pestañas, #f1f3f9)", border: "1px solid var(--border-color, #e2e8f0)", padding: 3, borderRadius: 8 }}>
          <button 
            onClick={() => setRolFiltro("TODOS")}
            style={{ padding: "6px 12px", fontSize: 12, fontWeight: 600, border: "none", borderRadius: 6, cursor: "pointer", background: rolFiltro === "TODOS" ? "var(--bg-tarjeta, #fff)" : "transparent", color: rolFiltro === "TODOS" ? "var(--texto-principal, #1e293b)" : "#64748b" }}
          >
            Todos
          </button>
          {rolesConst.map((r: string) => (
            <button
              key={r}
              onClick={() => setRolFiltro(r)}
              style={{ padding: "6px 12px", fontSize: 12, fontWeight: 600, border: "none", borderRadius: 6, cursor: "pointer", background: rolFiltro === r ? "var(--bg-tarjeta, #fff)" : "transparent", color: rolFiltro === r ? "var(--texto-principal, #1e293b)" : "#64748b" }}
            >
              {nombreRol[r]}
            </button>
          ))}
        </div>

        {/* Buscador y Botón alineados a la derecha */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1, maxWidth: 450, marginLeft: "auto" }}>
          <input 
            type="text" 
            placeholder="Buscar por nombre, carnet..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            style={{ flex: 1, padding: "6px 10px", fontSize: 13, borderRadius: 6, border: "1px solid var(--border-color, #d9deee)", background: "var(--bg-input, #fff)", color: "var(--texto-principal, #000)" }}
          />
          <button 
            onClick={() => setModalOpen(true)}
            style={{ padding: "6px 14px", fontSize: 13, fontWeight: 600, borderRadius: 6, border: "none", background: "#0070f3", color: "#fff", cursor: "pointer", whiteSpace: "nowrap" }}
          >
            + Nueva persona
          </button>
        </div>
      </div>

      <p style={{ fontSize: 12, color: "#64748b", marginBottom: 8, fontFamily: "monospace" }}>{personasFiltradas.length} registrados encontrados</p>

      {/* Render de la Tabla */}
      <TablaPersonasCompacta datos={personasFiltradas} nombreRol={nombreRol} nombreEstado={nombreEstado} />

      {/* Render del Modal */}
      <ModalPersonaCompacto 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        roles={rolesConst}
        estados={estadosConst}
        nombreRol={nombreRol}
        nombreEstado={nombreEstado}
        action={crearPersonaAction}
      />
    </div>
  );
}
