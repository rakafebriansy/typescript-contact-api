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

describe('GET /api/contacts/:contactId', () => {
    beforeEach(async () => {
        await UserTest.create();
        await ContactTest.create();
    }); 
    afterEach(async () => {
        await ContactTest.deleteAll();
        await UserTest.delete();
    });

    it('should be able get contact', async () => {
        const contact = await ContactTest.get();
        const response = await supertest(web)
        .get('/api/contacts/' + contact.id)
        .set('X-API-TOKEN', 'test');

        expect(response.status).toBe(200);
        expect(response.body.data.id).toBeDefined();
        expect(response.body.data.first_name).toBe(contact.first_name);
        expect(response.body.data.last_name).toBe(contact.last_name);
        expect(response.body.data.email).toBe(contact.email);
        expect(response.body.data.phone).toBe(contact.phone);

    });
    it('should reject get contact if contact is not found', async () => {
        const contact = await ContactTest.get();
        const response = await supertest(web)
        .get('/api/contacts/' + (contact.id + 1))
        .set('X-API-TOKEN', 'test');

        expect(response.status).toBe(404);
        expect(response.body.errors).toBeDefined();
    });
});