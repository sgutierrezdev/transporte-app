"use client";

export default function BotonImprimir() {
  return (
    <button
      onClick={() => window.print()}
      style={{
        padding: "8px 14px",
        borderRadius: 8,
        border: "1px solid #d9deee",
        background: "#fff",
        color: "#1e2761",
        fontSize: 13,
        cursor: "pointer",
      }}
    >
      Imprimir
    </button>
  );
}
