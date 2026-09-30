/*
  Warnings:

  - You are about to drop the column `asignacionDiariaId` on the `Asistencia` table. All the data in the column will be lost.
  - You are about to drop the column `paradaId` on the `Asistencia` table. All the data in the column will be lost.
  - You are about to drop the column `socioId` on the `Asistencia` table. All the data in the column will be lost.
  - You are about to drop the column `jefeId` on the `Grupo` table. All the data in the column will be lost.
  - You are about to drop the column `choferId` on the `Movil` table. All the data in the column will be lost.
  - You are about to drop the column `grupoId` on the `Movil` table. All the data in the column will be lost.
  - You are about to drop the column `socioId` on the `Permiso` table. All the data in the column will be lost.
  - You are about to drop the `AsignacionDiaria` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Socio` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[programacionDiariaId]` on the table `Asistencia` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `personaId` to the `Asistencia` table without a default value. This is not possible if the table is not empty.
  - Added the required column `programacionDiariaId` to the `Asistencia` table without a default value. This is not possible if the table is not empty.
  - Added the required column `personaId` to the `Permiso` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "EstadoPersona" AS ENUM ('ACTIVO', 'INACTIVO', 'LICENCIA');

-- AlterEnum
ALTER TYPE "Rol" ADD VALUE 'CHOFER';

-- DropForeignKey
ALTER TABLE "AsignacionDiaria" DROP CONSTRAINT "AsignacionDiaria_grupoId_fkey";

-- DropForeignKey
ALTER TABLE "AsignacionDiaria" DROP CONSTRAINT "AsignacionDiaria_paradaId_fkey";

-- DropForeignKey
ALTER TABLE "Asistencia" DROP CONSTRAINT "Asistencia_asignacionDiariaId_fkey";

-- DropForeignKey
ALTER TABLE "Asistencia" DROP CONSTRAINT "Asistencia_paradaId_fkey";

-- DropForeignKey
ALTER TABLE "Asistencia" DROP CONSTRAINT "Asistencia_socioId_fkey";

-- DropForeignKey
ALTER TABLE "Grupo" DROP CONSTRAINT "Grupo_jefeId_fkey";

-- DropForeignKey
ALTER TABLE "Movil" DROP CONSTRAINT "Movil_choferId_fkey";

-- DropForeignKey
ALTER TABLE "Movil" DROP CONSTRAINT "Movil_grupoId_fkey";

-- DropForeignKey
ALTER TABLE "Parada" DROP CONSTRAINT "Parada_secretariaId_fkey";

-- DropForeignKey
ALTER TABLE "Permiso" DROP CONSTRAINT "Permiso_aprobadoPorId_fkey";

-- DropForeignKey
ALTER TABLE "Permiso" DROP CONSTRAINT "Permiso_socioId_fkey";

-- DropForeignKey
ALTER TABLE "Socio" DROP CONSTRAINT "Socio_empresaId_fkey";

-- DropIndex
DROP INDEX "Asistencia_asignacionDiariaId_idx";

-- DropIndex
DROP INDEX "Asistencia_socioId_idx";

-- DropIndex
DROP INDEX "Grupo_jefeId_key";

-- DropIndex
DROP INDEX "Movil_choferId_key";

-- DropIndex
DROP INDEX "Permiso_socioId_idx";

-- AlterTable
ALTER TABLE "Asistencia" DROP COLUMN "asignacionDiariaId",
DROP COLUMN "paradaId",
DROP COLUMN "socioId",
ADD COLUMN     "personaId" TEXT NOT NULL,
ADD COLUMN     "programacionDiariaId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Grupo" DROP COLUMN "jefeId";

-- AlterTable
ALTER TABLE "Movil" DROP COLUMN "choferId",
DROP COLUMN "grupoId",
ADD COLUMN     "choferTitularId" TEXT,
ADD COLUMN     "socioId" TEXT,
ADD COLUMN     "subgrupoId" TEXT;

-- AlterTable
ALTER TABLE "Permiso" DROP COLUMN "socioId",
ADD COLUMN     "personaId" TEXT NOT NULL;

-- DropTable
DROP TABLE "AsignacionDiaria";

-- DropTable
DROP TABLE "Socio";

-- DropEnum
DROP TYPE "EstadoSocio";

-- CreateTable
CREATE TABLE "Persona" (
    "id" TEXT NOT NULL,
    "empresaId" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "carnet" TEXT,
    "celular" TEXT,
    "email" TEXT,
    "password" TEXT,
    "rol" "Rol" NOT NULL,
    "estado" "EstadoPersona" NOT NULL DEFAULT 'ACTIVO',
    "fechaIngreso" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Persona_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JefeGrupoHistorial" (
    "id" TEXT NOT NULL,
    "grupoId" TEXT NOT NULL,
    "jefeId" TEXT NOT NULL,
    "fechaInicio" DATE NOT NULL,
    "fechaFin" DATE,
    "motivo" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "JefeGrupoHistorial_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subgrupo" (
    "id" TEXT NOT NULL,
    "grupoId" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "Subgrupo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MovilChoferHistorial" (
    "id" TEXT NOT NULL,
    "movilId" TEXT NOT NULL,
    "choferId" TEXT NOT NULL,
    "fechaInicio" DATE NOT NULL,
    "fechaFin" DATE,
    "motivo" TEXT,
    "autorizadoPorId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MovilChoferHistorial_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReemplazoDiario" (
    "id" TEXT NOT NULL,
    "movilId" TEXT NOT NULL,
    "fecha" DATE NOT NULL,
    "choferId" TEXT NOT NULL,
    "motivo" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ReemplazoDiario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RotacionDiaria" (
    "id" TEXT NOT NULL,
    "subgrupoId" TEXT NOT NULL,
    "fecha" DATE NOT NULL,
    "paradaId" TEXT NOT NULL,

    CONSTRAINT "RotacionDiaria_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProgramacionDiaria" (
    "id" TEXT NOT NULL,
    "fecha" DATE NOT NULL,
    "movilId" TEXT NOT NULL,
    "subgrupoId" TEXT,
    "grupoId" TEXT,
    "jefeId" TEXT,
    "choferId" TEXT,
    "paradaId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProgramacionDiaria_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Persona_email_key" ON "Persona"("email");

-- CreateIndex
CREATE INDEX "Persona_empresaId_idx" ON "Persona"("empresaId");

-- CreateIndex
CREATE INDEX "JefeGrupoHistorial_grupoId_idx" ON "JefeGrupoHistorial"("grupoId");

-- CreateIndex
CREATE UNIQUE INDEX "Subgrupo_grupoId_nombre_key" ON "Subgrupo"("grupoId", "nombre");

-- CreateIndex
CREATE INDEX "MovilChoferHistorial_movilId_idx" ON "MovilChoferHistorial"("movilId");

-- CreateIndex
CREATE UNIQUE INDEX "ReemplazoDiario_movilId_fecha_key" ON "ReemplazoDiario"("movilId", "fecha");

-- CreateIndex
CREATE UNIQUE INDEX "RotacionDiaria_subgrupoId_fecha_key" ON "RotacionDiaria"("subgrupoId", "fecha");

-- CreateIndex
CREATE UNIQUE INDEX "ProgramacionDiaria_movilId_fecha_key" ON "ProgramacionDiaria"("movilId", "fecha");

-- CreateIndex
CREATE UNIQUE INDEX "Asistencia_programacionDiariaId_key" ON "Asistencia"("programacionDiariaId");

-- CreateIndex
CREATE INDEX "Asistencia_personaId_idx" ON "Asistencia"("personaId");

-- CreateIndex
CREATE INDEX "Permiso_personaId_idx" ON "Permiso"("personaId");

-- AddForeignKey
ALTER TABLE "Persona" ADD CONSTRAINT "Persona_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JefeGrupoHistorial" ADD CONSTRAINT "JefeGrupoHistorial_grupoId_fkey" FOREIGN KEY ("grupoId") REFERENCES "Grupo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JefeGrupoHistorial" ADD CONSTRAINT "JefeGrupoHistorial_jefeId_fkey" FOREIGN KEY ("jefeId") REFERENCES "Persona"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subgrupo" ADD CONSTRAINT "Subgrupo_grupoId_fkey" FOREIGN KEY ("grupoId") REFERENCES "Grupo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Movil" ADD CONSTRAINT "Movil_subgrupoId_fkey" FOREIGN KEY ("subgrupoId") REFERENCES "Subgrupo"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Movil" ADD CONSTRAINT "Movil_socioId_fkey" FOREIGN KEY ("socioId") REFERENCES "Persona"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Movil" ADD CONSTRAINT "Movil_choferTitularId_fkey" FOREIGN KEY ("choferTitularId") REFERENCES "Persona"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MovilChoferHistorial" ADD CONSTRAINT "MovilChoferHistorial_movilId_fkey" FOREIGN KEY ("movilId") REFERENCES "Movil"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MovilChoferHistorial" ADD CONSTRAINT "MovilChoferHistorial_choferId_fkey" FOREIGN KEY ("choferId") REFERENCES "Persona"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MovilChoferHistorial" ADD CONSTRAINT "MovilChoferHistorial_autorizadoPorId_fkey" FOREIGN KEY ("autorizadoPorId") REFERENCES "Persona"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReemplazoDiario" ADD CONSTRAINT "ReemplazoDiario_movilId_fkey" FOREIGN KEY ("movilId") REFERENCES "Movil"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReemplazoDiario" ADD CONSTRAINT "ReemplazoDiario_choferId_fkey" FOREIGN KEY ("choferId") REFERENCES "Persona"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Parada" ADD CONSTRAINT "Parada_secretariaId_fkey" FOREIGN KEY ("secretariaId") REFERENCES "Persona"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RotacionDiaria" ADD CONSTRAINT "RotacionDiaria_subgrupoId_fkey" FOREIGN KEY ("subgrupoId") REFERENCES "Subgrupo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RotacionDiaria" ADD CONSTRAINT "RotacionDiaria_paradaId_fkey" FOREIGN KEY ("paradaId") REFERENCES "Parada"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProgramacionDiaria" ADD CONSTRAINT "ProgramacionDiaria_movilId_fkey" FOREIGN KEY ("movilId") REFERENCES "Movil"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProgramacionDiaria" ADD CONSTRAINT "ProgramacionDiaria_grupoId_fkey" FOREIGN KEY ("grupoId") REFERENCES "Grupo"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProgramacionDiaria" ADD CONSTRAINT "ProgramacionDiaria_jefeId_fkey" FOREIGN KEY ("jefeId") REFERENCES "Persona"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProgramacionDiaria" ADD CONSTRAINT "ProgramacionDiaria_choferId_fkey" FOREIGN KEY ("choferId") REFERENCES "Persona"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProgramacionDiaria" ADD CONSTRAINT "ProgramacionDiaria_paradaId_fkey" FOREIGN KEY ("paradaId") REFERENCES "Parada"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Asistencia" ADD CONSTRAINT "Asistencia_programacionDiariaId_fkey" FOREIGN KEY ("programacionDiariaId") REFERENCES "ProgramacionDiaria"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Asistencia" ADD CONSTRAINT "Asistencia_personaId_fkey" FOREIGN KEY ("personaId") REFERENCES "Persona"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Permiso" ADD CONSTRAINT "Permiso_personaId_fkey" FOREIGN KEY ("personaId") REFERENCES "Persona"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Permiso" ADD CONSTRAINT "Permiso_aprobadoPorId_fkey" FOREIGN KEY ("aprobadoPorId") REFERENCES "Persona"("id") ON DELETE SET NULL ON UPDATE CASCADE;
