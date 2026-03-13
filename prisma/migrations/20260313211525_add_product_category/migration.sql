-- CreateEnum
CREATE TYPE "Category" AS ENUM ('FIOS', 'MALHAS', 'MAQUINAS');

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "category" "Category" NOT NULL DEFAULT 'FIOS';
