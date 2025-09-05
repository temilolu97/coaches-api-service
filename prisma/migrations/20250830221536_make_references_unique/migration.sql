/*
  Warnings:

  - A unique constraint covering the columns `[transactionReference]` on the table `Payments` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[providerReference]` on the table `Payments` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Payments_transactionReference_key` ON `Payments`(`transactionReference`);

-- CreateIndex
CREATE UNIQUE INDEX `Payments_providerReference_key` ON `Payments`(`providerReference`);
