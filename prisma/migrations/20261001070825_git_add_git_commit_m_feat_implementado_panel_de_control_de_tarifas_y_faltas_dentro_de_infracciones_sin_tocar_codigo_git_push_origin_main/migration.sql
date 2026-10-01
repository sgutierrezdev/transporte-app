-- AlterTable
ALTER TABLE "TipoInfraccion" ADD COLUMN     "fechaFin" DATE,
ADD COLUMN     "fechaInicio" DATE,
ADD COLUMN     "montoEspecial" DECIMAL(10,2);
