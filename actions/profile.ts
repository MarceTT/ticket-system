"use server";

import { databse } from "@/lib/prismadb";


export const profile = async (id: string) => {
    const user = await databse.user.findUnique({
        where: {
            id: id
        }
    });
    return user;
}