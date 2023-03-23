/*
  Warnings:

  - A unique constraint covering the columns `[menuId,cartId]` on the table `CartItem` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "CartItem_menuId_cartId_key" ON "CartItem"("menuId", "cartId");
