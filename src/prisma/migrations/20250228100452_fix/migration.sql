/*
  Warnings:

  - You are about to drop the column `userId` on the `Database` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `Database` DROP FOREIGN KEY `Database_userId_fkey`;

-- AlterTable
ALTER TABLE `Database` DROP COLUMN `userId`;

-- AddForeignKey
ALTER TABLE `Database` ADD CONSTRAINT `Database_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
