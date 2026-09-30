import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { actualizarPersona, eliminarPersona } from "@/lib/actions/personas";
import { ROLES, ESTADOS_PERSONA, NOMBRE_ROL, NOMBRE_ESTADO } from "@/lib/constants";

export default async function EditarPersonaPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  const empresaId = (session!.user as any).empresaId as string;

  const persona = await prisma.persona.findFirst({ where: { id: params.id, empresaId } });
  if (!persona) notFound();

  const actualizar = actualizarPersona.bind(null, persona.id);
  const eliminar = eliminarPersona.bind(null, persona.id);

  return (
    <main style={{ maxWidth: 600, margin: "0 auto", padding: "2rem 1rem" }}>
      <h1 style={{ fontSize: 24, marginBottom: 20 }}>Editar persona</h1>

      <form
        action={actualizar}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 12,
          background: "#fff",
          border: "0.5px solid #d9deee",
          borderRadius: 12,
          padding: "1.25rem",
          marginBottom: 16,
        }}
      >
        <Campo label="Nombre">
          <input name="nombre" defaultValue={persona.nombre} required style={estiloInput} />
        </Campo>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <Campo label="Carnet">
            <input name="carnet" defaultValue={persona.carnet ?? ""} style={estiloInput} />
          </Campo>
          <Campo label="Celular">
            <input name="celular" defaultValue={persona.celular ?? ""} style={estiloInput} />
          </Campo>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <Campo label="Correo (para login)">
            <input name="email" type="email" defaultValue={persona.email ?? ""} style={estiloInput} />
          </Campo>
          <Campo label="Nueva contraseña (opcional)">
            <input name="password" type="password" placeholder="Dejar vacío para no cambiar" style={estiloInput} />
          </Campo>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <Campo label="Rol">
            <select name="rol" defaultValue={persona.rol} style={estiloInput}>
              {ROLES.map((r) => (
                <option key={r} value={r}>
                  {NOMBRE_ROL[r]}
                </option>
              ))}
            </select>
          </Campo>
          <Campo label="Estado">
            <select name="estado" defaultValue={persona.estado} style={estiloInput}>
              {ESTADOS_PERSONA.map((e) => (
                <option key={e} value={e}>
                  {NOMBRE_ESTADO[e]}
                </option>
              ))}
            </select>
          </Campo>
        </div>
        <Campo label="Fecha de ingreso">
          <input
            name="fechaIngreso"
            type="date"
            defaultValue={persona.fechaIngreso ? persona.fechaIngreso.toISOString().slice(0, 10) : ""}
            style={estiloInput}
          />
        </Campo>
        <button type="submit" style={estiloBotonPrimario}>
          Guardar cambios
        </button>
      </form>

      <form action={eliminar}>
        <button type="submit" style={estiloBotonPeligro}>
          Eliminar persona
        </button>
      </form>
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

const estiloBotonPeligro: React.CSSProperties = {
  padding: "8px 14px",
  borderRadius: 8,
  border: "1px solid #e3b3b3",
  background: "#fff",
  color: "#a32d2d",
  cursor: "pointer",
  fontSize: 13,
};
