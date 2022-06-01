/*
  Warnings:

  - A unique constraint covering the columns `[nickname]` on the table `Usuario` will be added. If there are existing duplicate values, this will fail.
  - Made the column `nickname` on table `Usuario` required. This step will fail if there are existing NULL values in that column.
  - Made the column `nivelAcesso` on table `Usuario` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Usuario" ALTER COLUMN "nickname" SET NOT NULL,
ALTER COLUMN "nivelAcesso" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_nickname_key" ON "Usuario"("nickname");
