/*
  Warnings:

  - Added the required column `species` to the `Pet` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Pet" ADD COLUMN     "color" TEXT,
ADD COLUMN     "contact" TEXT,
ADD COLUMN     "reward" TEXT,
ADD COLUMN     "size" TEXT,
ADD COLUMN     "species" TEXT NOT NULL,
ALTER COLUMN "name" DROP NOT NULL,
ALTER COLUMN "breed" DROP NOT NULL;
