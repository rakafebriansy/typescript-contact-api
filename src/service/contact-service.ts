import { Contact, User } from "@prisma/client";
import { ContactResource, CreateContactRequest, toContactResource, UpdateContactRequest } from "../model/contact-model";
import { ContactValidation } from "../validation/contact-validation";
import { Validation } from "../validation/validation";
import { prismaClient } from "../app/database";
import { ResponseError } from "../error/response-error";

export class ContactService {
    static async checkContactMustExists(username: string, contactId: number): Promise<Contact> {
        const contact = await prismaClient.contact.findUnique({
            where: {
                id: contactId,
                username: username
            }
        });

        if(!contact) {
            throw new ResponseError(404, 'Contact not found');
        }

        return contact;
    }

    static async create(user: User, request: CreateContactRequest): Promise<ContactResource> {
        const createRequest = Validation.validate(ContactValidation.CREATE, request);
        const record = {
            ...createRequest,
            ...{username: user.username}
        }

        const contact = await prismaClient.contact.create({
            data: record
        });

        return toContactResource(contact);
    }

    static async get(user: User, id: number): Promise<ContactResource> {
        const contact = await this.checkContactMustExists(user.username, id)

        return toContactResource(contact);
    }

    static async update(user: User, request: UpdateContactRequest): Promise<ContactResource> {
        const updateRequest = Validation.validate(ContactValidation.UPDATE, request);
        await this.checkContactMustExists(user.username, updateRequest.id);

        const contact = await prismaClient.contact.update({
            where: {
                id: updateRequest.id,
                username: user.username
            },
            data: updateRequest
        });

        return toContactResource(contact);
    }
}