import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { asegurarCatalogos, TIPO_COBRO_MULTA } from "@/lib/catalogos";
import { crearGasto, eliminarGasto } from "@/lib/actions/gastos";
import { crearIngreso } from "@/lib/actions/ingresos";
import FormularioColapsable from "@/components/FormularioColapsable";
import { bs, numeroComprobante } from "@/lib/formato";

function inicioDeMes() {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth(), 1).toISOString().slice(0, 10);
}
function hoy() {
  return new Date().toISOString().slice(0, 10);
}

export default async function CajaPage({
  searchParams,
}: {
  searchParams: { parada?: string; desde?: string; hasta?: string };
}) {
  const session = await getServerSession(authOptions);
  const empresaId = (session!.user as any).empresaId as string;
  const rol = (session!.user as any).rol as string;
  const personaId = (session!.user as any).id as string;
  const puedeRegistrar = rol === "ADMIN" || rol === "SECRETARIA";

  // Deja creados los tipos por defecto (multas, gastos, ingresos) si faltan.
  await asegurarCatalogos(empresaId);

  const paradas = await prisma.parada.findMany({ where: { empresaId }, orderBy: { nombre: "asc" } });

  // La secretaria queda fija en SU parada (no se puede cambiar por la URL).
  let paradaId = "";
  if (rol === "SECRETARIA") {
    paradaId = paradas.find((p) => p.secretariaId === personaId)?.id ?? "";
    if (!paradaId) {
      return (
        <main style={{ maxWidth: 800, margin: "0 auto", padding: "2rem 1rem" }}>
          <h1 style={{ fontSize: 24 }}>Caja por parada</h1>
          <p style={{ fontSize: 13, color: "#a32d2d" }}>
            No tenés una parada asignada como secretaria — pedile a administración que te asigne una.
          </p>
        </main>
      );
    }
  } else {
    const pedida = searchParams.parada && paradas.find((p) => p.id === searchParams.parada)?.id;
    paradaId = pedida || paradas[0]?.id || "";
  }

  if (!paradaId) {
    return (
      <main style={{ maxWidth: 800, margin: "0 auto", padding: "2rem 1rem" }}>
        <h1 style={{ fontSize: 24 }}>Caja por parada</h1>
        <p style={{ fontSize: 13, color: "#5b6591" }}>Todavía no hay paradas registradas.</p>
      </main>
    );
  }

  const desdeStr = searchParams.desde || inicioDeMes();
  const hastaStr = searchParams.hasta || hoy();
  const desde = new Date(desdeStr);
  const hasta = new Date(hastaStr);
  const parada = paradas.find((p) => p.id === paradaId)!;

  const [
    tiposGasto,
    tiposIngreso,
    personas,
    multasPeriodo,
    multasHistoricas,
    ingresosPeriodo,
    ingresosHist,
    cobrosMultaHist,
    gastosPeriodo,
    gastosHist,
  ] = await Promise.all([
    prisma.tipoGasto.findMany({ where: { empresaId }, orderBy: { nombre: "asc" } }),
    prisma.tipoIngreso.findMany({ where: { empresaId }, orderBy: { nombre: "asc" } }),
    prisma.persona.findMany({ where: { empresaId }, orderBy: { nombre: "asc" }, select: { id: true, nombre: true } }),
    prisma.asistencia.findMany({
      where: {
        tipoInfraccionId: { not: null },
        programacionDiaria: { paradaId, fecha: { gte: desde, lte: hasta } },
      },
      include: { tipoInfraccion: true },
    }),
    prisma.asistencia.findMany({
      where: { tipoInfraccionId: { not: null }, programacionDiaria: { paradaId } },
      include: { tipoInfraccion: true },
    }),
    prisma.ingreso.findMany({
      where: { paradaId, empresaId, fecha: { gte: desde, lte: hasta } },
      include: { tipoIngreso: true, registradoPor: true },
      orderBy: [{ fecha: "desc" }, { numeroComprobante: "desc" }],
    }),
    prisma.ingreso.aggregate({ where: { paradaId, empresaId, anulado: false }, _sum: { monto: true } }),
    prisma.ingreso.aggregate({
      where: { paradaId, empresaId, anulado: false, tipoIngreso: { nombre: TIPO_COBRO_MULTA } },
      _sum: { monto: true },
    }),
    prisma.gasto.findMany({
      where: { paradaId, empresaId, fecha: { gte: desde, lte: hasta } },
      include: { tipoGasto: true, registradoPor: true },
      orderBy: { fecha: "desc" },
    }),
    prisma.gasto.aggregate({ where: { paradaId, empresaId }, _sum: { monto: true } }),
  ]);

  const sumaMultas = (lista: typeof multasPeriodo) =>
    lista.reduce((acc, a) => acc + Number(a.tipoInfraccion?.montoFijo ?? 0), 0);

  const multasAplicadasPeriodo = sumaMultas(multasPeriodo);
  const ingresosCobradosPeriodo = ingresosPeriodo
    .filter((i) => !i.anulado)
    .reduce((acc, i) => acc + Number(i.monto), 0);
  const gastosPeriodoTotal = gastosPeriodo.reduce((acc, g) => acc + Number(g.monto), 0);
  const saldoPeriodo = ingresosCobradosPeriodo - gastosPeriodoTotal;

  const ingresosAcumulados = Number(ingresosHist._sum.monto ?? 0);
  const gastosAcumulados = Number(gastosHist._sum.monto ?? 0);
  const saldoAcumulado = ingresosAcumulados - gastosAcumulados;
  const multasPorCobrar = Math.max(0, sumaMultas(multasHistoricas) - Number(cobrosMultaHist._sum.monto ?? 0));

  return (
    <main style={{ maxWidth: 950, margin: "0 auto", padding: "2rem 1rem" }}>
      <h1 style={{ fontSize: 24, marginBottom: 4 }}>Caja de {parada.nombre}</h1>
      <p style={{ fontSize: 13, color: "#5b6591", marginBottom: 20 }}>
        El dinero que entra (con comprobante) menos los gastos operativos de la parada. Las multas
        aplicadas por asistencia se muestran aparte hasta que se cobran.
      </p>

      <form
        method="get"
        style={{
          display: "flex",
          gap: 12,
          flexWrap: "wrap",
          alignItems: "flex-end",
          background: "#fff",
          border: "0.5px solid #d9deee",
          borderRadius: 12,
          padding: "1rem",
          marginBottom: 20,
        }}
      >
        {rol !== "SECRETARIA" && (
          <Campo label="Parada">
            <select name="parada" defaultValue={paradaId} style={estiloInput}>
              {paradas.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nombre}
                </option>
              ))}
            </select>
          </Campo>
        )}
        <Campo label="Desde">
          <input type="date" name="desde" defaultValue={desdeStr} style={estiloInput} />
        </Campo>
        <Campo label="Hasta">
          <input type="date" name="hasta" defaultValue={hastaStr} style={estiloInput} />
        </Campo>
        <button type="submit" style={estiloBotonPrimario}>
          Aplicar
        </button>
      </form>

      <p style={etiquetaSeccion}>Período seleccionado</p>
      <div style={gridMetricas}>
        <Metrica label="Multas aplicadas (por asistencia)" valor={bs(multasAplicadasPeriodo)} color="#5b6591" />
        <Metrica label="Ingresos cobrados" valor={bs(ingresosCobradosPeriodo)} color="#1e7e34" />
        <Metrica label="Gastos" valor={bs(gastosPeriodoTotal)} color="#a32d2d" />
        <Metrica label="Saldo de caja" valor={bs(saldoPeriodo)} color={saldoPeriodo >= 0 ? "#1e7e34" : "#a32d2d"} />
      </div>

      <p style={etiquetaSeccion}>Acumulado histórico de la parada</p>
      <div style={{ ...gridMetricas, marginBottom: 28 }}>
        <Metrica label="Ingresos cobrados" valor={bs(ingresosAcumulados)} color="#5b6591" />
        <Metrica label="Gastos" valor={bs(gastosAcumulados)} color="#5b6591" />
        <Metrica label="Saldo de caja" valor={bs(saldoAcumulado)} color={saldoAcumulado >= 0 ? "#1e7e34" : "#a32d2d"} />
        <Metrica label="Multas por cobrar (estimado)" valor={bs(multasPorCobrar)} color="#8a6d1d" />
      </div>

      {/* ---------------- INGRESOS ---------------- */}
      <div style={cabeceraSeccion}>
        <p style={{ fontSize: 14, fontWeight: 500, margin: 0 }}>Ingresos y comprobantes</p>
        {puedeRegistrar && (
          <FormularioColapsable etiquetaBoton="Nuevo ingreso" titulo="Nuevo ingreso (emite comprobante)">
            <form action={crearIngreso} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <input type="hidden" name="paradaId" value={paradaId} />
              <Campo label="Concepto del ingreso">
                <select name="tipoIngresoId" required style={estiloInput}>
                  {tiposIngreso.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.nombre}
                    </option>
                  ))}
                </select>
              </Campo>
              <Campo label="Persona que entrega el dinero (si está registrada)">
                <select name="personaId" defaultValue="" style={estiloInput}>
                  <option value="">— Otra persona: escribir el nombre abajo —</option>
                  {personas.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.nombre}
                    </option>
                  ))}
                </select>
              </Campo>
              <Campo label="Recibido de (solo si no elegiste una persona)">
                <input name="recibidoDe" style={estiloInput} placeholder="Nombre de quien entrega" />
              </Campo>
              <Campo label="Detalle (opcional)">
                <input name="concepto" style={estiloInput} placeholder="Ej. multa por tardanza del 12/09" />
              </Campo>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <Campo label="Monto (Bs)">
                  <input name="monto" type="number" step="0.01" min="0.01" required style={estiloInput} />
                </Campo>
                <Campo label="Fecha">
                  <input name="fecha" type="date" defaultValue={hoy()} required style={estiloInput} />
                </Campo>
              </div>
              <button type="submit" style={estiloBotonPrimario}>
                Registrar ingreso y generar comprobante
              </button>
            </form>
          </FormularioColapsable>
        )}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 32 }}>
        {ingresosPeriodo.length === 0 && (
          <p style={{ fontSize: 13, color: "#5b6591" }}>No hay ingresos registrados en este período.</p>
        )}
        {ingresosPeriodo.map((i) => (
          <div key={i.id} style={{ ...filaLista, opacity: i.anulado ? 0.6 : 1 }}>
            <div>
              <p style={{ fontWeight: 500, margin: 0, textDecoration: i.anulado ? "line-through" : "none" }}>
                N° {numeroComprobante(i.numeroComprobante)} · {i.tipoIngreso.nombre} · {bs(Number(i.monto))}
                {i.anulado && (
                  <span style={{ ...insignia, background: "#fbe7e7", color: "#a32d2d", marginLeft: 8 }}>ANULADO</span>
                )}
              </p>
              <p style={{ fontSize: 13, color: "#5b6591", margin: 0 }}>
                {new Date(i.fecha).toLocaleDateString("es-BO", { timeZone: "UTC" })} · De: {i.recibidoDe ?? "—"}
                {i.concepto ? ` · ${i.concepto}` : ""} · Registró {i.registradoPor?.nombre ?? "—"}
              </p>
            </div>
            <Link href={`/dashboard/caja/comprobante/${i.id}`} style={enlaceComprobante}>
              Ver comprobante
            </Link>
          </div>
        ))}
      </div>

      {/* ---------------- GASTOS ---------------- */}
      <div style={cabeceraSeccion}>
        <p style={{ fontSize: 14, fontWeight: 500, margin: 0 }}>Gastos de {parada.nombre} en el período</p>
        {puedeRegistrar && (
          <FormularioColapsable etiquetaBoton="Nuevo gasto" titulo="Nuevo gasto">
            <form action={crearGasto} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <input type="hidden" name="paradaId" value={paradaId} />
              <Campo label="Tipo de gasto">
                <select name="tipoGastoId" required style={estiloInput}>
                  {tiposGasto.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.nombre}
                    </option>
                  ))}
                </select>
              </Campo>
              <Campo label="Descripción (opcional)">
                <input name="descripcion" style={estiloInput} />
              </Campo>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <Campo label="Monto (Bs)">
                  <input name="monto" type="number" step="0.01" min="0.01" required style={estiloInput} />
                </Campo>
                <Campo label="Fecha">
                  <input name="fecha" type="date" defaultValue={hoy()} required style={estiloInput} />
                </Campo>
              </div>
              <button type="submit" style={estiloBotonPrimario}>
                Registrar gasto
              </button>
            </form>
          </FormularioColapsable>
        )}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {gastosPeriodo.length === 0 && (
          <p style={{ fontSize: 13, color: "#5b6591" }}>No hay gastos registrados en este período.</p>
        )}
        {gastosPeriodo.map((g) => (
          <div key={g.id} style={filaLista}>
            <div>
              <p style={{ fontWeight: 500, margin: 0 }}>
                {g.tipoGasto.nombre} · {bs(Number(g.monto))}
              </p>
              <p style={{ fontSize: 13, color: "#5b6591", margin: 0 }}>
                {new Date(g.fecha).toLocaleDateString("es-BO", { timeZone: "UTC" })}
                {g.descripcion ? ` · ${g.descripcion}` : ""} · Cargado por {g.registradoPor?.nombre ?? "—"}
              </p>
            </div>
            {puedeRegistrar && (
              <form action={eliminarGasto.bind(null, g.id)}>
                <button type="submit" style={estiloBotonPeligro}>
                  Eliminar
                </button>
              </form>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}

function Campo({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label style={{ display: "block" }}>
      <span style={{ fontSize: 12, color: "#5b6591", display: "block", marginBottom: 4 }}>{label}</span>
      {children}
    </label>
  );
}

function Metrica({ label, valor, color }: { label: string; valor: string; color: string }) {
  return (
    <div style={{ background: "#eef2fb", borderRadius: 8, padding: "1rem" }}>
      <p style={{ fontSize: 12, color: "#5b6591", margin: "0 0 4px" }}>{label}</p>
      <p style={{ fontSize: 20, fontWeight: 500, margin: 0, color }}>{valor}</p>
    </div>
  );
}

const etiquetaSeccion: React.CSSProperties = { fontSize: 12, color: "#5b6591", margin: "0 0 8px" };

const gridMetricas: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(170px,1fr))",
  gap: 12,
  marginBottom: 20,
};

const cabeceraSeccion: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: 12,
  flexWrap: "wrap",
  marginBottom: 8,
};

const filaLista: React.CSSProperties = {
  padding: "12px 16px",
  background: "#fff",
  border: "0.5px solid #d9deee",
  borderRadius: 12,
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: 12,
  flexWrap: "wrap",
};

const insignia: React.CSSProperties = { fontSize: 11, padding: "2px 8px", borderRadius: 999 };

const enlaceComprobante: React.CSSProperties = {
  fontSize: 13,
  color: "#1e2761",
  border: "1px solid #1e2761",
  borderRadius: 8,
  padding: "6px 12px",
  textDecoration: "none",
  whiteSpace: "nowrap",
};

const estiloInput: React.CSSProperties = {
  padding: "8px 10px",
  borderRadius: 8,
  border: "1px solid #d9deee",
  width: "100%",
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

const estiloBotonPeligro: React.CSSProperties = {
  padding: "6px 12px",
  borderRadius: 8,
  border: "1px solid #e3b3b3",
  background: "#fff",
  color: "#a32d2d",
  cursor: "pointer",
  fontSize: 12,
};
