/*
  Warnings:

  - You are about to drop the column `type` on the `Message` table. All the data in the column will be lost.
  - Added the required column `userId` to the `Project` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Message" DROP COLUMN "type";

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "userId" INTEGER NOT NULL;

-- DropEnum
DROP TYPE "MessageType";

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
