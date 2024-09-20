import { User } from "@prisma/client";
import { AddressResource, CreateAddressRequest, toAddressResource } from "../model/address-model";
import { Validation } from "../validation/validation";
import { AddressValidation } from "../validation/address-validation";
import { ContactService } from "./contact-service";
import { prismaClient } from "../app/database";
import { GetAddressRequest } from "../model/contact-model";
import { ResponseError } from "../error/response-error";

export class AddressService {
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

        const address = await prismaClient.address.findFirst({
            where: {
                id: getRequest.id,
                contact_id: getRequest.contact_id,
            }
        });

        if(!address) {
            throw new ResponseError(404, 'Address is not found');
        }

        return toAddressResource(address);
    }
}