import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { crearSocio } from "@/lib/actions/socios";
import { ROLES, ESTADOS_SOCIO, NOMBRE_ROL, NOMBRE_ESTADO } from "@/lib/constants";

export default async function SociosPage() {
  const session = await getServerSession(authOptions);
  const empresaId = (session!.user as any).empresaId as string;

  const socios = await prisma.socio.findMany({
    where: { empresaId },
    orderBy: { nombre: "asc" },
  });

  return (
    <main style={{ maxWidth: 900, margin: "0 auto", padding: "2rem 1rem" }}>
      <h1 style={{ fontSize: 24, marginBottom: 4 }}>Socios / choferes</h1>
      <p style={{ fontSize: 13, color: "#5b6591", marginBottom: 20 }}>
        {socios.length} registrados
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 32 }}>
        {socios.length === 0 && (
          <p style={{ fontSize: 13, color: "#5b6591" }}>Todavía no hay socios registrados.</p>
        )}
        {socios.map((s) => (
          <Link
            key={s.id}
            href={`/dashboard/socios/${s.id}`}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <div
              style={{
                padding: "12px 16px",
                background: "#fff",
                border: "0.5px solid #d9deee",
                borderRadius: 12,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <p style={{ fontWeight: 500, margin: 0 }}>{s.nombre}</p>
                <p style={{ fontSize: 13, color: "#5b6591", margin: 0 }}>
                  {NOMBRE_ROL[s.rol]} · {s.celular ?? "Sin celular"}
                </p>
              </div>
              <span style={{ fontSize: 12, color: "#5b6591" }}>{NOMBRE_ESTADO[s.estado]}</span>
            </div>
          </Link>
        ))}
      </div>

      <div
        style={{
          background: "#fff",
          border: "0.5px solid #d9deee",
          borderRadius: 12,
          padding: "1.25rem",
        }}
      >
        <p style={{ fontWeight: 500, marginTop: 0, marginBottom: 16 }}>Nuevo socio</p>
        <form action={crearSocio} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <Campo label="Nombre">
            <input name="nombre" required style={estiloInput} />
          </Campo>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Campo label="Carnet">
              <input name="carnet" style={estiloInput} />
            </Campo>
            <Campo label="Celular">
              <input name="celular" style={estiloInput} />
            </Campo>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Campo label="Correo (para login)">
              <input name="email" type="email" style={estiloInput} />
            </Campo>
            <Campo label="Contraseña">
              <input name="password" type="password" style={estiloInput} />
            </Campo>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Campo label="Rol">
              <select name="rol" defaultValue="SOCIO" style={estiloInput}>
                {ROLES.map((r) => (
                  <option key={r} value={r}>
                    {NOMBRE_ROL[r]}
                  </option>
                ))}
              </select>
            </Campo>
            <Campo label="Estado">
              <select name="estado" defaultValue="ACTIVO" style={estiloInput}>
                {ESTADOS_SOCIO.map((e) => (
                  <option key={e} value={e}>
                    {NOMBRE_ESTADO[e]}
                  </option>
                ))}
              </select>
            </Campo>
          </div>
          <Campo label="Fecha de ingreso">
            <input name="fechaIngreso" type="date" style={estiloInput} />
          </Campo>
          <button type="submit" style={estiloBotonPrimario}>
            Registrar socio
          </button>
        </form>
      </div>
    </main>
  );
}

function Campo({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label style={{ display: "block" }}>
      <span style={{ fontSize: 13, color: "#5b6591", display: "block", marginBottom: 4 }}>
        {label}
      </span>
      {children}
    </label>
  );
}

const estiloInput: React.CSSProperties = {
  width: "100%",
  padding: "8px 10px",
  borderRadius: 8,
  border: "1px solid #d9deee",
};

const estiloBotonPrimario: React.CSSProperties = {
  padding: "10px",
  borderRadius: 8,
  border: "none",
  background: "#1e2761",
  color: "#fff",
  fontWeight: 500,
  cursor: "pointer",
};
