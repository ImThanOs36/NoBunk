-- DropForeignKey
ALTER TABLE "Marks" DROP CONSTRAINT "Marks_studentId_fkey";

-- AlterTable
ALTER TABLE "Marks" ALTER COLUMN "studentId" SET DATA TYPE TEXT;

-- AddForeignKey
ALTER TABLE "Marks" ADD CONSTRAINT "Marks_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("enrNumber") ON DELETE RESTRICT ON UPDATE CASCADE;
