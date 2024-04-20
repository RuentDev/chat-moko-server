/*
  Warnings:

  - The primary key for the `Conversation` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `Conversation` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - The primary key for the `Message` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `content` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `conversationId` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `media` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `senderId` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Message` table. All the data in the column will be lost.
  - You are about to alter the column `id` on the `Message` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `conversationId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `username` on the `User` table. All the data in the column will be lost.
  - You are about to alter the column `id` on the `User` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to drop the `File` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `channel_id` to the `Conversation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `creator_id` to the `Conversation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `Conversation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `attachement_url` to the `Message` table without a default value. This is not possible if the table is not empty.
  - Added the required column `conversation_id` to the `Message` table without a default value. This is not possible if the table is not empty.
  - Added the required column `message` to the `Message` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sender_id` to the `Message` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `File` DROP FOREIGN KEY `File_messageId_fkey`;

-- DropForeignKey
ALTER TABLE `Message` DROP FOREIGN KEY `Message_conversationId_fkey`;

-- DropForeignKey
ALTER TABLE `Message` DROP FOREIGN KEY `Message_userId_fkey`;

-- DropForeignKey
ALTER TABLE `User` DROP FOREIGN KEY `User_conversationId_fkey`;

-- DropIndex
DROP INDEX `User_username_key` ON `User`;

-- AlterTable
ALTER TABLE `Conversation` DROP PRIMARY KEY,
    ADD COLUMN `channel_id` VARCHAR(191) NOT NULL,
    ADD COLUMN `creator_id` INTEGER NOT NULL,
    ADD COLUMN `deletedAt` DATETIME(3) NULL,
    ADD COLUMN `title` VARCHAR(191) NOT NULL,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    ALTER COLUMN `createdAt` DROP DEFAULT,
    MODIFY `updatedAt` DATETIME(3) NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `Message` DROP PRIMARY KEY,
    DROP COLUMN `content`,
    DROP COLUMN `conversationId`,
    DROP COLUMN `media`,
    DROP COLUMN `senderId`,
    DROP COLUMN `userId`,
    ADD COLUMN `attachement_thumb_url` VARCHAR(191) NULL,
    ADD COLUMN `attachement_url` VARCHAR(191) NOT NULL,
    ADD COLUMN `conversation_id` INTEGER NOT NULL,
    ADD COLUMN `deletedAt` DATETIME(3) NULL,
    ADD COLUMN `message` VARCHAR(191) NOT NULL,
    ADD COLUMN `message_type` ENUM('SINGLE_CHAT', 'GROUP_CHAT') NOT NULL DEFAULT 'SINGLE_CHAT',
    ADD COLUMN `sender_id` INTEGER NOT NULL,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    ALTER COLUMN `createdAt` DROP DEFAULT,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `User` DROP PRIMARY KEY,
    DROP COLUMN `conversationId`,
    DROP COLUMN `username`,
    ADD COLUMN `first_name` VARCHAR(191) NULL,
    ADD COLUMN `is_active` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `is_blocked` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `is_reported` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `last_name` VARCHAR(191) NULL,
    ADD COLUMN `middle_name` VARCHAR(191) NULL,
    ADD COLUMN `participantsId` INTEGER NULL,
    ADD COLUMN `phone` VARCHAR(191) NOT NULL,
    ADD COLUMN `verification_code` VARCHAR(191) NULL,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    MODIFY `password` VARCHAR(191) NULL,
    MODIFY `updatedAt` DATETIME(3) NULL,
    ADD PRIMARY KEY (`id`);

-- DropTable
DROP TABLE `File`;

-- CreateTable
CREATE TABLE `Participants` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `conversation_id` INTEGER NOT NULL,
    `type` ENUM('SINGLE_CHAT', 'GROUP_CHAT') NOT NULL DEFAULT 'SINGLE_CHAT',

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_participantsId_fkey` FOREIGN KEY (`participantsId`) REFERENCES `Participants`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Message` ADD CONSTRAINT `Message_conversation_id_fkey` FOREIGN KEY (`conversation_id`) REFERENCES `Conversation`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
