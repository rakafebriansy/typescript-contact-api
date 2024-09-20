import supertest from "supertest";
import { AddressTest, ContactTest, UserTest } from "./test-util";
import { web } from "../app/web";

describe('POST /api/contacts/:contactId/addresses', () => {
    beforeEach(async () => {
        await UserTest.create();
        await ContactTest.create();
    }); 
    afterEach(async () => {
        await AddressTest.deleteAll();
        await ContactTest.deleteAll();
        await UserTest.delete();
    });

    it('should be able to create address', async () => {
        const contact = await ContactTest.get();

        const response = await supertest(web)
        .post(`/api/contacts/${contact.id}/addresses`)
        .set('X-API-TOKEN', 'test')
        .send({
            street: '5th Avenue',
            city: 'Berlin',
            province: 'Reich',
            country: 'Germany',
            postal_code: '51241'
        });

        expect(response.status).toBe(200);
        expect(response.body.data.id).toBeDefined();
        expect(response.body.data.street).toBe('5th Avenue');
        expect(response.body.data.city).toBe('Berlin');
        expect(response.body.data.province).toBe('Reich');
        expect(response.body.data.country).toBe('Germany');
        expect(response.body.data.postal_code).toBe('51241');

    });

    it('should be reject to create address if requests are invalid', async () => {
        const contact = await ContactTest.get();

        const response = await supertest(web)
        .post(`/api/contacts/${contact.id}/addresses`)
        .set('X-API-TOKEN', 'test')
        .send({
            street: '5th Avenue',
            city: 'Berlin',
            province: 'Reich',
            country: '',
            postal_code: ''
        });

        expect(response.status).toBe(400);
        expect(response.body.errors).toBeDefined();
    });

    it('should be reject to create address if contact is not found', async () => {
        const contact = await ContactTest.get();

        const response = await supertest(web)
        .post(`/api/contacts/${contact.id + 1}/addresses`)
        .set('X-API-TOKEN', 'test')
        .send({
            street: '5th Avenue',
            city: 'Berlin',
            province: 'Reich',
            country: 'Germany',
            postal_code: '51241'
        });

        expect(response.status).toBe(404);
        expect(response.body.errors).toBeDefined();
    });
});

describe('GET /api/contacts/:contactId/addresses/:addressId', () => {
    beforeEach(async () => {
        await UserTest.create();
        await ContactTest.create();
        await AddressTest.create();
    }); 
    afterEach(async () => {
        await AddressTest.deleteAll();
        await ContactTest.deleteAll();
        await UserTest.delete();
    });

    it('should be able to get address', async () => {
        const contact = await ContactTest.get();
        const address = await AddressTest.get();

        const response = await supertest(web)
        .get(`/api/contacts/${contact.id}/addresses/${address.id}`)
        .set('X-API-TOKEN', 'test');

        expect(response.status).toBe(200);
        expect(response.body.data.id).toBeDefined();
        expect(response.body.data.street).toBe('5th Avenue');
        expect(response.body.data.city).toBe('Berlin');
        expect(response.body.data.province).toBe('Reich');
        expect(response.body.data.country).toBe('Germany');
        expect(response.body.data.postal_code).toBe('51241');

    });

    it('should be reject to get address if address is not found', async () => {
        const contact = await ContactTest.get();
        const address = await AddressTest.get();

        const response = await supertest(web)
        .get(`/api/contacts/${contact.id}/addresses/${address.id + 1}`)
        .set('X-API-TOKEN', 'test');

        expect(response.status).toBe(404);
        expect(response.body.errors).toBeDefined();
    });

    it('should be reject to get address if contact is not found', async () => {
        const contact = await ContactTest.get();
        const address = await AddressTest.get();

        const response = await supertest(web)
        .get(`/api/contacts/${contact.id + 1}/addresses/${address.id}`)
        .set('X-API-TOKEN', 'test');

        expect(response.status).toBe(404);
        expect(response.body.errors).toBeDefined();
    });
});

