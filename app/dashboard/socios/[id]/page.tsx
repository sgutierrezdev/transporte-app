import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import Link from "next/link";

export default async function SociosPage() {
  const session = await getServerSession();
  const empresaId = (session!.user as any).empresaId as string;

  // Consulta corregida ordenando a través de la relación de persona
  const socios = await prisma.socio.findMany({
    where: { empresaId },
    orderBy: {
      persona: {
        nombre: "asc"
      }
    },
    include: {
      persona: true
    }
  });

  return (
    <div style={{ padding: 20 }}>
      <h1 style={{ fontSize: 24, marginBottom: 20 }}>Lista de Socios</h1>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {socios.map((socio) => (
          <div 
            key={socio.id} 
            style={{ 
              padding: 15, 
              border: "1px solid #eee", 
              borderRadius: 8, 
              display: "flex", 
              justifyContent: "between", 
              alignItems: "center" 
            }}
          >
            <div>
              <p style={{ fontWeight: "bold", margin: 0 }}>{socio.persona?.nombre}</p>
              <p style={{ size: 12, color: "#666", margin: 0 }}>Código: {socio.codigo || "Sin código"}</p>
            </div>
            <Link 
              href={`/dashboard/socios/${socio.id}`}
              style={{ color: "#0070f3", textDecoration: "none", fontWeight: "bold" }}
            >
              Editar
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
