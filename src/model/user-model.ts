import { User } from "@prisma/client"

export type UserResource = {
    username: string,
    name: string,
    token?: string
}

export type CreateUserRequest = {
    username: string,
    name: string,
    password: string,
}

export function toUserResource (user: User): UserResource {
    return {
        name: user.name,
        username: user.username
    }
}