/*
  Warnings:

  - You are about to drop the column `authorId` on the `ArtPiece` table. All the data in the column will be lost.
  - You are about to drop the column `content` on the `ArtPiece` table. All the data in the column will be lost.
  - You are about to drop the `Profile` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `artistId` to the `ArtPiece` table without a default value. This is not possible if the table is not empty.
  - Added the required column `colors` to the `ArtPiece` table without a default value. This is not possible if the table is not empty.
  - Added the required column `materials` to the `ArtPiece` table without a default value. This is not possible if the table is not empty.
  - Added the required column `medium` to the `ArtPiece` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Colors" AS ENUM ('blue', 'red', 'yellow', 'green', 'cyan');

-- CreateEnum
CREATE TYPE "Medium" AS ENUM ('Physical', 'Digital', 'Both');

-- CreateEnum
CREATE TYPE "Materials" AS ENUM ('pastels', 'crayons', 'oil');

-- DropForeignKey
ALTER TABLE "ArtPiece" DROP CONSTRAINT "ArtPiece_authorId_fkey";

-- DropForeignKey
ALTER TABLE "Profile" DROP CONSTRAINT "Profile_userId_fkey";

-- AlterTable
ALTER TABLE "ArtPiece" DROP COLUMN "authorId",
DROP COLUMN "content",
ADD COLUMN     "artistId" INTEGER NOT NULL,
ADD COLUMN     "caption" TEXT,
ADD COLUMN     "colors" "Colors" NOT NULL,
ADD COLUMN     "height" DOUBLE PRECISION,
ADD COLUMN     "imageContent" BYTEA,
ADD COLUMN     "length" DOUBLE PRECISION,
ADD COLUMN     "materials" "Materials" NOT NULL,
ADD COLUMN     "medium" "Medium" NOT NULL,
ADD COLUMN     "price" DOUBLE PRECISION,
ADD COLUMN     "recievedStatus" BOOLEAN,
ADD COLUMN     "videoContent" BYTEA,
ADD COLUMN     "width" DOUBLE PRECISION,
ADD COLUMN     "yearCompleted" INTEGER,
ALTER COLUMN "title" DROP NOT NULL;

-- DropTable
DROP TABLE "Profile";

-- AddForeignKey
ALTER TABLE "ArtPiece" ADD FOREIGN KEY ("artistId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
