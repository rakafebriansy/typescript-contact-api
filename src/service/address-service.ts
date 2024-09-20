import { User } from "@prisma/client";
import { AddressResource, CreateAddressRequest, toAddressResource } from "../model/address-model";
import { Validation } from "../validation/validation";
import { AddressValidation } from "../validation/address-validation";
import { ContactService } from "./contact-service";
import { prismaClient } from "../app/database";

export class AddressService {
    static async create(user: User, request: CreateAddressRequest): Promise<AddressResource> {
        const createRequest = Validation.validate(AddressValidation.CREATE, request);
        await ContactService.checkContactMustExists(user.username, request.contact_id);

        const address = await prismaClient.address.create({
            data: createRequest
        });

        return toAddressResource(address);
    }
}