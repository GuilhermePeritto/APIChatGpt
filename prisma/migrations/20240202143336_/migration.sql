/*
  Warnings:

  - Changed the type of `EnumTipoSistemas` on the `Embedding` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "EnumTipoSistemas" AS ENUM ('Loja', 'Crm');

-- AlterTable
ALTER TABLE "Embedding" DROP COLUMN "EnumTipoSistemas",
ADD COLUMN     "EnumTipoSistemas" "EnumTipoSistemas" NOT NULL;
