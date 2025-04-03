-- AddForeignKey
ALTER TABLE `user` ADD CONSTRAINT `user_prankId_fkey` FOREIGN KEY (`prankId`) REFERENCES `prank`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
