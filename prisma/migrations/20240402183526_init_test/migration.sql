-- CreateTable
CREATE TABLE "Category" (
    "cid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Category_cid_key" ON "Category"("cid");

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");
