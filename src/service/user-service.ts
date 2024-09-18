import { User } from "@prisma/client";
import { prismaClient } from "../app/database";
import { ResponseError } from "../error/response-error";
import { CreateUserRequest, LoginUserRequest, toUserResource, UserResource } from "../model/user-model";
import { UserValidation } from "../validation/user-validation";
import { Validation } from "../validation/validation";
import brcypt from "bcrypt";
import {v4 as uuid} from "uuid";

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

    static async login(request: LoginUserRequest): Promise<UserResource> {
        const loginRequest = Validation.validate(UserValidation.LOGIN, request);

        let user = await prismaClient.user.findUnique({
            where: {
                username: loginRequest.username
            }
        });

        if(!user) {
            throw new ResponseError(401, 'Username or password is wrong');
        }
        
        const isPasswordValid = await brcypt.compare(loginRequest.password, user.password);
        
        if(!isPasswordValid) {
            throw new ResponseError(401, 'Username or password is wrong');
        }

        user = await prismaClient.user.update({
            where: {
                username: loginRequest.username
            },
            data: {
                token: uuid()
            }
        });

        const response = toUserResource(user);
        response.token = user.token!;

        return response;
    }

    static async get(user: User): Promise<UserResource> {
        return toUserResource(user);
    }
}