-- CreateTable
CREATE TABLE "Socio" (
    "id" TEXT NOT NULL,
    "empresaId" TEXT NOT NULL,
    "personaId" TEXT NOT NULL,
    "codigo" TEXT,
    "estado" TEXT NOT NULL DEFAULT 'ACTIVO',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Socio_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Socio_personaId_key" ON "Socio"("personaId");

-- AddForeignKey
ALTER TABLE "Socio" ADD CONSTRAINT "Socio_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresa"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Socio" ADD CONSTRAINT "Socio_personaId_fkey" FOREIGN KEY ("personaId") REFERENCES "Persona"("id") ON DELETE CASCADE ON UPDATE CASCADE;
