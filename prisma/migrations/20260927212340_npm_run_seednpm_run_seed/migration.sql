-- AlterEnum
ALTER TYPE "EstadoAsistencia" ADD VALUE 'ABANDONO';

-- AlterTable
ALTER TABLE "RotacionDiaria" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "TipoGasto" (
    "id" TEXT NOT NULL,
    "empresaId" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "TipoGasto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Gasto" (
    "id" TEXT NOT NULL,
    "empresaId" TEXT NOT NULL,
    "paradaId" TEXT NOT NULL,
    "tipoGastoId" TEXT NOT NULL,
    "descripcion" TEXT,
    "monto" DECIMAL(10,2) NOT NULL,
    "fecha" DATE NOT NULL,
    "registradoPorId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Gasto_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TipoGasto_empresaId_nombre_key" ON "TipoGasto"("empresaId", "nombre");

-- CreateIndex
CREATE INDEX "Gasto_paradaId_idx" ON "Gasto"("paradaId");

-- CreateIndex
CREATE INDEX "Gasto_empresaId_idx" ON "Gasto"("empresaId");

-- AddForeignKey
ALTER TABLE "TipoGasto" ADD CONSTRAINT "TipoGasto_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Gasto" ADD CONSTRAINT "Gasto_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Gasto" ADD CONSTRAINT "Gasto_paradaId_fkey" FOREIGN KEY ("paradaId") REFERENCES "Parada"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Gasto" ADD CONSTRAINT "Gasto_tipoGastoId_fkey" FOREIGN KEY ("tipoGastoId") REFERENCES "TipoGasto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Gasto" ADD CONSTRAINT "Gasto_registradoPorId_fkey" FOREIGN KEY ("registradoPorId") REFERENCES "Persona"("id") ON DELETE SET NULL ON UPDATE CASCADE;
