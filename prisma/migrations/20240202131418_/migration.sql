/*
  Warnings:

  - Changed the type of `EnumTipoSistemas` on the `Embedding` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Embedding" DROP COLUMN "EnumTipoSistemas",
ADD COLUMN     "EnumTipoSistemas" INTEGER NOT NULL;

-- DropEnum
DROP TYPE "EnumTipoSistemas";
