/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "Inbox" (
    "cloudmailin" TEXT NOT NULL,
    "prompt" TEXT NOT NULL,
    "extracted" TEXT NOT NULL,
    "send_to" TEXT NOT NULL,

    CONSTRAINT "Inbox_pkey" PRIMARY KEY ("cloudmailin")
);
