/*
  Warnings:

  - You are about to drop the column `total` on the `CartItem` table. All the data in the column will be lost.
  - You are about to drop the column `total` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `total` on the `OrderItem` table. All the data in the column will be lost.
  - Added the required column `totalPrice` to the `CartItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalPurchase` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalPrice` to the `OrderItem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CartItem" DROP COLUMN "total",
ADD COLUMN     "totalPrice" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "total",
ADD COLUMN     "totalPurchase" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "OrderItem" DROP COLUMN "total",
ADD COLUMN     "totalPrice" DOUBLE PRECISION NOT NULL;
