-- CreateTable
CREATE TABLE "Usuario" (
    "id" TEXT NOT NULL,
    "nickname" TEXT,
    "nivelAcesso" TEXT,
    "senha" TEXT NOT NULL,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Problema" (
    "id" SERIAL NOT NULL,
    "problema" TEXT NOT NULL,
    "versao" TEXT NOT NULL,
    "autorRegistro" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "dataRegistro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL,

    CONSTRAINT "Problema_pkey" PRIMARY KEY ("id")
);
