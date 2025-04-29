-- CreateTable
CREATE TABLE "Doctor" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "specialization" TEXT NOT NULL,
    "experience" INTEGER NOT NULL,
    "location" TEXT NOT NULL,
    "availability" TEXT[],
    "rating" DOUBLE PRECISION NOT NULL,
    "fees" INTEGER NOT NULL,
    "image" TEXT NOT NULL,
    "qualifications" TEXT NOT NULL,
    "languages" TEXT[],

    CONSTRAINT "Doctor_pkey" PRIMARY KEY ("id")
);
