-- CreateTable
CREATE TABLE `Admin` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(255) NOT NULL,
    `phone` VARCHAR(12) NOT NULL,
    `password` VARCHAR(128) NOT NULL,
    `email` VARCHAR(128) NOT NULL DEFAULT '',
    `date_joined` DATETIME(6) NOT NULL,
    `last_login` DATETIME(6) NOT NULL,
    `is_subscribed` BOOLEAN NOT NULL,
    `tier` ENUM('trial', 'premium', 'super') NOT NULL,

    UNIQUE INDEX `Admin_phone_key`(`phone`),
    UNIQUE INDEX `Admin_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Organization` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `admin_id` INTEGER NOT NULL,

    UNIQUE INDEX `Organization_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Project` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `admin_id` INTEGER NOT NULL,
    `organization_id` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Project_id_key`(`id`),
    UNIQUE INDEX `Project_name_organization_id_key`(`name`, `organization_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RouteGroup` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `parentRoute` VARCHAR(191) NOT NULL,
    `project_id` VARCHAR(191) NOT NULL,
    `admin_id` INTEGER NOT NULL,

    UNIQUE INDEX `RouteGroup_parentRoute_project_id_key`(`parentRoute`, `project_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Route` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `route` VARCHAR(191) NOT NULL,
    `schema_record` VARCHAR(191) NULL,
    `route_group_id` INTEGER NOT NULL,
    `project_id` VARCHAR(191) NOT NULL,
    `admin_id` INTEGER NOT NULL,

    UNIQUE INDEX `Route_route_route_group_id_key`(`route`, `route_group_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Secret` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `project_id` VARCHAR(191) NOT NULL,
    `key` VARCHAR(191) NOT NULL,
    `value` VARCHAR(191) NOT NULL,
    `type` ENUM('database', 'general') NOT NULL,

    UNIQUE INDEX `Secret_project_id_key_key`(`project_id`, `key`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Collection` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `project_id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `default_endpoint` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `schema` JSON NOT NULL,

    UNIQUE INDEX `Collection_name_project_id_key`(`name`, `project_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RequestModel` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `project_id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `type` ENUM('request_body', 'query_params') NOT NULL,
    `schema` JSON NOT NULL,

    UNIQUE INDEX `RequestModel_name_project_id_key`(`name`, `project_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Api` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `project_id` VARCHAR(191) NOT NULL,
    `template` VARCHAR(191) NULL,
    `endpoint` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ApiEndpoint` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `project_id` VARCHAR(191) NOT NULL,
    `api_id` INTEGER NOT NULL,
    `endpoint` VARCHAR(191) NOT NULL,
    `request_body_id` INTEGER NULL,
    `query_params_id` INTEGER NULL,
    `authentication` BOOLEAN NOT NULL,
    `definition` JSON NOT NULL,
    `method` ENUM('GET', 'POST', 'PUT', 'DELETE', 'PATCH') NOT NULL,

    UNIQUE INDEX `ApiEndpoint_request_body_id_key`(`request_body_id`),
    UNIQUE INDEX `ApiEndpoint_query_params_id_key`(`query_params_id`),
    UNIQUE INDEX `ApiEndpoint_endpoint_project_id_method_key`(`endpoint`, `project_id`, `method`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ApiTemplate` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `template` JSON NOT NULL,

    UNIQUE INDEX `ApiTemplate_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Database` (
    `project_id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`project_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Organization` ADD CONSTRAINT `Organization_admin_id_fkey` FOREIGN KEY (`admin_id`) REFERENCES `Admin`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Project` ADD CONSTRAINT `Project_admin_id_fkey` FOREIGN KEY (`admin_id`) REFERENCES `Admin`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Project` ADD CONSTRAINT `Project_organization_id_fkey` FOREIGN KEY (`organization_id`) REFERENCES `Organization`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RouteGroup` ADD CONSTRAINT `RouteGroup_admin_id_fkey` FOREIGN KEY (`admin_id`) REFERENCES `Admin`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RouteGroup` ADD CONSTRAINT `RouteGroup_project_id_fkey` FOREIGN KEY (`project_id`) REFERENCES `Project`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Route` ADD CONSTRAINT `Route_admin_id_fkey` FOREIGN KEY (`admin_id`) REFERENCES `Admin`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Route` ADD CONSTRAINT `Route_project_id_fkey` FOREIGN KEY (`project_id`) REFERENCES `Project`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Route` ADD CONSTRAINT `Route_route_group_id_fkey` FOREIGN KEY (`route_group_id`) REFERENCES `RouteGroup`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Secret` ADD CONSTRAINT `Secret_project_id_fkey` FOREIGN KEY (`project_id`) REFERENCES `Project`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Collection` ADD CONSTRAINT `Collection_project_id_fkey` FOREIGN KEY (`project_id`) REFERENCES `Project`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RequestModel` ADD CONSTRAINT `RequestModel_project_id_fkey` FOREIGN KEY (`project_id`) REFERENCES `Project`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Api` ADD CONSTRAINT `Api_project_id_fkey` FOREIGN KEY (`project_id`) REFERENCES `Project`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Api` ADD CONSTRAINT `Api_template_fkey` FOREIGN KEY (`template`) REFERENCES `ApiTemplate`(`name`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ApiEndpoint` ADD CONSTRAINT `ApiEndpoint_api_id_fkey` FOREIGN KEY (`api_id`) REFERENCES `Api`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ApiEndpoint` ADD CONSTRAINT `ApiEndpoint_project_id_fkey` FOREIGN KEY (`project_id`) REFERENCES `Project`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ApiEndpoint` ADD CONSTRAINT `ApiEndpoint_request_body_id_fkey` FOREIGN KEY (`request_body_id`) REFERENCES `RequestModel`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ApiEndpoint` ADD CONSTRAINT `ApiEndpoint_query_params_id_fkey` FOREIGN KEY (`query_params_id`) REFERENCES `RequestModel`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
