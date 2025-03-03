-- CreateTable
CREATE TABLE "Marks" (
    "id" SERIAL NOT NULL,
    "studentId" INTEGER NOT NULL,
    "type" TEXT NOT NULL,

    CONSTRAINT "Marks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Mark" (
    "id" SERIAL NOT NULL,
    "subject" TEXT NOT NULL,
    "totalMarks" INTEGER NOT NULL,
    "gotMarks" INTEGER NOT NULL,
    "markId" INTEGER NOT NULL,

    CONSTRAINT "Mark_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Marks" ADD CONSTRAINT "Marks_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mark" ADD CONSTRAINT "Mark_markId_fkey" FOREIGN KEY ("markId") REFERENCES "Marks"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
