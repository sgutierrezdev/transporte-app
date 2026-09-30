"use client";

import { signOut } from "next-auth/react";

export default function BotonCerrarSesion({ claro = false }: { claro?: boolean }) {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/login" })}
      style={{
        background: "transparent",
        border: "none",
        color: claro ? "#cadcfc" : "#5b6591",
        fontSize: 13,
        cursor: "pointer",
        padding: 0,
      }}
    >
      Cerrar sesión
    </button>
  );
}
