/*
  Warnings:

  - You are about to drop the column `EnumTipoSistemas` on the `Embedding` table. All the data in the column will be lost.
  - Added the required column `tipoSistema` to the `Embedding` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Embedding" DROP COLUMN "EnumTipoSistemas",
ADD COLUMN     "tipoSistema" "EnumTipoSistemas" NOT NULL;
