/*
  Warnings:

  - You are about to drop the `WorkspaceUserMapping` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `uid` to the `Workspace` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "WorkspaceUserMapping" DROP CONSTRAINT "WorkspaceUserMapping_uid_fkey";

-- DropForeignKey
ALTER TABLE "WorkspaceUserMapping" DROP CONSTRAINT "WorkspaceUserMapping_wid_fkey";

-- AlterTable
ALTER TABLE "Workspace" ADD COLUMN     "uid" TEXT NOT NULL;

-- DropTable
DROP TABLE "WorkspaceUserMapping";

-- AddForeignKey
ALTER TABLE "Workspace" ADD CONSTRAINT "Workspace_uid_fkey" FOREIGN KEY ("uid") REFERENCES "User"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;
