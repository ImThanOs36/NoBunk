-- First, create the type enum if it doesn't exist
DO $$ BEGIN
    CREATE TYPE "Type" AS ENUM ('LECTURE', 'PRACTICAL');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Drop the existing type column if it exists
ALTER TABLE "Attendance" DROP COLUMN IF EXISTS "type";

-- Add the column back with the correct type and default
ALTER TABLE "Attendance" ADD COLUMN "type" "Type" NOT NULL DEFAULT 'LECTURE'; 