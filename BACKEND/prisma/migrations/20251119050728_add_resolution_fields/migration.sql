-- AlterTable
ALTER TABLE "Pet" ADD COLUMN     "finalLatitude" DOUBLE PRECISION,
ADD COLUMN     "finalLongitude" DOUBLE PRECISION,
ADD COLUMN     "foundByExternal" TEXT,
ADD COLUMN     "foundByUserId" INTEGER,
ADD COLUMN     "resolvedAt" TIMESTAMP(3);

-- AddForeignKey
ALTER TABLE "Pet" ADD CONSTRAINT "Pet_foundByUserId_fkey" FOREIGN KEY ("foundByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
