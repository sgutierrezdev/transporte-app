import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { asignarRotacion } from "@/lib/actions/rotacion";

function hoyISO() {
  return new Date().toISOString().slice(0, 10);
}

export default async function RotacionPage({
  searchParams,
}: {
  searchParams: { fecha?: string };
}) {
  const session = await getServerSession(authOptions);
  const empresaId = (session!.user as any).empresaId as string;
  const fechaTexto = searchParams.fecha || hoyISO();
  const fecha = new Date(fechaTexto);

  const [subgrupos, paradas, rotaciones] = await Promise.all([
    prisma.subgrupo.findMany({
      where: { grupo: { empresaId } },
      include: { grupo: true },
      orderBy: [{ grupo: { nombre: "asc" } }, { nombre: "asc" }],
    }),
    prisma.parada.findMany({ where: { empresaId }, orderBy: { nombre: "asc" } }),
    prisma.rotacionDiaria.findMany({
      where: { fecha, subgrupo: { grupo: { empresaId } } },
    }),
  ]);

  const paradaPorSubgrupo = new Map(rotaciones.map((r) => [r.subgrupoId, r.paradaId]));

  return (
    <main style={{ maxWidth: 800, margin: "0 auto", padding: "2rem 1rem" }}>
      <h1 style={{ fontSize: 24, marginBottom: 4 }}>Rotación diaria</h1>
      <p style={{ fontSize: 13, color: "#5b6591", marginBottom: 20 }}>
        A qué parada va cada subgrupo en la fecha elegida.
      </p>

      <form method="get" style={{ marginBottom: 20 }}>
        <label style={{ fontSize: 13, color: "#5b6591", marginRight: 8 }}>Fecha</label>
        <input
          type="date"
          name="fecha"
          defaultValue={fechaTexto}
          onChange={undefined}
          style={{ padding: "6px 10px", borderRadius: 8, border: "1px solid #d9deee" }}
        />
        <button
          type="submit"
          style={{
            marginLeft: 8,
            padding: "6px 12px",
            borderRadius: 8,
            border: "1px solid #d9deee",
            background: "#fff",
            cursor: "pointer",
          }}
        >
          Ver
        </button>
      </form>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {subgrupos.length === 0 && (
          <p style={{ fontSize: 13, color: "#5b6591" }}>
            Todavía no hay grupos con subgrupos registrados.
          </p>
        )}
        {subgrupos.map((s) => (
          <form
            key={s.id}
            action={asignarRotacion}
            style={{
              padding: "12px 16px",
              background: "#fff",
              border: "0.5px solid #d9deee",
              borderRadius: 12,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
            }}
          >
            <input type="hidden" name="subgrupoId" value={s.id} />
            <input type="hidden" name="fecha" value={fechaTexto} />
            <p style={{ margin: 0, fontWeight: 500, minWidth: 140 }}>
              Grupo {s.grupo.nombre} - {s.nombre}
            </p>
            <select
              name="paradaId"
              defaultValue={paradaPorSubgrupo.get(s.id) ?? ""}
              style={{ flex: 1, padding: "8px 10px", borderRadius: 8, border: "1px solid #d9deee" }}
            >
              <option value="">Sin asignar</option>
              {paradas.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nombre}
                </option>
              ))}
            </select>
            <button
              type="submit"
              style={{
                padding: "8px 14px",
                borderRadius: 8,
                border: "none",
                background: "#1e2761",
                color: "#fff",
                cursor: "pointer",
                fontSize: 13,
              }}
            >
              Guardar
            </button>
          </form>
        ))}
      </div>
    </main>
  );
}
