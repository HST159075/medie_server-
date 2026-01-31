/*
  Warnings:

  - You are about to drop the column `categoryId` on the `Medicine` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `Medicine` table. All the data in the column will be lost.
  - You are about to drop the column `image` on the `Medicine` table. All the data in the column will be lost.
  - You are about to drop the column `manufacturer` on the `Medicine` table. All the data in the column will be lost.
  - You are about to drop the column `address` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `customerId` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `totalPrice` on the `Order` table. All the data in the column will be lost.
  - The `status` column on the `Order` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `emailVerified` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `User` table. All the data in the column will be lost.
  - The `role` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `Category` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Review` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `category` to the `Medicine` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Made the column `password` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Medicine" DROP CONSTRAINT "Medicine_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_customerId_fkey";

-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_customerId_fkey";

-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_medicineId_fkey";

-- AlterTable
ALTER TABLE "Medicine" DROP COLUMN "categoryId",
DROP COLUMN "description",
DROP COLUMN "image",
DROP COLUMN "manufacturer",
ADD COLUMN     "category" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "address",
DROP COLUMN "customerId",
DROP COLUMN "totalPrice",
ADD COLUMN     "userId" TEXT NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'PLACED';

-- AlterTable
ALTER TABLE "User" DROP COLUMN "emailVerified",
DROP COLUMN "status",
ALTER COLUMN "password" SET NOT NULL,
DROP COLUMN "role",
ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'CUSTOMER';

-- DropTable
DROP TABLE "Category";

-- DropTable
DROP TABLE "Review";

-- DropEnum
DROP TYPE "OrderStatus";

-- DropEnum
DROP TYPE "UserStatus";

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
