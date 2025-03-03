/*
  Warnings:

  - You are about to drop the `Mark` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Mark" DROP CONSTRAINT "Mark_markId_fkey";

-- AlterTable
ALTER TABLE "Marks" ADD COLUMN     "marks" JSONB NOT NULL DEFAULT '{}';

-- DropTable
DROP TABLE "Mark";
