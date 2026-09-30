"use client";

import { useState } from "react";

type Resumen = {
  personas: { creados: number; errores: string[] };
  grupos: { creados: number; errores: string[] };
  moviles: { creados: number; errores: string[] };
  paradas: { creados: number; errores: string[] };
};

const ETIQUETAS: Record<keyof Resumen, string> = {
  personas: "Personas",
  grupos: "Grupos",
  moviles: "Móviles",
  paradas: "Paradas",
};

export default function ImportarPage() {
  const [archivo, setArchivo] = useState<File | null>(null);
  const [cargando, setCargando] = useState(false);
  const [resumen, setResumen] = useState<Resumen | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!archivo) {
      setError("Elegí un archivo .xlsx primero.");
      return;
    }
    setError(null);
    setResumen(null);
    setCargando(true);

    const formData = new FormData();
    formData.append("archivo", archivo);

    try {
      const res = await fetch("/api/importar", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Ocurrió un error al importar.");
      } else {
        setResumen(data);
      }
    } catch {
      setError("No se pudo conectar con el servidor.");
    } finally {
      setCargando(false);
    }
  }

  return (
    <main style={{ maxWidth: 700, margin: "0 auto", padding: "2rem 1rem" }}>
      <h1 style={{ fontSize: 24, marginBottom: 4 }}>Importar desde Excel</h1>
      <p style={{ fontSize: 13, color: "#5b6591", marginBottom: 20 }}>
        Cargá la plantilla completa (hojas Personas, Grupos, Moviles y Paradas) y el sistema crea
        todo de una sola vez, respetando las relaciones entre pestañas.
      </p>

      <div
        style={{
          background: "#eef2fb",
          border: "1px solid #cadcfc",
          borderRadius: 12,
          padding: "1rem",
          marginBottom: 20,
          fontSize: 13,
          color: "#1e2761",
        }}
      >
        <p style={{ margin: "0 0 6px", fontWeight: 500 }}>Antes de subir:</p>
        <ul style={{ margin: 0, paddingLeft: 18 }}>
          <li>Orden sugerido: Personas → Grupos → Moviles → Paradas (cada hoja referencia nombres de la anterior).</li>
          <li>Cada fila de la hoja Grupos crea automáticamente los subgrupos A y B de ese grupo.</li>
          <li>En la hoja Moviles, las columnas "Grupo" y "Subgrupo" juntas ubican el subgrupo exacto (ej. Grupo "1" + Subgrupo "A").</li>
          <li>En "Jefe de linea", "Socio dueño", "Chofer titular" y "Secretaria", escribí el nombre exactamente igual a como está en la hoja Personas.</li>
          <li>Podés importar varias veces: si algo falla, corregís esa fila y volvés a subir solo lo que faltó.</li>
        </ul>
      </div>

      <form
        onSubmit={handleSubmit}
        style={{
          background: "#fff",
          border: "0.5px solid #d9deee",
          borderRadius: 12,
          padding: "1.25rem",
          marginBottom: 24,
        }}
      >
        <input
          type="file"
          accept=".xlsx"
          onChange={(e) => setArchivo(e.target.files?.[0] ?? null)}
          style={{ marginBottom: 12, display: "block" }}
        />
        {error && <p style={{ color: "#a32d2d", fontSize: 13, marginBottom: 12 }}>{error}</p>}
        <button
          type="submit"
          disabled={cargando}
          style={{
            padding: "10px 16px",
            borderRadius: 8,
            border: "none",
            background: "#1e2761",
            color: "#fff",
            fontWeight: 500,
            cursor: "pointer",
          }}
        >
          {cargando ? "Importando..." : "Importar archivo"}
        </button>
      </form>

      {resumen && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {(Object.keys(resumen) as (keyof Resumen)[]).map((clave) => {
            const bloque = resumen[clave];
            return (
              <div
                key={clave}
                style={{
                  background: "#fff",
                  border: "0.5px solid #d9deee",
                  borderRadius: 12,
                  padding: "1rem",
                }}
              >
                <p style={{ margin: "0 0 4px", fontWeight: 500 }}>
                  {ETIQUETAS[clave]}: {bloque.creados} creados
                </p>
                {bloque.errores.length > 0 && (
                  <ul style={{ margin: "8px 0 0", paddingLeft: 18, fontSize: 13, color: "#a32d2d" }}>
                    {bloque.errores.map((err, idx) => (
                      <li key={idx}>{err}</li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
