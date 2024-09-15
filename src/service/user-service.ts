import { prismaClient } from "../app/database";
import { ResponseError } from "../error/response-error";
import { CreateUserRequest, toUserResource, UserResource } from "../model/user-model";
import { UserValidation } from "../validation/user-validation";
import { Validation } from "../validation/validation";
import brcypt from "bcrypt";

export class UserService {

    
    static async register(request: CreateUserRequest): Promise<UserResource> {
        const registerRequest = Validation.validate(UserValidation.REGISTER, request);

        const totalUserWithSameUsername = await prismaClient.user.count({
            where: {
                username: registerRequest.username
            }
        });

        if(totalUserWithSameUsername != 0) {
            throw new ResponseError(400, 'Username is already registered');
        }

        registerRequest.password = await brcypt.hash(registerRequest.password,10)

        const user = await prismaClient.user.create({
            data: registerRequest
        });


        return toUserResource(user);
    }
}