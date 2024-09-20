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