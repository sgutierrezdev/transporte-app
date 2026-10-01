import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { crearGrupo } from "@/lib/actions/grupos";
import { ComponenteGruposCliente } from "./ComponenteGruposCliente";

export default async function GruposPage() {
  const session = await getServerSession(authOptions);
  const empresaId = (session!.user as any).empresaId as string;

  // Ejecutamos tu consulta relacional original optimizada para Neon.tech
  const [grupos, personas] = await Promise.all([
    prisma.grupo.findMany({
      where: { empresaId },
      include: {
        subgrupos: { include: { moviles: true } },
        jefeHistorial: { where: { fechaFin: null }, include: { jefe: true } },
      },
      orderBy: { nombre: "asc" },
    }),
    prisma.persona.findMany({ where: { empresaId }, orderBy: { nombre: "asc" } }),
  ]);

  // Formateamos los datos limpios y calculamos los móviles acumulados en el servidor
  const datosGruposFormateados = grupos.map((g) => {
    const totalMoviles = g.subgrupos.reduce((acc, s) => acc + s.moviles.length, 0);
    const jefe = g.jefeHistorial[0]?.jefe;
    return {
      id: g.id,
      nombre: `Grupo ${g.nombre}`,
      jefeNombre: jefe?.nombre ?? "Sin asignar",
      totalMoviles,
      subgrupos: g.subgrupos.map(s => ({ id: s.id, nombre: s.nombre }))
    };
  });

  return (
    <main style={{ maxWidth: 1000, margin: "0 auto", padding: "1.5rem 1rem" }}>
      <ComponenteGruposCliente 
        gruposIniciales={datosGruposFormateados}
        personas={personas}
        crearGrupoAction={crearGrupo}
      />
    </main>
  );
}
