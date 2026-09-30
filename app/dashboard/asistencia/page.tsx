import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { registrarAsistencia } from "@/lib/actions/asistencia";

function hoy() {
  return new Date().toISOString().slice(0, 10);
}

const ESTADO_INFO: Record<string, { label: string; bg: string; fg: string }> = {
  A_TIEMPO: { label: "A tiempo", bg: "#e6f4ea", fg: "#1e7e34" },
  TARDANZA: { label: "Tardanza", bg: "#fff6d9", fg: "#8a6d1d" },
  AUSENTE: { label: "Ausente", bg: "#fbe7e7", fg: "#a32d2d" },
  ABANDONO: { label: "Abandono", bg: "#f3e3fb", fg: "#6b2da3" },
};

export default async function AsistenciaPage({
  searchParams,
}: {
  searchParams: { fecha?: string; parada?: string };
}) {
  const session = await getServerSession(authOptions);
  const empresaId = (session!.user as any).empresaId as string;
  const personaId = (session!.user as any).id as string;
  const rol = (session!.user as any).rol as string;
  const puedeMarcar = rol === "ADMIN" || rol === "SECRETARIA";
  const fechaStr = searchParams.fecha || hoy();
  const fecha = new Date(fechaStr);

  // La secretaria solo ve su parada; el resto puede filtrar por parada.
  let miParadaId: string | null = null;
  let miParadaNombre: string | null = null;
  if (rol === "SECRETARIA") {
    const miParada = await prisma.parada.findFirst({ where: { secretariaId: personaId, empresaId } });
    miParadaId = miParada?.id ?? null;
    miParadaNombre = miParada?.nombre ?? null;
  }
  const paradas =
    rol === "SECRETARIA"
      ? []
      : await prisma.parada.findMany({ where: { empresaId }, orderBy: { nombre: "asc" } });
  const paradaFiltro = rol === "SECRETARIA" ? "" : searchParams.parada || "";

  const programacion = await prisma.programacionDiaria.findMany({
    where: {
      fecha,
      movil: { empresaId },
      ...(rol === "SECRETARIA"
        ? { paradaId: miParadaId ?? "__ninguna__" }
        : paradaFiltro
        ? { paradaId: paradaFiltro }
        : {}),
    },
    include: {
      movil: true,
      chofer: true,
      parada: true,
      grupo: true,
      asistencia: { include: { tipoInfraccion: true } },
    },
    orderBy: [{ grupo: { nombre: "asc" } }, { movil: { numeroInterno: "asc" } }],
  });

  const totalMultas = programacion.reduce((acc, p) => {
    const monto = p.asistencia?.tipoInfraccion?.montoFijo;
    return acc + (monto ? Number(monto) : 0);
  }, 0);
  const sinRegistrar = programacion.filter((p) => !p.asistencia).length;
  const tardanzas = programacion.filter((p) => p.asistencia?.estado === "TARDANZA").length;
  const ausencias = programacion.filter((p) => p.asistencia?.estado === "AUSENTE").length;
  const abandonos = programacion.filter((p) => p.asistencia?.estado === "ABANDONO").length;

  return (
    <main style={{ maxWidth: 1000, margin: "0 auto", padding: "2rem 1rem" }}>
      <h1 style={{ fontSize: 24, marginBottom: 4 }}>Asistencia diaria</h1>
      <p style={{ fontSize: 13, color: "#5b6591", marginBottom: 20 }}>
        Marcá la llegada de cada chofer sobre la programación de ese día. Las tardanzas,
        ausencias y abandonos generan la multa automáticamente.
        {rol === "SECRETARIA" && miParadaNombre && (
          <strong> Mostrando solo la parada {miParadaNombre}.</strong>
        )}
        {rol === "SECRETARIA" && miParadaId === null && (
          <span style={{ color: "#a32d2d" }}> No tenés una parada asignada como secretaria — pedile a administración que te asigne una.</span>
        )}
      </p>

      <form method="get" style={{ display: "flex", gap: 12, alignItems: "flex-end", marginBottom: 20 }}>
        <label style={{ display: "block" }}>
          <span style={{ fontSize: 12, color: "#5b6591", display: "block", marginBottom: 4 }}>Fecha</span>
          <input type="date" name="fecha" defaultValue={fechaStr} style={estiloInput} />
        </label>
        {rol !== "SECRETARIA" && (
          <label style={{ display: "block" }}>
            <span style={{ fontSize: 12, color: "#5b6591", display: "block", marginBottom: 4 }}>Parada</span>
            <select name="parada" defaultValue={paradaFiltro} style={estiloInput}>
              <option value="">Todas las paradas</option>
              {paradas.map((pa) => (
                <option key={pa.id} value={pa.id}>
                  {pa.nombre}
                </option>
              ))}
            </select>
          </label>
        )}
        <button type="submit" style={estiloBotonPrimario}>
          Ver día
        </button>
      </form>

      {programacion.length === 0 ? (
        <p style={{ fontSize: 13, color: "#5b6591" }}>
          No hay programación generada para esta fecha. Andá a "Programación diaria" y generala
          primero.
        </p>
      ) : (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px,1fr))", gap: 12, marginBottom: 24 }}>
            <Metrica label="Multas del día" valor={`Bs ${totalMultas.toFixed(2)}`} />
            <Metrica label="Sin registrar" valor={sinRegistrar} />
            <Metrica label="Tardanzas" valor={tardanzas} />
            <Metrica label="Ausencias" valor={ausencias} />
            <Metrica label="Abandonos" valor={abandonos} />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {programacion.map((p) => {
              const estadoActual = p.asistencia?.estado;
              const monto = p.asistencia?.tipoInfraccion?.montoFijo;
              return (
                <div
                  key={p.id}
                  style={{
                    padding: "12px 16px",
                    background: "#fff",
                    border: "0.5px solid #d9deee",
                    borderRadius: 12,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: 8,
                  }}
                >
                  <div>
                    <p style={{ fontWeight: 500, margin: 0 }}>
                      Interno {p.movil.numeroInterno} · {p.chofer?.nombre ?? "Sin chofer asignado"}
                    </p>
                    <p style={{ fontSize: 13, color: "#5b6591", margin: 0 }}>
                      Grupo {p.grupo?.nombre ?? "-"} · {p.parada?.nombre ?? "Sin parada"}
                      {monto ? ` · Multa: Bs ${Number(monto).toFixed(2)}` : ""}
                    </p>
                  </div>

                  {p.choferId && !puedeMarcar ? (
                    estadoActual ? (
                      <span
                        style={{
                          fontSize: 12,
                          padding: "3px 10px",
                          borderRadius: 999,
                          background: ESTADO_INFO[estadoActual].bg,
                          color: ESTADO_INFO[estadoActual].fg,
                        }}
                      >
                        {ESTADO_INFO[estadoActual].label}
                      </span>
                    ) : (
                      <span style={{ fontSize: 12, color: "#5b6591" }}>Sin registrar</span>
                    )
                  ) : p.choferId ? (
                    <form
                      action={registrarAsistencia.bind(null, p.id)}
                      style={{ display: "flex", gap: 6, alignItems: "center" }}
                    >
                      {estadoActual && (
                        <span
                          style={{
                            fontSize: 12,
                            padding: "3px 10px",
                            borderRadius: 999,
                            marginRight: 4,
                            background: ESTADO_INFO[estadoActual].bg,
                            color: ESTADO_INFO[estadoActual].fg,
                          }}
                        >
                          {ESTADO_INFO[estadoActual].label}
                        </span>
                      )}
                      <button name="estado" value="A_TIEMPO" style={estiloBotonEstado("#e6f4ea", "#1e7e34")}>
                        A tiempo
                      </button>
                      <button name="estado" value="TARDANZA" style={estiloBotonEstado("#fff6d9", "#8a6d1d")}>
                        Tardanza
                      </button>
                      <button name="estado" value="AUSENTE" style={estiloBotonEstado("#fbe7e7", "#a32d2d")}>
                        Ausente
                      </button>
                      <button name="estado" value="ABANDONO" style={estiloBotonEstado("#f3e3fb", "#6b2da3")}>
                        Abandono
                      </button>
                    </form>
                  ) : (
                    <span style={{ fontSize: 12, color: "#a32d2d" }}>Sin chofer ese día</span>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}
    </main>
  );
}

function Metrica({ label, valor }: { label: string; valor: string | number }) {
  return (
    <div style={{ background: "#eef2fb", borderRadius: 8, padding: "1rem" }}>
      <p style={{ fontSize: 12, color: "#5b6591", margin: "0 0 4px" }}>{label}</p>
      <p style={{ fontSize: 22, fontWeight: 500, margin: 0 }}>{valor}</p>
    </div>
  );
}

function estiloBotonEstado(bg: string, fg: string): React.CSSProperties {
  return {
    padding: "6px 10px",
    borderRadius: 8,
    border: "none",
    background: bg,
    color: fg,
    fontSize: 12,
    cursor: "pointer",
    fontWeight: 500,
  };
}

const estiloInput: React.CSSProperties = {
  padding: "8px 10px",
  borderRadius: 8,
  border: "1px solid #d9deee",
};

const estiloBotonPrimario: React.CSSProperties = {
  padding: "9px 16px",
  borderRadius: 8,
  border: "none",
  background: "#1e2761",
  color: "#fff",
  fontWeight: 500,
  fontSize: 13,
  cursor: "pointer",
};
