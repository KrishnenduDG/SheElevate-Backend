/*
  Warnings:

  - You are about to drop the column `userName` on the `Business` table. All the data in the column will be lost.
  - The `address` column on the `Business` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[firebase_uid]` on the table `Business` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `Business` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[username]` on the table `Business` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `coverPic` to the `Business` table without a default value. This is not possible if the table is not empty.
  - Added the required column `firebase_uid` to the `Business` table without a default value. This is not possible if the table is not empty.
  - Added the required column `username` to the `Business` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Business_userName_key";

-- AlterTable
ALTER TABLE "Business" DROP COLUMN "userName",
ADD COLUMN     "coverPic" TEXT NOT NULL,
ADD COLUMN     "firebase_uid" TEXT NOT NULL,
ADD COLUMN     "username" TEXT NOT NULL,
DROP COLUMN "address",
ADD COLUMN     "address" TEXT[];

-- CreateTable
CREATE TABLE "ProductImage" (
    "iid" TEXT NOT NULL,
    "imgUrl" TEXT NOT NULL,
    "caption" TEXT NOT NULL,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "wid" TEXT NOT NULL,

    CONSTRAINT "ProductImage_pkey" PRIMARY KEY ("iid")
);

-- CreateTable
CREATE TABLE "User" (
    "uid" TEXT NOT NULL,
    "firebase_uid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "profilePic" TEXT,
    "showcasePics" TEXT[],
    "bio" TEXT NOT NULL,
    "establishedAt" INTEGER NOT NULL,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "Workspace" (
    "wid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "coverPic" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Workspace_pkey" PRIMARY KEY ("wid")
);

-- CreateTable
CREATE TABLE "WorkspaceCategoryMapping" (
    "id" TEXT NOT NULL,
    "wid" TEXT NOT NULL,
    "cid" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "WorkspaceUserMapping" (
    "id" TEXT NOT NULL,
    "wid" TEXT NOT NULL,
    "uid" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "ProductImage_iid_key" ON "ProductImage"("iid");

-- CreateIndex
CREATE UNIQUE INDEX "User_uid_key" ON "User"("uid");

-- CreateIndex
CREATE UNIQUE INDEX "User_firebase_uid_key" ON "User"("firebase_uid");

-- CreateIndex
CREATE UNIQUE INDEX "User_name_key" ON "User"("name");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_phoneNumber_key" ON "User"("phoneNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Workspace_wid_key" ON "Workspace"("wid");

-- CreateIndex
CREATE UNIQUE INDEX "Workspace_name_key" ON "Workspace"("name");

-- CreateIndex
CREATE UNIQUE INDEX "WorkspaceCategoryMapping_id_key" ON "WorkspaceCategoryMapping"("id");

-- CreateIndex
CREATE UNIQUE INDEX "WorkspaceUserMapping_id_key" ON "WorkspaceUserMapping"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Business_firebase_uid_key" ON "Business"("firebase_uid");

-- CreateIndex
CREATE UNIQUE INDEX "Business_name_key" ON "Business"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Business_username_key" ON "Business"("username");

-- AddForeignKey
ALTER TABLE "ProductImage" ADD CONSTRAINT "ProductImage_wid_fkey" FOREIGN KEY ("wid") REFERENCES "Workspace"("wid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkspaceCategoryMapping" ADD CONSTRAINT "WorkspaceCategoryMapping_wid_fkey" FOREIGN KEY ("wid") REFERENCES "Workspace"("wid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkspaceCategoryMapping" ADD CONSTRAINT "WorkspaceCategoryMapping_cid_fkey" FOREIGN KEY ("cid") REFERENCES "Category"("cid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkspaceUserMapping" ADD CONSTRAINT "WorkspaceUserMapping_wid_fkey" FOREIGN KEY ("wid") REFERENCES "Workspace"("wid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkspaceUserMapping" ADD CONSTRAINT "WorkspaceUserMapping_uid_fkey" FOREIGN KEY ("uid") REFERENCES "User"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;
