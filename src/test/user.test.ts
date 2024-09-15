import supertest from "supertest";
import { web } from "../app/web";
import { UserTest } from "./test-util";

describe('POST /api/users', () => {
    afterEach(async () => {
        await UserTest.delete();
    });

    it('should register new user', async () => {
        const response = await supertest(web)
        .post('/api/users')
        .send({
            username: 'test',
            password: '12345',
            name: 'test',
        });

        expect(response.status).toBe(200);
        expect(response.body.data.username).toBe('test');
        expect(response.body.data.name).toBe('test');
    });
    it('should reject register new user if requests are invalid', async () => {
        const response = await supertest(web)
        .post('/api/users')
        .send({
            username: '',
            password: '',
            name: '',
        });

        expect(response.status).toBe(400);
        expect(response.body.errors).toBeDefined();
    });
});

describe('POST /api/users/login', () => {
    beforeEach(async () => {
        await UserTest.create();
    }); 
    afterEach(async () => {
        await UserTest.delete();
    });

    it('should be able to login', async () => {
        const response = await supertest(web)
        .post('/api/users/login')
        .send({
            username: 'test',
            password: '12345'
        });

        expect(response.status).toBe(200);
        expect(response.body.data.username).toBe('test');
        expect(response.body.data.name).toBe('test');
        expect(response.body.data.token).toBeDefined();
    });

    it('should reject login user if username is wrong', async () => {
        const response = await supertest(web)
        .post('/api/users/login')
        .send({
            username: 'wrong',
            password: '12345'
        });

        expect(response.status).toBe(401);
        expect(response.body.errors).toBeDefined();
    });

    it('should reject login user if password is wrong', async () => {
        const response = await supertest(web)
        .post('/api/users/login')
        .send({
            username: 'test',
            password: 'wrong'
        });

        expect(response.status).toBe(401);
        expect(response.body.errors).toBeDefined();
    });
});
