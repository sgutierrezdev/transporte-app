import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const empresa = await prisma.empresa.create({
    data: { nombre: "Empresa de transporte (demo)" },
  });

  const passwordHash = await bcrypt.hash("admin123", 10);

  await prisma.persona.create({
    data: {
      empresaId: empresa.id,
      nombre: "Administrador general",
      email: "admin@empresa.com",
      password: passwordHash,
      rol: "ADMIN",
    },
  });

  await prisma.tipoInfraccion.createMany({
    data: [
      { empresaId: empresa.id, nombre: "Tardanza", montoFijo: 20 },
      { empresaId: empresa.id, nombre: "Ausencia", montoFijo: 50 },
      { empresaId: empresa.id, nombre: "Abandono de ruta", montoFijo: 80 },
    ],
  });

  await prisma.tipoGasto.createMany({
    data: [
      { empresaId: empresa.id, nombre: "Sueldo secretaria" },
      { empresaId: empresa.id, nombre: "Insumos de limpieza" },
      { empresaId: empresa.id, nombre: "Mantenimiento" },
      { empresaId: empresa.id, nombre: "Otros" },
    ],
  });

  console.log("Datos iniciales creados. Login: admin@empresa.com / admin123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
