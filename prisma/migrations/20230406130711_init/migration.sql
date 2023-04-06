/*
  Warnings:

  - Added the required column `group_id` to the `contact` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `contact` ADD COLUMN `group_id` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `contact` ADD CONSTRAINT `contact_group_id_fkey` FOREIGN KEY (`group_id`) REFERENCES `group`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
