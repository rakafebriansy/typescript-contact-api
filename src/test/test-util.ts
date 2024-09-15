import { prismaClient } from "../app/database";
import bcrypt from 'bcrypt';

export class UserTest {
    static async delete() {
        await prismaClient.user.deleteMany({
            where: {
                username: 'test'
            }
        })
    }

    static async create() {
        await prismaClient.user.create({
            data: {
                username: 'test',
                name: 'test',
                password: await bcrypt.hash('12345', 10),
                token: 'test'
            }
        });
    }
}