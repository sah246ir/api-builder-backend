-- DropForeignKey
ALTER TABLE `DeploymentLog` DROP FOREIGN KEY `DeploymentLog_deployment_id_fkey`;

-- AddForeignKey
ALTER TABLE `DeploymentLog` ADD CONSTRAINT `DeploymentLog_deployment_id_fkey` FOREIGN KEY (`deployment_id`) REFERENCES `Deployment`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
