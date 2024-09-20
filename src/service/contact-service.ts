import { Contact, User } from "@prisma/client";
import { ContactResource, CreateContactRequest, SearchContactRequest, toContactResource, UpdateContactRequest } from "../model/contact-model";
import { ContactValidation } from "../validation/contact-validation";
import { Validation } from "../validation/validation";
import { prismaClient } from "../app/database";
import { ResponseError } from "../error/response-error";
import { Pageable } from "../model/page";

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

    static async remove(user: User, id: number): Promise<ContactResource> {
        await this.checkContactMustExists(user.username, id);

        const contact = await prismaClient.contact.delete({
            where: {
                id: id,
                username: user.username
            }
        });

        return toContactResource(contact);
    }
    static async search(user: User, request: SearchContactRequest): Promise<Pageable<ContactResource>> {
        const searchRequest = Validation.validate(ContactValidation.SEARCH, request);
        const skip = (searchRequest.page - 1) * searchRequest.size;
        const filters = [];

        if(searchRequest.name) {
            filters.push({
                OR: [
                    {
                        first_name: {
                            contains: searchRequest.name
                        }
                    },
                    {
                        last_name: {
                            contains: searchRequest.name
                        }
                    },
                ]
            });
        }

        if(searchRequest.email) {
            filters.push({
                email: {
                    contains: searchRequest.email
                }
            });
        }
        
        if(searchRequest.phone) {
            filters.push({
                phone: {
                    contains: searchRequest.phone
                }
            });
        }

        const contacts = await prismaClient.contact.findMany({
            where: {
                username: user.username,
                AND: filters
            },
            take: searchRequest.size,
            skip: skip
        });

        const total = await prismaClient.contact.count({
            where: {
                username: user.username,
                AND: filters
            }
        });

        return {
            data: contacts.map(contact => toContactResource(contact)),
            paging: {
                current_page: searchRequest.page,
                total_page: Math.ceil(total / searchRequest.size),
                size: searchRequest.size
            }
        };
    }
}