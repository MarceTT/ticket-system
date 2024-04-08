import { boolean } from "zod";

export interface Users {
    id: string,
    name: string,
    email: string,
    image: string,
    stateAccount: boolean,
    role: string,
    createdAt: string,
    updatedAt: string
}

export interface UserDetail {
    id: string,
    name: string,
    email: string,
    image: string,
    role: string,
    stateAccount: boolean,
    password:string,
    createdAt: string,
    updatedAt: string
}
