import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";

// Asumimos que Campo y estiloInput están definidos o importados. 
// Si los tienes definidos localmente en tu archivo, mantén sus declaraciones.
const estiloInput = {
  width: "100%",
  padding: "8px",
  borderRadius: "4px",
  border: "1px solid #ccc",
  marginTop: "4px"
};

function Campo({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ fontWeight: "bold", display: "block" }}>{label}</label>
      {children}
    </div>
  );
}

export default async function EditarSocioPage({ params }: { params: { id: string } }) {
  const session = await getServerSession();
  const empresaId = (session!.user as any).empresaId as string;

  // Consultamos el socio e incluimos la tabla persona de forma correcta
  const socio = await prisma.socio.findFirst({ 
    where: { id: params.id, empresaId },
    include: { persona: true }
  });

  if (!socio) notFound();

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: 20 }}>
      <h1 style={{ fontSize: 24, marginBottom: 20 }}>Editar socio</h1>

      <form method="POST">
        <Campo label="Nombre">
          <input 
            name="nombre" 
            defaultValue={socio.persona?.nombre || ""} 
            required 
            style={estiloInput} 
          />
        </Campo>
        
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <Campo label="Carnet">
            <input 
              name="carnet" 
              defaultValue={socio.persona?.carnet || ""} 
              style={estiloInput} 
            />
          </Campo>
          <Campo label="Celular">
            <input 
              name="celular" 
              defaultValue={socio.persona?.celular || ""} 
              style={estiloInput} 
            />
          </Campo>
        </div>

        <Campo label="Código de Socio">
          <input 
            name="codigo" 
            defaultValue={socio.codigo || ""} 
            style={estiloInput} 
          />
        </Campo>

        <button 
          type="submit" 
          style={{ 
            backgroundColor: "#0070f3", 
            color: "white", 
            padding: "10px 16px", 
            border: "none", 
            borderRadius: 4, 
            cursor: "pointer",
            marginTop: 10 
          }}
        >
          Guardar Cambios
        </button>
      </form>
    </div>
  );
}
