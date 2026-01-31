/*
  Warnings:

  - You are about to drop the column `category` on the `Medicine` table. All the data in the column will be lost.
  - Added the required column `categoryId` to the `Medicine` table without a default value. This is not possible if the table is not empty.
  - Added the required column `manufacturer` to the `Medicine` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Medicine" DROP COLUMN "category",
ADD COLUMN     "categoryId" TEXT NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "image" TEXT,
ADD COLUMN     "manufacturer" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");

-- AddForeignKey
ALTER TABLE "Medicine" ADD CONSTRAINT "Medicine_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
