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

describe('PUT /api/contacts/:contactId', () => {
    beforeEach(async () => {
        await UserTest.create();
        await ContactTest.create();
    }); 
    afterEach(async () => {
        await ContactTest.deleteAll();
        await UserTest.delete();
    });

    it('should be able update contact', async () => {
        const contact = await ContactTest.get();
        const response = await supertest(web)
        .put('/api/contacts/' + contact.id)
        .set('X-API-TOKEN', 'test')
        .send({
            first_name: 'Raka',
            last_name: 'Febrian',
            email: 'raka@example.com',
            phone: '0899999'
        });

        expect(response.status).toBe(200);
        expect(response.body.data.id).toBe(contact.id);
        expect(response.body.data.first_name).toBe('Raka');
        expect(response.body.data.last_name).toBe('Febrian');
        expect(response.body.data.email).toBe('raka@example.com');
        expect(response.body.data.phone).toBe('0899999');

    });
    it('should reject update contact if requests are invalid', async () => {
        const contact = await ContactTest.get();
        const response = await supertest(web)
        .put('/api/contacts/' + contact.id)
        .set('X-API-TOKEN', 'test')
        .send({
            first_name: '',
            last_name: '',
            email: 'raka',
            phone: ''
        });

        expect(response.status).toBe(400);
        expect(response.body.errors).toBeDefined();
    });
});

describe('DELETE /api/contacts/:contactId', () => {
    beforeEach(async () => {
        await UserTest.create();
        await ContactTest.create();
    }); 
    afterEach(async () => {
        await ContactTest.deleteAll();
        await UserTest.delete();
    });

    it('should be able remove contact', async () => {
        const contact = await ContactTest.get();
        const response = await supertest(web)
        .delete('/api/contacts/' + contact.id)
        .set('X-API-TOKEN', 'test');

        expect(response.status).toBe(200);
        expect(response.body.data).toBe('OK');

    });
    it('should reject remove contact if contact is not found', async () => {
        const contact = await ContactTest.get();
        const response = await supertest(web)
        .delete('/api/contacts/' + (contact.id + 1))
        .set('X-API-TOKEN', 'test');

        expect(response.status).toBe(404);
        expect(response.body.errors).toBeDefined();
    });
});

describe('GET /api/contacts', () => {
    beforeEach(async () => {
        await UserTest.create();
        await ContactTest.create();
    }); 
    afterEach(async () => {
        await ContactTest.deleteAll();
        await UserTest.delete();
    });

    it('should be able search contact', async () => {
        const response = await supertest(web)
        .get('/api/contacts')
        .set('X-API-TOKEN', 'test');
        console.log(response.body)

        expect(response.status).toBe(200);
        expect(response.body.data.length).toBe(1);
        expect(response.body.paging.current_page).toBe(1);
        expect(response.body.paging.total_page).toBe(1);
        expect(response.body.paging.size).toBe(1);
    });
    it('should be able search contact using name', async () => {
        const response = await supertest(web)
        .get('/api/contacts')
        .query({
            name: 'es'
        })
        .set('X-API-TOKEN', 'test');

        expect(response.status).toBe(200);
        expect(response.body.data.length).toBe(1);
        expect(response.body.paging.current_page).toBe(1);
        expect(response.body.paging.total_page).toBe(1);
        expect(response.body.paging.size).toBe(1);
    });
    it('should be able search contact using email', async () => {
        const response = await supertest(web)
        .get('/api/contacts')
        .query({
            email: '.com'
        })
        .set('X-API-TOKEN', 'test');

        expect(response.status).toBe(200);
        expect(response.body.data.length).toBe(1);
        expect(response.body.paging.current_page).toBe(1);
        expect(response.body.paging.total_page).toBe(1);
        expect(response.body.paging.size).toBe(1);
    });
    it('should be able search contact with no result', async () => {
        const response = await supertest(web)
        .get('/api/contacts')
        .query({
            name: 'wrong'
        })
        .set('X-API-TOKEN', 'test');

        expect(response.status).toBe(200);
        expect(response.body.data.length).toBe(0);
        expect(response.body.paging.current_page).toBe(1);
        expect(response.body.paging.total_page).toBe(0);
        expect(response.body.paging.size).toBe(1);
    });
});