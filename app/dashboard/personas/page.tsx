import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { crearPersona } from "@/lib/actions/personas";
import { ROLES, ESTADOS_PERSONA, NOMBRE_ROL, NOMBRE_ESTADO } from "@/lib/constants";
import FormularioColapsable from "@/components/FormularioColapsable";
import BuscadorLista from "@/components/BuscadorLista";

export default async function PersonasPage() {
  const session = await getServerSession(authOptions);
  const empresaId = (session!.user as any).empresaId as string;

  const personas = await prisma.persona.findMany({
    where: { empresaId },
    orderBy: { nombre: "asc" },
  });

  const items = personas.map((p) => ({
    id: p.id,
    texto: `${p.nombre} ${NOMBRE_ROL[p.rol]} ${p.carnet ?? ""} ${p.celular ?? ""}`,
    nodo: (
      <Link href={`/dashboard/personas/${p.id}`} style={{ textDecoration: "none", color: "inherit" }}>
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
            <p style={{ fontWeight: 500, margin: 0 }}>{p.nombre}</p>
            <p style={{ fontSize: 13, color: "#5b6591", margin: 0 }}>
              {NOMBRE_ROL[p.rol]} · {p.celular ?? "Sin celular"}
            </p>
          </div>
          <span style={{ fontSize: 12, color: "#5b6591" }}>{NOMBRE_ESTADO[p.estado]}</span>
        </div>
      </Link>
    ),
  }));

  return (
    <main style={{ maxWidth: 900, margin: "0 auto", padding: "2rem 1rem" }}>
      <h1 style={{ fontSize: 24, marginBottom: 4 }}>Socios, choferes y personal</h1>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 12,
          margin: "12px 0 4px",
        }}
      >
        <p style={{ fontSize: 13, color: "#5b6591", margin: 0, whiteSpace: "nowrap" }}>
          {personas.length} registrados
        </p>
        <FormularioColapsable etiquetaBoton="Nueva persona" titulo="Nueva persona">
          <form action={crearPersona} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
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
                  {ESTADOS_PERSONA.map((e) => (
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
              Registrar persona
            </button>
          </form>
        </FormularioColapsable>
      </div>

      <BuscadorLista items={items} placeholder="Buscar por nombre, carnet o rol..." />
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
