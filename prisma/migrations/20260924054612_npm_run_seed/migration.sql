-- CreateEnum
CREATE TYPE "Rol" AS ENUM ('ADMIN', 'JEFE_GRUPO', 'SECRETARIA', 'SOCIO');

-- CreateEnum
CREATE TYPE "EstadoSocio" AS ENUM ('ACTIVO', 'INACTIVO', 'LICENCIA');

-- CreateEnum
CREATE TYPE "MetodoAsistencia" AS ENUM ('GPS', 'QR', 'MANUAL');

-- CreateEnum
CREATE TYPE "EstadoAsistencia" AS ENUM ('A_TIEMPO', 'TARDANZA', 'AUSENTE');

-- CreateEnum
CREATE TYPE "EstadoPermiso" AS ENUM ('PENDIENTE', 'APROBADO', 'RECHAZADO');

-- CreateEnum
CREATE TYPE "TipoEntregaEncomienda" AS ENUM ('PARADA', 'DOMICILIO');

-- CreateEnum
CREATE TYPE "EstadoEncomienda" AS ENUM ('RECIBIDA', 'EN_TRANSITO', 'ENTREGADA');

-- CreateTable
CREATE TABLE "Empresa" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Empresa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Socio" (
    "id" TEXT NOT NULL,
    "empresaId" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "carnet" TEXT,
    "celular" TEXT,
    "email" TEXT,
    "password" TEXT,
    "rol" "Rol" NOT NULL,
    "estado" "EstadoSocio" NOT NULL DEFAULT 'ACTIVO',
    "fechaIngreso" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Socio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Movil" (
    "id" TEXT NOT NULL,
    "empresaId" TEXT NOT NULL,
    "numeroInterno" TEXT NOT NULL,
    "placa" TEXT,
    "capacidad" INTEGER,
    "grupoId" TEXT,
    "choferId" TEXT,

    CONSTRAINT "Movil_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Grupo" (
    "id" TEXT NOT NULL,
    "empresaId" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "jefeId" TEXT,

    CONSTRAINT "Grupo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Parada" (
    "id" TEXT NOT NULL,
    "empresaId" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "ubicacion" TEXT NOT NULL,
    "secretariaId" TEXT,

    CONSTRAINT "Parada_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AsignacionDiaria" (
    "id" TEXT NOT NULL,
    "fecha" DATE NOT NULL,
    "grupoId" TEXT NOT NULL,
    "paradaId" TEXT NOT NULL,

    CONSTRAINT "AsignacionDiaria_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TipoInfraccion" (
    "id" TEXT NOT NULL,
    "empresaId" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "montoFijo" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "TipoInfraccion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Asistencia" (
    "id" TEXT NOT NULL,
    "socioId" TEXT NOT NULL,
    "asignacionDiariaId" TEXT NOT NULL,
    "paradaId" TEXT NOT NULL,
    "horaLlegada" TIMESTAMP(3),
    "metodo" "MetodoAsistencia",
    "estado" "EstadoAsistencia" NOT NULL,
    "tipoInfraccionId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Asistencia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Permiso" (
    "id" TEXT NOT NULL,
    "socioId" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "fechaInicio" DATE NOT NULL,
    "fechaFin" DATE NOT NULL,
    "estado" "EstadoPermiso" NOT NULL DEFAULT 'PENDIENTE',
    "aprobadoPorId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Permiso_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Encomienda" (
    "id" TEXT NOT NULL,
    "empresaId" TEXT NOT NULL,
    "remitenteNombre" TEXT NOT NULL,
    "remitenteCelular" TEXT,
    "destinatarioNombre" TEXT NOT NULL,
    "destinatarioCelular" TEXT,
    "contenido" TEXT,
    "paradaOrigenId" TEXT NOT NULL,
    "tipoEntrega" "TipoEntregaEncomienda" NOT NULL,
    "direccionDestino" TEXT,
    "movilId" TEXT,
    "flete" DECIMAL(10,2) NOT NULL,
    "estado" "EstadoEncomienda" NOT NULL DEFAULT 'RECIBIDA',
    "fechaRecepcion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaEntrega" TIMESTAMP(3),
    "entregadoA" TEXT,

    CONSTRAINT "Encomienda_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Socio_email_key" ON "Socio"("email");

-- CreateIndex
CREATE INDEX "Socio_empresaId_idx" ON "Socio"("empresaId");

-- CreateIndex
CREATE UNIQUE INDEX "Movil_choferId_key" ON "Movil"("choferId");

-- CreateIndex
CREATE UNIQUE INDEX "Movil_empresaId_numeroInterno_key" ON "Movil"("empresaId", "numeroInterno");

-- CreateIndex
CREATE UNIQUE INDEX "Grupo_jefeId_key" ON "Grupo"("jefeId");

-- CreateIndex
CREATE UNIQUE INDEX "Grupo_empresaId_nombre_key" ON "Grupo"("empresaId", "nombre");

-- CreateIndex
CREATE UNIQUE INDEX "Parada_secretariaId_key" ON "Parada"("secretariaId");

-- CreateIndex
CREATE INDEX "Parada_empresaId_idx" ON "Parada"("empresaId");

-- CreateIndex
CREATE UNIQUE INDEX "AsignacionDiaria_grupoId_fecha_key" ON "AsignacionDiaria"("grupoId", "fecha");

-- CreateIndex
CREATE UNIQUE INDEX "TipoInfraccion_empresaId_nombre_key" ON "TipoInfraccion"("empresaId", "nombre");

-- CreateIndex
CREATE INDEX "Asistencia_socioId_idx" ON "Asistencia"("socioId");

-- CreateIndex
CREATE INDEX "Asistencia_asignacionDiariaId_idx" ON "Asistencia"("asignacionDiariaId");

-- CreateIndex
CREATE INDEX "Permiso_socioId_idx" ON "Permiso"("socioId");

-- CreateIndex
CREATE INDEX "Encomienda_empresaId_idx" ON "Encomienda"("empresaId");

-- AddForeignKey
ALTER TABLE "Socio" ADD CONSTRAINT "Socio_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Movil" ADD CONSTRAINT "Movil_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Movil" ADD CONSTRAINT "Movil_grupoId_fkey" FOREIGN KEY ("grupoId") REFERENCES "Grupo"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Movil" ADD CONSTRAINT "Movil_choferId_fkey" FOREIGN KEY ("choferId") REFERENCES "Socio"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Grupo" ADD CONSTRAINT "Grupo_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Grupo" ADD CONSTRAINT "Grupo_jefeId_fkey" FOREIGN KEY ("jefeId") REFERENCES "Socio"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Parada" ADD CONSTRAINT "Parada_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Parada" ADD CONSTRAINT "Parada_secretariaId_fkey" FOREIGN KEY ("secretariaId") REFERENCES "Socio"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AsignacionDiaria" ADD CONSTRAINT "AsignacionDiaria_grupoId_fkey" FOREIGN KEY ("grupoId") REFERENCES "Grupo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AsignacionDiaria" ADD CONSTRAINT "AsignacionDiaria_paradaId_fkey" FOREIGN KEY ("paradaId") REFERENCES "Parada"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TipoInfraccion" ADD CONSTRAINT "TipoInfraccion_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Asistencia" ADD CONSTRAINT "Asistencia_socioId_fkey" FOREIGN KEY ("socioId") REFERENCES "Socio"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Asistencia" ADD CONSTRAINT "Asistencia_asignacionDiariaId_fkey" FOREIGN KEY ("asignacionDiariaId") REFERENCES "AsignacionDiaria"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Asistencia" ADD CONSTRAINT "Asistencia_paradaId_fkey" FOREIGN KEY ("paradaId") REFERENCES "Parada"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Asistencia" ADD CONSTRAINT "Asistencia_tipoInfraccionId_fkey" FOREIGN KEY ("tipoInfraccionId") REFERENCES "TipoInfraccion"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Permiso" ADD CONSTRAINT "Permiso_socioId_fkey" FOREIGN KEY ("socioId") REFERENCES "Socio"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Permiso" ADD CONSTRAINT "Permiso_aprobadoPorId_fkey" FOREIGN KEY ("aprobadoPorId") REFERENCES "Socio"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Encomienda" ADD CONSTRAINT "Encomienda_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Encomienda" ADD CONSTRAINT "Encomienda_paradaOrigenId_fkey" FOREIGN KEY ("paradaOrigenId") REFERENCES "Parada"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Encomienda" ADD CONSTRAINT "Encomienda_movilId_fkey" FOREIGN KEY ("movilId") REFERENCES "Movil"("id") ON DELETE SET NULL ON UPDATE CASCADE;
