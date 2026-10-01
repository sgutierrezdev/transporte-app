"use client";
import { useState } from "react";
import { TablaMovilesCompacta } from "@/components/TablaMoviles";
import { ModalMovilCompacto } from "@/components/ModalMovil";

export function ComponenteMovilesCliente({ movilesIniciales, subgrupos, personas, crearMovilAction }: any) {
  const [enfoque, setEnfoque] = useState<"socio" | "chofer">("socio");
  const [modalOpen, setModalOpen] = useState(false);
  const [busqueda, setBusqueda] = useState("");

  // Filtrado en tiempo real en la misma línea
  const movilesFiltrados = movilesIniciales.filter((m: any) =>
    m.interno.toLowerCase().includes(busqueda.toLowerCase()) ||
    m.placa.toLowerCase().includes(busqueda.toLowerCase()) ||
    m.socioNombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    m.choferNombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div>
      {/* BARRA DE HERRAMIENTAS EN LA MISMA LÍNEA */}
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 12, marginBottom: 16 }}>
        
        {/* Pestañas Compactas Neutras */}
        <div style={{ display: "inline-flex", background: "var(--bg-pestañas, #f1f3f9)", border: "1px solid var(--border-color, #e2e8f0)", padding: 3, borderRadius: 8 }}>
          <button 
            onClick={() => setEnfoque("socio")}
            style={{ padding: "6px 12px", fontSize: 12, fontWeight: 600, border: "none", borderRadius: 6, cursor: "pointer", background: enfoque === "socio" ? "var(--bg-tarjeta, #fff)" : "transparent", color: enfoque === "socio" ? "var(--texto-principal, #1e293b)" : "#64748b" }}
          >
            Ver Socios (Dueños)
          </button>
          <button 
            onClick={() => setEnfoque("chofer")}
            style={{ padding: "6px 12px", fontSize: 12, fontWeight: 600, border: "none", borderRadius: 6, cursor: "pointer", background: enfoque === "chofer" ? "var(--bg-tarjeta, #fff)" : "transparent", color: enfoque === "chofer" ? "var(--texto-principal, #1e293b)" : "#64748b" }}
          >
            Ver Choferes
          </button>
        </div>

        {/* Buscador y Botón en la misma línea */}
        <div style={{ display: "flex", itemsCenter: "center", gap: 8, flex: 1, maxWidth: 500, marginLeft: "auto" }}>
          <input 
            type="text" 
            placeholder="Buscar por interno, placa, socio..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            style={{ flex: 1, padding: "6px 10px", fontSize: 13, borderRadius: 6, border: "1px solid var(--border-color, #d9deee)", background: "var(--bg-input, #fff)", color: "var(--texto-principal, #000)" }}
          />
          <button 
            onClick={() => setModalOpen(true)}
            style={{ padding: "6px 14px", fontSize: 13, fontWeight: 600, borderRadius: 6, border: "none", background: "#0070f3", color: "#fff", cursor: "pointer", whiteSpace: "nowrap" }}
          >
            + Nuevo móvil
          </button>
        </div>
      </div>

      <p style={{ fontSize: 12, color: "#64748b", marginBottom: 8, fontFamily: "monospace" }}>{movilesFiltrados.length} unidades encontradas</p>

      {/* Render de la Tabla */}
      <TablaMovilesCompacta datos={movilesFiltrados} enfoque={enfoque} />

      {/* Render del Modal */}
      <ModalMovilCompacto 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        subgrupos={subgrupos} 
        personas={personas} 
        action={crearMovilAction} 
      />
    </div>
  );
}
