/*
  Warnings:

  - A unique constraint covering the columns `[owner_id,user_id]` on the table `contact` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `user_id` to the `contact` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `contact` ADD COLUMN `user_id` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `contact_owner_id_user_id_key` ON `contact`(`owner_id`, `user_id`);

-- AddForeignKey
ALTER TABLE `contact` ADD CONSTRAINT `contact_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
