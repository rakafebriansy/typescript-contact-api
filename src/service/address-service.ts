import { Address, User } from "@prisma/client";
import { AddressResource, CreateAddressRequest, toAddressResource, UpdateAddressRequest } from "../model/address-model";
import { Validation } from "../validation/validation";
import { AddressValidation } from "../validation/address-validation";
import { ContactService } from "./contact-service";
import { prismaClient } from "../app/database";
import { GetAddressRequest } from "../model/contact-model";
import { ResponseError } from "../error/response-error";

export class AddressService {
    static async checkAddressMustExists(contactId: number, addressId: number): Promise<Address> {
        const address = await prismaClient.address.findFirst({
            where: {
                id: addressId,
                contact_id: contactId,
            }
        });

        if(!address) {
            throw new ResponseError(404, 'Address is not found');
        }

        return address;
    }

    static async create(user: User, request: CreateAddressRequest): Promise<AddressResource> {
        const createRequest = Validation.validate(AddressValidation.CREATE, request);
        await ContactService.checkContactMustExists(user.username, request.contact_id);

        const address = await prismaClient.address.create({
            data: createRequest
        });

        return toAddressResource(address);
    }

    static async get(user: User, request: GetAddressRequest): Promise<AddressResource> {
        const getRequest = Validation.validate(AddressValidation.GET, request);
        await ContactService.checkContactMustExists(user.username, request.contact_id);

        const address = await this.checkAddressMustExists(getRequest.contact_id, getRequest.id);

        return toAddressResource(address);
    }

    static async update(user: User, request: UpdateAddressRequest): Promise<AddressResource> {
        const updateRequest = Validation.validate(AddressValidation.UPDATE, request);
        await ContactService.checkContactMustExists(user.username, request.contact_id);
        await this.checkAddressMustExists(updateRequest.contact_id, updateRequest.id);


        const address = await prismaClient.address.update({
            where: {
                id: updateRequest.id,
                contact_id: updateRequest.contact_id,
            },
            data: updateRequest
        });

        return toAddressResource(address);
    }
}