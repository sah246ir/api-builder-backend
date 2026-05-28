-- AlterTable
ALTER TABLE `DeploymentLog` ADD COLUMN `type` ENUM('success', 'error', 'warning', 'info', 'log') NULL;
