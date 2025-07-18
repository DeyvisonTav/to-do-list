-- CreateEnum
CREATE TYPE "TaskStatus" AS ENUM ('IN_PROGRESS', 'COMPLETED');

-- AlterTable
ALTER TABLE "Tasks" ADD COLUMN     "status" "TaskStatus" NOT NULL DEFAULT 'IN_PROGRESS';
