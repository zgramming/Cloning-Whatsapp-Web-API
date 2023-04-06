/*
  Warnings:

  - You are about to drop the column `user_id` on the `contact` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `contact` DROP FOREIGN KEY `contact_user_id_fkey`;

-- AlterTable
ALTER TABLE `contact` DROP COLUMN `user_id`;
