import supertest from "supertest";
import { ContactTest, UserTest } from "./test-util";
import { web } from "../app/web";

describe('POST /api/contacts', () => {
    beforeEach(async () => {
        await UserTest.create();
    }); 
    afterEach(async () => {
        await ContactTest.deleteAll();
        await UserTest.delete();
    });

    it('should create new contact', async () => {
        const response = await supertest(web)
        .post('/api/contacts')
        .set('X-API-TOKEN', 'test')
        .send({
            first_name: 'Raka',
            last_name: 'Febrian',
            email: 'raka@test.com',
            phone: '08123456789',
        });

        expect(response.status).toBe(200);
        expect(response.body.data.id).toBeDefined();
        expect(response.body.data.first_name).toBe('Raka');
        expect(response.body.data.last_name).toBe('Febrian');
        expect(response.body.data.email).toBe('raka@test.com');
        expect(response.body.data.phone).toBe('08123456789');

    });
    it('should reject create new contact if requests are invalid', async () => {
        const response = await supertest(web)
        .post('/api/contacts')
        .set('X-API-TOKEN', 'test')
        .send({
            first_name: '',
            last_name: '',
            email: 'raka',
            phone: '11112222222223333333444444444',
        });

        expect(response.status).toBe(400);
        expect(response.body.errors).toBeDefined();
    });
});