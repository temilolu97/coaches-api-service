/*
  Warnings:

  - You are about to drop the column `endDate` on the `Courses` table. All the data in the column will be lost.
  - You are about to drop the column `startDate` on the `Courses` table. All the data in the column will be lost.
  - Added the required column `description` to the `Courses` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Courses` DROP COLUMN `endDate`,
    DROP COLUMN `startDate`,
    ADD COLUMN `description` VARCHAR(191) NOT NULL;
