"use client";
import React from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  titulo: string;
  etiquetaBoton: string;
  action: (formData: FormData) => void;
  children: React.ReactNode;
}

export function ModalFormularioMaestro({ isOpen, onClose, titulo, etiquetaBoton, action, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.4)", padding: 16 }}>
      <div style={{ width: "100%", maxWidth: 480, background: "var(--bg-tarjeta, #fff)", border: "1px solid var(--border-color, #e2e8f0)", borderRadius: 12, padding: 16, boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)" }}>
        
        {/* Cabecera del Molde */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--border-color, #e2e8f0)", paddingBottom: 8, marginBottom: 16 }}>
          <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: "var(--texto-principal, #1e293b)" }}>{titulo}</h3>
          <button 
            type="button"
            onClick={onClose} 
            style={{ fontSize: 11, fontWeight: 600, padding: "4px 10px", borderRadius: 6, border: "1px solid var(--border-color, #ccc)", cursor: "pointer", background: "transparent", color: "#64748b" }}
          >
            Cancelar
          </button>
        </div>

        {/* Cuerpo Dinámico inyectado por la página */}
        <form 
          action={(formData) => { 
            action(formData); 
            onClose(); 
          }} 
          style={{ display: "flex", flexDirection: "column", gap: 12 }}
        >
          {children}

          {/* Botón de Confirmación del Molde */}
          <button 
            type="submit" 
            style={{ padding: "10px", borderRadius: 6, border: "none", background: "#0070f3", color: "#fff", fontWeight: 600, cursor: "pointer", fontSize: 13, marginTop: 8 }}
          >
            {etiquetaBoton}
          </button>
        </form>
      </div>
    </div>
  );
}

// Estilo de entrada genérico para exportar y usar en tus campos
export const estiloInputGlobal = {
  width: "100%",
  padding: "6px 8px",
  borderRadius: 6,
  border: "1px solid var(--border-color, #d9deee)",
  fontSize: 13,
  background: "var(--bg-input, #fff)",
  color: "var(--texto-principal, #000)",
  boxSizing: "border-box" as const
};

// Componente de Campo auxiliar para las etiquetas
export function CampoFormulario({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label style={{ display: "block" }}>
      <span style={{ fontSize: 11, color: "#64748b", display: "block", marginBottom: 4, fontWeight: 500 }}>
        {label}
      </span>
      {children}
    </label>
  );
}
