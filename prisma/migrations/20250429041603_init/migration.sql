/*
  Warnings:

  - You are about to drop the column `availability` on the `Doctor` table. All the data in the column will be lost.
  - You are about to drop the column `experience` on the `Doctor` table. All the data in the column will be lost.
  - You are about to drop the column `fees` on the `Doctor` table. All the data in the column will be lost.
  - You are about to drop the column `languages` on the `Doctor` table. All the data in the column will be lost.
  - You are about to drop the column `location` on the `Doctor` table. All the data in the column will be lost.
  - You are about to drop the column `qualifications` on the `Doctor` table. All the data in the column will be lost.
  - Added the required column `description` to the `Doctor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `latitude` to the `Doctor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `locality` to the `Doctor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `longitude` to the `Doctor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `priceRange` to the `Doctor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `region` to the `Doctor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `url` to the `Doctor` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Doctor" DROP COLUMN "availability",
DROP COLUMN "experience",
DROP COLUMN "fees",
DROP COLUMN "languages",
DROP COLUMN "location",
DROP COLUMN "qualifications",
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "latitude" TEXT NOT NULL,
ADD COLUMN     "locality" TEXT NOT NULL,
ADD COLUMN     "longitude" TEXT NOT NULL,
ADD COLUMN     "priceRange" INTEGER NOT NULL,
ADD COLUMN     "region" TEXT NOT NULL,
ADD COLUMN     "url" TEXT NOT NULL,
ALTER COLUMN "rating" DROP NOT NULL;
