-- CreateTable
CREATE TABLE "ownership_assignments" (
    "assignment_id" TEXT NOT NULL,
    "apartment_id" TEXT NOT NULL,
    "owner_id" TEXT NOT NULL,
    "created_by_id" TEXT NOT NULL,
    "effective_from" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "effective_until" TIMESTAMPTZ(3),
    "assignment_reason" TEXT,
    "ending_reason" TEXT,

    CONSTRAINT "ownership_assignments_pkey" PRIMARY KEY ("assignment_id")
);

-- CreateIndex
CREATE INDEX "ownership_assignments_owner_id_effective_until_idx" ON "ownership_assignments"("owner_id", "effective_until");

-- CreateIndex
CREATE INDEX "ownership_assignments_created_by_id_idx" ON "ownership_assignments"("created_by_id");

-- CreateIndex
CREATE UNIQUE INDEX "ownership_one_open_per_apartment" ON "ownership_assignments"("apartment_id") WHERE ("effective_until" IS NULL);

-- AddForeignKey
ALTER TABLE "ownership_assignments" ADD CONSTRAINT "ownership_assignments_apartment_id_fkey" FOREIGN KEY ("apartment_id") REFERENCES "apartments"("apartment_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ownership_assignments" ADD CONSTRAINT "ownership_assignments_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "user_accounts"("account_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ownership_assignments" ADD CONSTRAINT "ownership_assignments_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "user_accounts"("account_id") ON DELETE RESTRICT ON UPDATE CASCADE;
