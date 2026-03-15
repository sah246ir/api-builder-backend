-- CreateTable
CREATE TABLE `Deployment` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `api_id` INTEGER NOT NULL,
    `version` INTEGER NOT NULL,
    `namespace` VARCHAR(191) NOT NULL,
    `deployment_name` VARCHAR(191) NOT NULL,
    `status` ENUM('pending', 'deploying', 'deployed', 'failed') NOT NULL,
    `initiated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `completed_at` DATETIME(3) NULL,
    `failure_reason` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DeploymentLog` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `deployment_id` INTEGER NOT NULL,
    `level` ENUM('INFO', 'WARN', 'ERROR') NOT NULL,
    `message` VARCHAR(191) NOT NULL,
    `source` ENUM('SYSTEM', 'DEPLOYMENT', 'POD', 'WORKER') NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `DeploymentLog_deployment_id_idx`(`deployment_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Deployment` ADD CONSTRAINT `Deployment_api_id_fkey` FOREIGN KEY (`api_id`) REFERENCES `Api`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DeploymentLog` ADD CONSTRAINT `DeploymentLog_deployment_id_fkey` FOREIGN KEY (`deployment_id`) REFERENCES `Deployment`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
