-- DropForeignKey
ALTER TABLE `Deployment` DROP FOREIGN KEY `Deployment_api_id_fkey`;

-- AddForeignKey
ALTER TABLE `Deployment` ADD CONSTRAINT `Deployment_api_id_fkey` FOREIGN KEY (`api_id`) REFERENCES `Api`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
