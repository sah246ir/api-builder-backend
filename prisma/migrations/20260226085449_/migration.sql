/*
  Warnings:

  - A unique constraint covering the columns `[endpoint,project_id]` on the table `Api` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX `ApiEndpoint_endpoint_project_id_method_key` ON `ApiEndpoint`;

-- CreateIndex
CREATE UNIQUE INDEX `Api_endpoint_project_id_key` ON `Api`(`endpoint`, `project_id`);
