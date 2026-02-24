-- AlterEnum
ALTER TYPE "OrderStatus" ADD VALUE 'PREPARING';

-- AlterTable
ALTER TABLE "products" ADD COLUMN     "category" TEXT DEFAULT 'Uncategorized';
