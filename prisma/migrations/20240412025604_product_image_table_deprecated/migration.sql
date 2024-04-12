/*
  Warnings:

  - You are about to drop the `ProductImage` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ProductImage" DROP CONSTRAINT "ProductImage_wid_fkey";

-- AlterTable
ALTER TABLE "Workspace" ADD COLUMN     "productPics" TEXT[];

-- DropTable
DROP TABLE "ProductImage";
