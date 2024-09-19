import supertest from "supertest";
import bcrypt from "bcrypt";
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

describe('GET /api/users/current', () => {
    beforeEach(async () => {
        await UserTest.create();
    }); 
    afterEach(async () => {
        await UserTest.delete();
    });

    it('should be able to get user', async () => {
        const response = await supertest(web)
        .get('/api/users/current')
        .set('X-API-TOKEN', 'test');

        expect(response.status).toBe(200);
        expect(response.body.data.username).toBe('test');
        expect(response.body.data.name).toBe('test');
    });

    it('should reject get user if token is invalid', async () => {
        const response = await supertest(web)
        .get('/api/users/current')
        .set('X-API-TOKEN', 'wrong');

        expect(response.status).toBe(401);
        expect(response.body.errors).toBeDefined();
    });

});

describe('PATCH /api/users/current', () => {
    beforeEach(async () => {
        await UserTest.create();
    }); 
    afterEach(async () => {
        await UserTest.delete();
    });

    it('should be able to update user\'s name', async () => {
        const response = await supertest(web)
        .patch('/api/users/current')
        .set('X-API-TOKEN', 'test')
        .send({
            name: 'newname'
        });

        console.log(response.body)

        expect(response.status).toBe(200);
        expect(response.body.data.name).toBe('newname');
    });

    it('should be able to update user\'s password', async () => {
        const response = await supertest(web)
        .patch('/api/users/current')
        .set('X-API-TOKEN', 'test')
        .send({
            password: 'new123',
        });

        expect(response.status).toBe(200);

        const user = await UserTest.get();
        expect(await bcrypt.compare('new123', user.password)).toBe(true);
    });

    it('should reject update user if requests are invalid', async () => {
        const response = await supertest(web)
        .patch('/api/users/current')
        .set('X-API-TOKEN', 'test')
        .send({
            password: '',
            name: ''
        });

        expect(response.status).toBe(400);
        expect(response.body.errors).toBeDefined();
    });

    it('should reject update user if token is invalid', async () => {
        const response = await supertest(web)
        .patch('/api/users/current')
        .set('X-API-TOKEN', 'wrong')
        .send({
            password: 'new',
            name: 'new'
        });

        expect(response.status).toBe(401);
        expect(response.body.errors).toBeDefined();
    });

});

describe('DELETE /api/users/current', () => {
    beforeEach(async () => {
        await UserTest.create();
    }); 
    afterEach(async () => {
        await UserTest.delete();
    });

    it('should be able to logout', async () => {
        const response = await supertest(web)
        .delete('/api/users/current')
        .set('X-API-TOKEN', 'test');

        expect(response.status).toBe(200);
        expect(response.body.data).toBe('OK');

        const user = await UserTest.get();
        expect(user.token).toBeNull();
    });

    it('should reject logout user if token is wrong', async () => {
        const response = await supertest(web)
        .get('/api/users/current')
        .set('X-API-TOKEN', 'wrong');

        expect(response.status).toBe(401);
        expect(response.body.errors).toBeDefined();
    });

});