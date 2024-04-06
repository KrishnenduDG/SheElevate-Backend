-- CreateTable
CREATE TABLE "Business" (
    "bid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "userName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "profilePic" TEXT NOT NULL,
    "bio" TEXT NOT NULL,
    "productPics" TEXT[],
    "establishedAt" INTEGER NOT NULL,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "BusinessCategoryMapping" (
    "id" TEXT NOT NULL,
    "cid" TEXT NOT NULL,
    "bid" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Business_bid_key" ON "Business"("bid");

-- CreateIndex
CREATE UNIQUE INDEX "Business_userName_key" ON "Business"("userName");

-- CreateIndex
CREATE UNIQUE INDEX "Business_email_key" ON "Business"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Business_phoneNumber_key" ON "Business"("phoneNumber");

-- CreateIndex
CREATE UNIQUE INDEX "BusinessCategoryMapping_id_key" ON "BusinessCategoryMapping"("id");

-- AddForeignKey
ALTER TABLE "BusinessCategoryMapping" ADD CONSTRAINT "BusinessCategoryMapping_cid_fkey" FOREIGN KEY ("cid") REFERENCES "Category"("cid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BusinessCategoryMapping" ADD CONSTRAINT "BusinessCategoryMapping_bid_fkey" FOREIGN KEY ("bid") REFERENCES "Business"("bid") ON DELETE CASCADE ON UPDATE CASCADE;
