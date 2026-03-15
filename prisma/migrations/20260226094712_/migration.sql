-- DropForeignKey
ALTER TABLE `ApiEndpoint` DROP FOREIGN KEY `ApiEndpoint_api_id_fkey`;

-- DropForeignKey
ALTER TABLE `ApiEndpoint` DROP FOREIGN KEY `ApiEndpoint_project_id_fkey`;

-- AddForeignKey
ALTER TABLE `ApiEndpoint` ADD CONSTRAINT `ApiEndpoint_api_id_fkey` FOREIGN KEY (`api_id`) REFERENCES `Api`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ApiEndpoint` ADD CONSTRAINT `ApiEndpoint_project_id_fkey` FOREIGN KEY (`project_id`) REFERENCES `Project`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
