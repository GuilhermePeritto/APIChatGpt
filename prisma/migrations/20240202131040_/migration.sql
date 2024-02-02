-- CreateEnum
CREATE TYPE "EnumTipoSistemas" AS ENUM ('Loja', 'Crm');

-- CreateTable
CREATE TABLE "Embedding" (
    "_id" TEXT NOT NULL,
    "data" DOUBLE PRECISION[],
    "text" TEXT NOT NULL,
    "EnumTipoSistemas" "EnumTipoSistemas" NOT NULL,

    CONSTRAINT "Embedding_pkey" PRIMARY KEY ("_id")
);
