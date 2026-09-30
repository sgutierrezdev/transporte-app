"use client";

import { useMemo, useState } from "react";

type Item = { id: string; texto: string; nodo: React.ReactNode };

export default function BuscadorLista({
  items,
  placeholder,
}: {
  items: Item[];
  placeholder: string;
}) {
  const [busqueda, setBusqueda] = useState("");

  const filtrados = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    if (!q) return items;
    return items.filter((i) => i.texto.toLowerCase().includes(q));
  }, [items, busqueda]);

  return (
    <div>
      <input
        type="text"
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        placeholder={placeholder}
        style={{
          width: "100%",
          padding: "8px 10px",
          borderRadius: 8,
          border: "1px solid #d9deee",
          marginBottom: 12,
        }}
      />
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 32 }}>
        {filtrados.length === 0 && (
          <p style={{ fontSize: 13, color: "#5b6591" }}>
            {items.length === 0 ? "Todavía no hay registros." : "Ningún resultado para esa búsqueda."}
          </p>
        )}
        {filtrados.map((i) => (
          <div key={i.id}>{i.nodo}</div>
        ))}
      </div>
    </div>
  );
}
