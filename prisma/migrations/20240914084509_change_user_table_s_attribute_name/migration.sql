/*
  Warnings:

  - The primary key for the `users` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `usernam` on the `users` table. All the data in the column will be lost.
  - Added the required column `username` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `users` DROP PRIMARY KEY,
    DROP COLUMN `usernam`,
    ADD COLUMN `username` VARCHAR(100) NOT NULL,
    ADD PRIMARY KEY (`username`);
