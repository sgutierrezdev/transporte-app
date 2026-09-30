"use client";

import { useEffect, useState, useRef } from "react";
import { useFormStatus } from "react-dom";

/**
 * Cierra el formulario padre automáticamente cuando la acción del servidor
 * termina con éxito (pending pasa de true a false). Debe ir DENTRO del <form>.
 */
function CerrarAlEnviar({ onDone }: { onDone: () => void }) {
  const { pending } = useFormStatus();
  const estabaPendiente = useRef(false);

  useEffect(() => {
    if (pending) {
      estabaPendiente.current = true;
    } else if (estabaPendiente.current) {
      estabaPendiente.current = false;
      onDone();
    }
  }, [pending, onDone]);

  return null;
}

export default function FormularioColapsable({
  etiquetaBoton,
  titulo,
  children,
}: {
  etiquetaBoton: string;
  titulo: string;
  children: React.ReactNode;
}) {
  const [abierto, setAbierto] = useState(false);

  if (!abierto) {
    return (
      <button onClick={() => setAbierto(true)} style={estiloBotonAbrir}>
        + {etiquetaBoton}
      </button>
    );
  }

  return (
    <div
      style={{
        background: "#fff",
        border: "0.5px solid #d9deee",
        borderRadius: 12,
        padding: "1.25rem",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <p style={{ fontWeight: 500, margin: 0 }}>{titulo}</p>
        <button onClick={() => setAbierto(false)} style={estiloBotonCerrar} aria-label="Cerrar">
          ✕
        </button>
      </div>
      {children}
      <CerrarAlEnviar onDone={() => setAbierto(false)} />
    </div>
  );
}

const estiloBotonAbrir: React.CSSProperties = {
  padding: "8px 14px",
  borderRadius: 8,
  border: "1px solid #1e2761",
  background: "#fff",
  color: "#1e2761",
  fontWeight: 500,
  fontSize: 13,
  cursor: "pointer",
  whiteSpace: "nowrap",
};

const estiloBotonCerrar: React.CSSProperties = {
  background: "transparent",
  border: "none",
  color: "#5b6591",
  cursor: "pointer",
  fontSize: 14,
  padding: 4,
};
