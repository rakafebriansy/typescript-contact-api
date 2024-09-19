import { User } from "@prisma/client";
import { ContactResource, CreateContactRequest, toContactResource } from "../model/contact-model";
import { ContactValidation } from "../validation/contact-validation";
import { Validation } from "../validation/validation";
import { prismaClient } from "../app/database";
import { ResponseError } from "../error/response-error";

export class ContactService {
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
        const contact = await prismaClient.contact.findUnique({
            where: {
                id: id,
                username: user.username
            }
        });

        if(!contact) {
            throw new ResponseError(404, 'Contact not found');
        }

        return toContactResource(contact);
    }
}