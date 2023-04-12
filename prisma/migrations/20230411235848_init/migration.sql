/*
  Warnings:

  - You are about to drop the column `group_id` on the `contact` table. All the data in the column will be lost.
  - You are about to drop the column `group_id` on the `message` table. All the data in the column will be lost.
  - You are about to drop the `group` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `group_member` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `conversation_id` to the `contact` table without a default value. This is not possible if the table is not empty.
  - Added the required column `conversation_id` to the `message` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `contact` DROP FOREIGN KEY `contact_group_id_fkey`;

-- DropForeignKey
ALTER TABLE `group` DROP FOREIGN KEY `group_last_sender_fkey`;

-- DropForeignKey
ALTER TABLE `group_member` DROP FOREIGN KEY `group_member_group_id_fkey`;

-- DropForeignKey
ALTER TABLE `group_member` DROP FOREIGN KEY `group_member_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `message` DROP FOREIGN KEY `message_group_id_fkey`;

-- AlterTable
ALTER TABLE `contact` DROP COLUMN `group_id`,
    ADD COLUMN `conversation_id` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `message` DROP COLUMN `group_id`,
    ADD COLUMN `conversation_id` VARCHAR(191) NOT NULL;

-- DropTable
DROP TABLE `group`;

-- DropTable
DROP TABLE `group_member`;

-- CreateTable
CREATE TABLE `conversation` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `code` VARCHAR(255) NOT NULL,
    `type` ENUM('PRIVATE', 'PUBLIC', 'GROUP') NOT NULL,
    `avatar` VARCHAR(191) NULL,
    `last_msg` VARCHAR(191) NULL,
    `last_sender` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `conversation_code_key`(`code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `conversation_participant` (
    `id` VARCHAR(191) NOT NULL,
    `conversation_id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `join_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `leave_at` DATETIME(3) NULL,
    `is_pinned` BOOLEAN NOT NULL DEFAULT false,
    `is_archived` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `conversation_participant_conversation_id_user_id_key`(`conversation_id`, `user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `contact` ADD CONSTRAINT `contact_conversation_id_fkey` FOREIGN KEY (`conversation_id`) REFERENCES `conversation`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `conversation` ADD CONSTRAINT `conversation_last_sender_fkey` FOREIGN KEY (`last_sender`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `conversation_participant` ADD CONSTRAINT `conversation_participant_conversation_id_fkey` FOREIGN KEY (`conversation_id`) REFERENCES `conversation`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `conversation_participant` ADD CONSTRAINT `conversation_participant_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `message` ADD CONSTRAINT `message_conversation_id_fkey` FOREIGN KEY (`conversation_id`) REFERENCES `conversation`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
