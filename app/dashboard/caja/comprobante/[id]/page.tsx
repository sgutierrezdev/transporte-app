import Link from "next/link";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { anularIngreso } from "@/lib/actions/ingresos";
import { bs, montoEnLetras, numeroComprobante } from "@/lib/formato";
import BotonImprimir from "@/components/BotonImprimir";

export default async function ComprobantePage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  const empresaId = (session!.user as any).empresaId as string;
  const rol = (session!.user as any).rol as string;
  const personaId = (session!.user as any).id as string;

  const ingreso = await prisma.ingreso.findFirst({
    where: { id: params.id, empresaId },
    include: {
      empresa: true,
      parada: true,
      tipoIngreso: true,
      registradoPor: true,
    },
  });
  if (!ingreso) notFound();

  // Administración ve todos; la secretaria solo los de su parada; el resto no accede.
  const autorizado =
    rol === "ADMIN" || (rol === "SECRETARIA" && ingreso.parada.secretariaId === personaId);
  if (!autorizado) {
    return (
      <main style={{ maxWidth: 700, margin: "0 auto", padding: "2rem 1rem" }}>
        <p style={{ color: "#a32d2d", fontSize: 14 }}>No tenés permiso para ver este comprobante.</p>
      </main>
    );
  }

  const monto = Number(ingreso.monto);
  const anular = anularIngreso.bind(null, ingreso.id);

  return (
    <main style={{ maxWidth: 700, margin: "0 auto", padding: "2rem 1rem" }}>
      <div className="no-imprimir" style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
        <Link
          href={`/dashboard/caja?parada=${ingreso.paradaId}`}
          style={{ fontSize: 13, color: "#5b6591", textDecoration: "none" }}
        >
          ← Volver a la caja
        </Link>
        <BotonImprimir />
      </div>

      <div
        style={{
          background: "#fff",
          border: "1px solid #1e2761",
          borderRadius: 4,
          padding: "1.75rem",
          position: "relative",
        }}
      >
        {ingreso.anulado && (
          <div
            style={{
              position: "absolute",
              top: "38%",
              left: 0,
              right: 0,
              textAlign: "center",
              fontSize: 64,
              fontWeight: 700,
              color: "rgba(163,45,45,0.18)",
              transform: "rotate(-12deg)",
              pointerEvents: "none",
            }}
          >
            ANULADO
          </div>
        )}

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <p style={{ fontSize: 16, fontWeight: 600, margin: 0 }}>{ingreso.empresa.nombre}</p>
            <p style={{ fontSize: 13, color: "#5b6591", margin: "2px 0 0" }}>Parada: {ingreso.parada.nombre}</p>
          </div>
          <div style={{ textAlign: "right" }}>
            <p style={{ fontSize: 12, color: "#5b6591", margin: 0 }}>COMPROBANTE DE INGRESO</p>
            <p style={{ fontSize: 20, fontWeight: 600, margin: "2px 0 0" }}>
              N° {numeroComprobante(ingreso.numeroComprobante)}
            </p>
          </div>
        </div>

        <hr style={{ border: "none", borderTop: "1px solid #d9deee", margin: "18px 0" }} />

        <Fila etiqueta="Fecha" valor={ingreso.fecha.toLocaleDateString("es-BO", { timeZone: "UTC" })} />
        <Fila etiqueta="Recibido de" valor={ingreso.recibidoDe ?? "—"} />
        <Fila etiqueta="Tipo de ingreso" valor={ingreso.tipoIngreso.nombre} />
        {ingreso.concepto && <Fila etiqueta="Concepto" valor={ingreso.concepto} />}

        <div
          style={{
            margin: "18px 0",
            padding: "14px 16px",
            background: "#eef2fb",
            borderRadius: 6,
          }}
        >
          <p style={{ fontSize: 12, color: "#5b6591", margin: "0 0 2px" }}>Monto recibido</p>
          <p style={{ fontSize: 24, fontWeight: 600, margin: 0 }}>{bs(monto)}</p>
          <p style={{ fontSize: 12, color: "#5b6591", margin: "6px 0 0" }}>Son: {montoEnLetras(monto)}</p>
        </div>

        {ingreso.anulado && (
          <p style={{ fontSize: 13, color: "#a32d2d", margin: "0 0 12px" }}>
            Comprobante anulado. Motivo: {ingreso.motivoAnulacion}
          </p>
        )}

        <div style={{ display: "flex", justifyContent: "space-between", gap: 32, marginTop: 48 }}>
          <Firma titulo="Entregué conforme" nombre={ingreso.recibidoDe ?? ""} />
          <Firma titulo="Recibí conforme" nombre={ingreso.registradoPor?.nombre ?? ""} />
        </div>

        <p style={{ fontSize: 11, color: "#5b6591", margin: "20px 0 0", textAlign: "center" }}>
          Emitido el {ingreso.createdAt.toLocaleString("es-BO")}
        </p>
      </div>

      {rol === "ADMIN" && !ingreso.anulado && (
        <form
          action={anular}
          className="no-imprimir"
          style={{ marginTop: 20, display: "flex", gap: 8, alignItems: "flex-end", flexWrap: "wrap" }}
        >
          <label style={{ flex: 1, minWidth: 220 }}>
            <span style={{ fontSize: 12, color: "#5b6591", display: "block", marginBottom: 4 }}>
              Anular comprobante (queda registrado y deja de sumar en la caja)
            </span>
            <input
              name="motivo"
              required
              placeholder="Motivo de la anulación"
              style={{ width: "100%", padding: "8px 10px", borderRadius: 8, border: "1px solid #d9deee" }}
            />
          </label>
          <button
            type="submit"
            style={{
              padding: "8px 14px",
              borderRadius: 8,
              border: "1px solid #e3b3b3",
              background: "#fff",
              color: "#a32d2d",
              fontSize: 13,
              cursor: "pointer",
            }}
          >
            Anular
          </button>
        </form>
      )}
    </main>
  );
}

function Fila({ etiqueta, valor }: { etiqueta: string; valor: string }) {
  return (
    <div style={{ display: "flex", gap: 12, padding: "5px 0", fontSize: 14 }}>
      <span style={{ width: 130, color: "#5b6591", flexShrink: 0 }}>{etiqueta}</span>
      <span style={{ fontWeight: 500 }}>{valor}</span>
    </div>
  );
}

function Firma({ titulo, nombre }: { titulo: string; nombre: string }) {
  return (
    <div style={{ flex: 1, textAlign: "center" }}>
      <div style={{ borderTop: "1px solid #1e2761", paddingTop: 6, fontSize: 12 }}>{titulo}</div>
      <div style={{ fontSize: 12, color: "#5b6591", marginTop: 2 }}>{nombre}</div>
    </div>
  );
}