describe('PUT /api/contacts/:contactId/addresses/:addressId', () => {
    beforeEach(async () => {
        await UserTest.create();
        await ContactTest.create();
        await AddressTest.create();
    }); 
    afterEach(async () => {
        await AddressTest.deleteAll();
        await ContactTest.deleteAll();
        await UserTest.delete();
    });

    it('should be able to get address', async () => {
        const contact = await ContactTest.get();
        const address = await AddressTest.get();

        const response = await supertest(web)
        .put(`/api/contacts/${contact.id}/addresses/${address.id}`)
        .set('X-API-TOKEN', 'test')
        .send({
            street: 'New Street',
            city: 'New City',
            province: 'New Province',
            country: 'New Country',
            postal_code: '12345'
        });

        expect(response.status).toBe(200);
        expect(response.body.data.id).toBe(address.id);
        expect(response.body.data.street).toBe('New Street');
        expect(response.body.data.city).toBe('New City');
        expect(response.body.data.province).toBe('New Province');
        expect(response.body.data.country).toBe('New Country');
        expect(response.body.data.postal_code).toBe('12345');
    });

    it('should be reject to update address if requests are invalid', async () => {
        const contact = await ContactTest.get();
        const address = await AddressTest.get();

        const response = await supertest(web)
        .put(`/api/contacts/${contact.id}/addresses/${address.id}`)
        .set('X-API-TOKEN', 'test')
        .send({
            street: 'New Street',
            city: 'New City',
            province: 'New Province',
            country: '',
            postal_code: ''
        });

        expect(response.status).toBe(400);
        expect(response.body.errors).toBeDefined();
    });

    it('should be reject to update address if address is not found', async () => {
        const contact = await ContactTest.get();
        const address = await AddressTest.get();

        const response = await supertest(web)
        .put(`/api/contacts/${contact.id}/addresses/${address.id + 1}`)
        .set('X-API-TOKEN', 'test')
        .send({
            street: 'New Street',
            city: 'New City',
            province: 'New Province',
            country: 'New Country',
            postal_code: '12345'
        });

        expect(response.status).toBe(404);
        expect(response.body.errors).toBeDefined();
    });
    it('should be reject to update address if contact is not found', async () => {
        const contact = await ContactTest.get();
        const address = await AddressTest.get();

        const response = await supertest(web)
        .put(`/api/contacts/${contact.id + 1}/addresses/${address.id}`)
        .set('X-API-TOKEN', 'test')
        .send({
            street: 'New Street',
            city: 'New City',
            province: 'New Province',
            country: 'New Country',
            postal_code: '12345'
        });

        expect(response.status).toBe(404);
        expect(response.body.errors).toBeDefined();
    });
});

describe('DELETE /api/contacts/:contactId/addresses/:addressId', () => {
    beforeEach(async () => {
        await UserTest.create();
        await ContactTest.create();
        await AddressTest.create();
    }); 
    afterEach(async () => {
        await AddressTest.deleteAll();
        await ContactTest.deleteAll();
        await UserTest.delete();
    });

    it('should be able to remove address', async () => {
        const contact = await ContactTest.get();
        const address = await AddressTest.get();

        const response = await supertest(web)
        .delete(`/api/contacts/${contact.id}/addresses/${address.id}`)
        .set('X-API-TOKEN', 'test');

        expect(response.status).toBe(200);
        expect(response.body.data).toBe('OK');
    });

    it('should be reject to remove address if address is not found', async () => {
        const contact = await ContactTest.get();
        const address = await AddressTest.get();

        const response = await supertest(web)
        .delete(`/api/contacts/${contact.id}/addresses/${address.id + 1}`)
        .set('X-API-TOKEN', 'test');

        expect(response.status).toBe(404);
        expect(response.body.errors).toBeDefined();
    });
    it('should be reject to remove address if contact is not found', async () => {
        const contact = await ContactTest.get();
        const address = await AddressTest.get();

        const response = await supertest(web)
        .delete(`/api/contacts/${contact.id + 1}/addresses/${address.id}`)
        .set('X-API-TOKEN', 'test');

        expect(response.status).toBe(404);
        expect(response.body.errors).toBeDefined();
    });
});