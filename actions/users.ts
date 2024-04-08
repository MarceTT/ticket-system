'use server';

import * as z from "zod";
import { databse } from "@/lib/prismadb";
import { revalidatePath } from "next/cache";



export const GetAllUsers = async () => {

    const users = await databse.user.findMany({})

    revalidatePath("/user-list");

    return users;
}

export const GetUserById = async(idUser: string) => {

    const user = await databse.user.findUnique({
        where: {
            id: idUser

        }
    });

    return user
}

export const UpdateStatusAccont = async (idUser : string, accountState: boolean) => {

   const user = await databse.user.update({
    where: {
        id: idUser
    }, 
    data: {
        stateAccount: accountState
    }
   });

   return { message: "Status updated successfully!", success: true, user};

}