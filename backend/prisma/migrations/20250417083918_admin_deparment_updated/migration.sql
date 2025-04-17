-- AlterTable
ALTER TABLE "Admin" ALTER COLUMN "department" DROP NOT NULL,
ALTER COLUMN "department" SET DEFAULT 'admin';
