import { User } from "@prisma/client";
import { ContactResource, CreateContactRequest, toContactResource } from "../model/contact-model";
import { ContactValidation } from "../validation/contact-validation";
import { Validation } from "../validation/validation";
import { prismaClient } from "../app/database";

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
}