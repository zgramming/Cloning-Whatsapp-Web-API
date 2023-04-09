-- AlterTable
ALTER TABLE `message` ADD COLUMN `message_replied_id` VARCHAR(191) NULL,
    ADD COLUMN `status` ENUM('PENDING', 'DELIVERED', 'READ') NOT NULL DEFAULT 'PENDING';

-- AddForeignKey
ALTER TABLE `message` ADD CONSTRAINT `message_message_replied_id_fkey` FOREIGN KEY (`message_replied_id`) REFERENCES `message`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
