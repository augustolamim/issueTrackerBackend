/*
  Warnings:

  - Added the required column `atribuido` to the `Problema` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Problema" ADD COLUMN     "atribuido" TEXT NOT NULL,
ALTER COLUMN "status" SET DEFAULT E'Novo';

-- CreateTable
CREATE TABLE "RefreshToken" (
    "id" TEXT NOT NULL,
    "expiresIn" INTEGER NOT NULL,
    "usuarioId" TEXT NOT NULL,

    CONSTRAINT "RefreshToken_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RefreshToken_usuarioId_key" ON "RefreshToken"("usuarioId");

-- AddForeignKey
ALTER TABLE "Problema" ADD CONSTRAINT "Problema_autorRegistro_fkey" FOREIGN KEY ("autorRegistro") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Problema" ADD CONSTRAINT "Problema_atribuido_fkey" FOREIGN KEY ("atribuido") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RefreshToken" ADD CONSTRAINT "RefreshToken_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
