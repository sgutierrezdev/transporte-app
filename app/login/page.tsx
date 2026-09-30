"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [cargando, setCargando] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError("Ingresá tu correo y contraseña.");
      return;
    }

    setCargando(true);
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    setCargando(false);

    if (res?.error) {
      setError("Correo o contraseña incorrectos.");
      return;
    }

    router.push("/dashboard");
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          background: "#fff",
          padding: "2rem",
          borderRadius: 12,
          border: "0.5px solid #d9deee",
          width: 340,
        }}
      >
        <h1 style={{ fontSize: 20, marginBottom: 4 }}>Iniciar sesión</h1>
        <p style={{ fontSize: 13, color: "#5b6591", marginBottom: 20 }}>
          Sistema de gestión de transporte
        </p>

        <label style={{ fontSize: 13, display: "block", marginBottom: 4 }}>
          Correo
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="nombre@empresa.com"
          style={{
            width: "100%",
            padding: "8px 10px",
            marginBottom: 12,
            borderRadius: 8,
            border: "1px solid #d9deee",
          }}
        />

        <label style={{ fontSize: 13, display: "block", marginBottom: 4 }}>
          Contraseña
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          style={{
            width: "100%",
            padding: "8px 10px",
            marginBottom: 12,
            borderRadius: 8,
            border: "1px solid #d9deee",
          }}
        />

        {error && (
          <p style={{ color: "#a32d2d", fontSize: 13, marginBottom: 12 }}>
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={cargando}
          style={{
            width: "100%",
            padding: "10px",
            borderRadius: 8,
            border: "none",
            background: "#1e2761",
            color: "#fff",
            fontWeight: 500,
            cursor: "pointer",
          }}
        >
          {cargando ? "Ingresando..." : "Ingresar"}
        </button>
      </form>
    </div>
  );
}
