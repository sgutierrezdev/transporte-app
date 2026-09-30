-- CreateTable
CREATE TABLE "TipoIngreso" (
    "id" TEXT NOT NULL,
    "empresaId" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "TipoIngreso_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ingreso" (
    "id" TEXT NOT NULL,
    "empresaId" TEXT NOT NULL,
    "paradaId" TEXT NOT NULL,
    "tipoIngresoId" TEXT NOT NULL,
    "numeroComprobante" SERIAL NOT NULL,
    "recibidoDe" TEXT,
    "personaId" TEXT,
    "concepto" TEXT,
    "monto" DECIMAL(10,2) NOT NULL,
    "fecha" DATE NOT NULL,
    "registradoPorId" TEXT,
    "anulado" BOOLEAN NOT NULL DEFAULT false,
    "motivoAnulacion" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Ingreso_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TipoIngreso_empresaId_nombre_key" ON "TipoIngreso"("empresaId", "nombre");

-- CreateIndex
CREATE UNIQUE INDEX "Ingreso_numeroComprobante_key" ON "Ingreso"("numeroComprobante");

-- CreateIndex
CREATE INDEX "Ingreso_paradaId_idx" ON "Ingreso"("paradaId");

-- CreateIndex
CREATE INDEX "Ingreso_empresaId_idx" ON "Ingreso"("empresaId");

-- AddForeignKey
ALTER TABLE "TipoIngreso" ADD CONSTRAINT "TipoIngreso_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ingreso" ADD CONSTRAINT "Ingreso_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ingreso" ADD CONSTRAINT "Ingreso_paradaId_fkey" FOREIGN KEY ("paradaId") REFERENCES "Parada"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ingreso" ADD CONSTRAINT "Ingreso_tipoIngresoId_fkey" FOREIGN KEY ("tipoIngresoId") REFERENCES "TipoIngreso"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ingreso" ADD CONSTRAINT "Ingreso_personaId_fkey" FOREIGN KEY ("personaId") REFERENCES "Persona"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ingreso" ADD CONSTRAINT "Ingreso_registradoPorId_fkey" FOREIGN KEY ("registradoPorId") REFERENCES "Persona"("id") ON DELETE SET NULL ON UPDATE CASCADE;
