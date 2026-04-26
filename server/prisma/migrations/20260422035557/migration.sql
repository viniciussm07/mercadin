/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `Market` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `Market` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Market" ADD COLUMN     "slug" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Market_slug_key" ON "Market"("slug");
