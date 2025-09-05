/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `LocalGovernments` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `LocalGovernments_name_key` ON `LocalGovernments`(`name`);
