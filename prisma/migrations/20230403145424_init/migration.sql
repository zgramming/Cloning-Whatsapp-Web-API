-- AlterTable
ALTER TABLE `group` ADD COLUMN `last_sender` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `group` ADD CONSTRAINT `group_last_sender_fkey` FOREIGN KEY (`last_sender`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
