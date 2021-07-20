/*
  Warnings:

  - You are about to drop the column `purchaserId` on the `ArtPiece` table. All the data in the column will be lost.
  - You are about to drop the column `recieverid` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `senderId` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the `_follows` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_likedArtPieces` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_purchased` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ArtPiece" DROP CONSTRAINT "ArtPiece_likerId_fkey";

-- DropForeignKey
ALTER TABLE "ArtPiece" DROP CONSTRAINT "ArtPiece_purchaserId_fkey";

-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_recieverid_fkey";

-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_senderId_fkey";

-- DropForeignKey
ALTER TABLE "_follows" DROP CONSTRAINT "_follows_A_fkey";

-- DropForeignKey
ALTER TABLE "_follows" DROP CONSTRAINT "_follows_B_fkey";

-- DropForeignKey
ALTER TABLE "_likedArtPieces" DROP CONSTRAINT "_likedArtPieces_A_fkey";

-- DropForeignKey
ALTER TABLE "_likedArtPieces" DROP CONSTRAINT "_likedArtPieces_B_fkey";

-- DropForeignKey
ALTER TABLE "_purchased" DROP CONSTRAINT "_purchased_A_fkey";

-- DropForeignKey
ALTER TABLE "_purchased" DROP CONSTRAINT "_purchased_B_fkey";

-- AlterTable
ALTER TABLE "ArtPiece" DROP COLUMN "purchaserId";

-- AlterTable
ALTER TABLE "Message" DROP COLUMN "recieverid",
DROP COLUMN "senderId";

-- DropTable
DROP TABLE "_follows";

-- DropTable
DROP TABLE "_likedArtPieces";

-- DropTable
DROP TABLE "_purchased";
