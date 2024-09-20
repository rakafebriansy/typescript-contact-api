import { Address } from "@prisma/client"

export type AddressResource = {
    id: number,
    street?: string | null,
    city?: string | null,
    province?: string | null,
    country?: string | null,
    postal_code: string
}

export type CreateAddressRequest = {
    contact_id: number,
    street?: string,
    city?: string,
    province?: string,
    country: string,
    postal_code: string
}

export function toAddressResource(address: Address): AddressResource {
    return {
        id: address.id,
        street: address.street,
        city: address.city,
        province: address.province,
        country: address.country,
        postal_code: address.postal_code,
    }
}