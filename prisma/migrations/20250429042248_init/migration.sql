/*
  Warnings:

  - You are about to drop the column `latitude` on the `Doctor` table. All the data in the column will be lost.
  - You are about to drop the column `locality` on the `Doctor` table. All the data in the column will be lost.
  - You are about to drop the column `longitude` on the `Doctor` table. All the data in the column will be lost.
  - You are about to drop the column `region` on the `Doctor` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[addressId]` on the table `Doctor` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[locationId]` on the table `Doctor` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `addressId` to the `Doctor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `locationId` to the `Doctor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Doctor` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Doctor" DROP COLUMN "latitude",
DROP COLUMN "locality",
DROP COLUMN "longitude",
DROP COLUMN "region",
ADD COLUMN     "addressId" TEXT NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "locationId" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "Address" (
    "id" TEXT NOT NULL,
    "locality" TEXT NOT NULL,
    "region" TEXT NOT NULL,

    CONSTRAINT "Address_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Location" (
    "id" TEXT NOT NULL,
    "latitude" TEXT NOT NULL,
    "longitude" TEXT NOT NULL,

    CONSTRAINT "Location_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Doctor_addressId_key" ON "Doctor"("addressId");

-- CreateIndex
CREATE UNIQUE INDEX "Doctor_locationId_key" ON "Doctor"("locationId");

-- AddForeignKey
ALTER TABLE "Doctor" ADD CONSTRAINT "Doctor_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "Address"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Doctor" ADD CONSTRAINT "Doctor_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
