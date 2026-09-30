import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { crearMovil } from "@/lib/actions/moviles";
import FormularioColapsable from "@/components/FormularioColapsable";
import BuscadorLista from "@/components/BuscadorLista";

export default async function MovilesPage() {
  const session = await getServerSession(authOptions);
  const empresaId = (session!.user as any).empresaId as string;

  const [moviles, subgrupos, personas] = await Promise.all([
    prisma.movil.findMany({
      where: { empresaId },
      include: { subgrupo: { include: { grupo: true } }, socio: true, choferTitular: true },
      orderBy: { numeroInterno: "asc" },
    }),
    prisma.subgrupo.findMany({
      where: { grupo: { empresaId } },
      include: { grupo: true },
      orderBy: [{ grupo: { nombre: "asc" } }, { nombre: "asc" }],
    }),
    prisma.persona.findMany({ where: { empresaId }, orderBy: { nombre: "asc" } }),
  ]);

  const items = moviles.map((m) => ({
    id: m.id,
    texto: `${m.numeroInterno} ${m.placa ?? ""} ${m.socio?.nombre ?? ""} ${m.choferTitular?.nombre ?? ""}`,
    nodo: (
      <Link href={`/dashboard/moviles/${m.id}`} style={{ textDecoration: "none", color: "inherit" }}>
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
            <p style={{ fontWeight: 500, margin: 0 }}>Interno {m.numeroInterno}</p>
            <p style={{ fontSize: 13, color: "#5b6591", margin: 0 }}>
              {m.placa ?? "Sin placa"} ·{" "}
              {m.subgrupo ? `Grupo ${m.subgrupo.grupo.nombre}-${m.subgrupo.nombre}` : "sin subgrupo"}{" "}
              · Dueño: {m.socio?.nombre ?? "sin asignar"} · Titular:{" "}
              {m.choferTitular?.nombre ?? "sin asignar"}
            </p>
          </div>
        </div>
      </Link>
    ),
  }));

  return (
    <main style={{ maxWidth: 900, margin: "0 auto", padding: "2rem 1rem" }}>
      <h1 style={{ fontSize: 24, marginBottom: 4 }}>Móviles</h1>

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
          {moviles.length} registrados
        </p>
        <FormularioColapsable etiquetaBoton="Nuevo móvil" titulo="Nuevo móvil">
          <form action={crearMovil} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <Campo label="Número de interno">
                <input name="numeroInterno" required style={estiloInput} />
              </Campo>
              <Campo label="Placa">
                <input name="placa" style={estiloInput} />
              </Campo>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <Campo label="Capacidad">
                <input name="capacidad" type="number" style={estiloInput} />
              </Campo>
              <Campo label="Subgrupo">
                <select name="subgrupoId" defaultValue="" style={estiloInput}>
                  <option value="">Sin asignar</option>
                  {subgrupos.map((s) => (
                    <option key={s.id} value={s.id}>
                      Grupo {s.grupo.nombre} - {s.nombre}
                    </option>
                  ))}
                </select>
              </Campo>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <Campo label="Socio dueño">
                <select name="socioId" defaultValue="" style={estiloInput}>
                  <option value="">Sin asignar</option>
                  {personas.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.nombre}
                    </option>
                  ))}
                </select>
              </Campo>
              <Campo label="Chofer titular">
                <select name="choferTitularId" defaultValue="" style={estiloInput}>
                  <option value="">Sin asignar</option>
                  {personas.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.nombre}
                    </option>
                  ))}
                </select>
              </Campo>
            </div>
            <button type="submit" style={estiloBotonPrimario}>
              Registrar móvil
            </button>
          </form>
        </FormularioColapsable>
      </div>

      <BuscadorLista items={items} placeholder="Buscar por interno, placa, socio o chofer..." />
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
