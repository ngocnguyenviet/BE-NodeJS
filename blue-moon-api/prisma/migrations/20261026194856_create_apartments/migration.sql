-- CreateTable
CREATE TABLE "apartments" (
    "apartment_id" TEXT NOT NULL,
    "apartment_number" TEXT NOT NULL,
    "floor_number" INTEGER NOT NULL,

    CONSTRAINT "apartments_pkey" PRIMARY KEY ("apartment_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "apartments_apartment_number_key" ON "apartments"("apartment_number");
