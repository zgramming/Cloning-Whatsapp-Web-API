/*
  Warnings:

  - Added the required column `owner_id` to the `contact` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `contact` ADD COLUMN `owner_id` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `contact` ADD CONSTRAINT `contact_owner_id_fkey` FOREIGN KEY (`owner_id`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
