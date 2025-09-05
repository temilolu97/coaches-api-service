/*
  Warnings:

  - You are about to alter the column `providerResponse` on the `Payments` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Json`.

*/
-- AlterTable
ALTER TABLE `Payments` MODIFY `providerResponse` JSON NULL;
