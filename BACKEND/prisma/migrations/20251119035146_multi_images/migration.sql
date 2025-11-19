/*
  Warnings:

  - You are about to drop the column `imageUrl` on the `Pet` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Pet" DROP COLUMN "imageUrl";

-- CreateTable
CREATE TABLE "PetImage" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "petId" INTEGER NOT NULL,

    CONSTRAINT "PetImage_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PetImage" ADD CONSTRAINT "PetImage_petId_fkey" FOREIGN KEY ("petId") REFERENCES "Pet"("id") ON DELETE CASCADE ON UPDATE CASCADE;
