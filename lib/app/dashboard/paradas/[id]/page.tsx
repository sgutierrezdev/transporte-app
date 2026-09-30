import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { actualizarParada, eliminarParada } from "@/lib/actions/paradas";

export default async function EditarParadaPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  const empresaId = (session!.user as any).empresaId as string;

  const [parada, personas] = await Promise.all([
    prisma.parada.findFirst({ where: { id: params.id, empresaId } }),
    prisma.persona.findMany({ where: { empresaId }, orderBy: { nombre: "asc" } }),
  ]);
  if (!parada) notFound();

  const actualizar = actualizarParada.bind(null, parada.id);
  const eliminar = eliminarParada.bind(null, parada.id);

  return (
    <main style={{ maxWidth: 600, margin: "0 auto", padding: "2rem 1rem" }}>
      <h1 style={{ fontSize: 24, marginBottom: 20 }}>Editar parada</h1>

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
          <input name="nombre" defaultValue={parada.nombre} required style={estiloInput} />
        </Campo>
        <Campo label="Ubicación">
          <select name="ubicacion" defaultValue={parada.ubicacion} style={estiloInput}>
            <option value="Ciudad">Ciudad</option>
            <option value="Provincia">Provincia</option>
          </select>
        </Campo>
        <Campo label="Secretaria">
          <select name="secretariaId" defaultValue={parada.secretariaId ?? ""} style={estiloInput}>
            <option value="">Sin asignar</option>
            {personas.map((s) => (
              <option key={s.id} value={s.id}>
                {s.nombre}
              </option>
            ))}
          </select>
        </Campo>
        <button type="submit" style={estiloBotonPrimario}>
          Guardar cambios
        </button>
      </form>

      <form action={eliminar}>
        <button type="submit" style={estiloBotonPeligro}>
          Eliminar parada
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
