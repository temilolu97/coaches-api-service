/*
  Warnings:

  - You are about to drop the column `courseLevel` on the `Courses` table. All the data in the column will be lost.
  - You are about to drop the `UserCourse` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `level` to the `Courses` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `UserCourse` DROP FOREIGN KEY `UserCourse_courseId_fkey`;

-- DropForeignKey
ALTER TABLE `UserCourse` DROP FOREIGN KEY `UserCourse_userId_fkey`;

-- AlterTable
ALTER TABLE `Courses` DROP COLUMN `courseLevel`,
    ADD COLUMN `endDate` DATETIME(3) NULL,
    ADD COLUMN `level` VARCHAR(191) NOT NULL,
    ADD COLUMN `startDate` DATETIME(3) NULL,
    MODIFY `price` DOUBLE NULL;

-- DropTable
DROP TABLE `UserCourse`;

-- CreateTable
CREATE TABLE `CourseCategories` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `dateCreated` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `dateUpdated` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CourseLevels` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `dateCreated` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `dateUpdated` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Modules` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `order` INTEGER NOT NULL,
    `courseId` INTEGER NOT NULL,
    `content` TEXT NULL,
    `videoUrl` VARCHAR(191) NULL,
    `fileUrl` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Enrollment` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `courseId` INTEGER NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `progress` INTEGER NOT NULL DEFAULT 0,
    `dateEnrolled` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `dateCompleted` DATETIME(3) NULL,

    UNIQUE INDEX `Enrollment_userId_courseId_key`(`userId`, `courseId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Modules` ADD CONSTRAINT `Modules_courseId_fkey` FOREIGN KEY (`courseId`) REFERENCES `Courses`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Enrollment` ADD CONSTRAINT `Enrollment_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `Users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Enrollment` ADD CONSTRAINT `Enrollment_courseId_fkey` FOREIGN KEY (`courseId`) REFERENCES `Courses`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
