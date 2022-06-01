/*
  Warnings:

  - Added the required column `dataUpdated` to the `Problema` table without a default value. This is not possible if the table is not empty.
  - Added the required column `prioridade` to the `Problema` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Problema" ADD COLUMN     "dataUpdated" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "prioridade" TEXT NOT NULL;
