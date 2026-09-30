import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generarProgramacionDelDia } from "@/lib/actions/programacion";

function hoyISO() {
  return new Date().toISOString().slice(0, 10);
}

export default async function ProgramacionPage({
  searchParams,
}: {
  searchParams: { fecha?: string };
}) {
  const session = await getServerSession(authOptions);
  const empresaId = (session!.user as any).empresaId as string;
  const fechaTexto = searchParams.fecha || hoyISO();
  const fecha = new Date(fechaTexto);

  const programacion = await prisma.programacionDiaria.findMany({
    where: { fecha, movil: { empresaId } },
    include: {
      movil: true,
      grupo: true,
      jefe: true,
      chofer: true,
      parada: true,
    },
    orderBy: [{ grupo: { nombre: "asc" } }, { movil: { numeroInterno: "asc" } }],
  });

  return (
    <main style={{ maxWidth: 1000, margin: "0 auto", padding: "2rem 1rem" }}>
      <h1 style={{ fontSize: 24, marginBottom: 4 }}>Programación diaria</h1>
      <p style={{ fontSize: 13, color: "#5b6591", marginBottom: 20 }}>
        Registro inmutable: quién manejaba qué interno, en qué grupo/subgrupo, con qué jefe de
        línea y en qué parada, para la fecha elegida.
      </p>

      <div style={{ display: "flex", gap: 16, alignItems: "flex-end", flexWrap: "wrap", marginBottom: 24 }}>
        <form method="get">
          <label style={{ fontSize: 13, color: "#5b6591", display: "block", marginBottom: 4 }}>
            Ver fecha
          </label>
          <div style={{ display: "flex", gap: 8 }}>
            <input
              type="date"
              name="fecha"
              defaultValue={fechaTexto}
              style={{ padding: "6px 10px", borderRadius: 8, border: "1px solid #d9deee" }}
            />
            <button
              type="submit"
              style={{
                padding: "6px 12px",
                borderRadius: 8,
                border: "1px solid #d9deee",
                background: "#fff",
                cursor: "pointer",
              }}
            >
              Ver
            </button>
          </div>
        </form>

        <form action={generarProgramacionDelDia}>
          <input type="hidden" name="fecha" value={fechaTexto} />
          <button
            type="submit"
            style={{
              padding: "9px 16px",
              borderRadius: 8,
              border: "none",
              background: "#1e2761",
              color: "#fff",
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            Generar / actualizar programación de esta fecha
          </button>
        </form>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", background: "#fff" }}>
          <thead>
            <tr style={{ background: "#eef2fb", textAlign: "left" }}>
              {["Interno", "Grupo", "Chofer", "Jefe de línea", "Parada"].map((h) => (
                <th key={h} style={{ padding: "10px 12px", fontSize: 12, color: "#5b6591" }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {programacion.length === 0 && (
              <tr>
                <td colSpan={5} style={{ padding: 16, fontSize: 13, color: "#5b6591" }}>
                  Todavía no hay programación generada para esta fecha.
                </td>
              </tr>
            )}
            {programacion.map((p) => (
              <tr key={p.id} style={{ borderTop: "0.5px solid #d9deee" }}>
                <td style={{ padding: "10px 12px", fontSize: 13 }}>{p.movil.numeroInterno}</td>
                <td style={{ padding: "10px 12px", fontSize: 13 }}>Grupo {p.grupo.nombre}</td>
                <td style={{ padding: "10px 12px", fontSize: 13 }}>{p.chofer?.nombre ?? "—"}</td>
                <td style={{ padding: "10px 12px", fontSize: 13 }}>{p.jefe?.nombre ?? "—"}</td>
                <td style={{ padding: "10px 12px", fontSize: 13 }}>{p.parada?.nombre ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
