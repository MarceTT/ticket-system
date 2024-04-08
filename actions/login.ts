"use server";

import * as z from "zod";
import { databse } from "@/lib/prismadb";
import { LoginSchema } from "@/schemas/login";
import { getUserByEmail } from "@/lib/utils";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";

export const login = async (data: z.infer<typeof LoginSchema>) => {
   
    try {
        const validData = LoginSchema.safeParse(data);

        if(!validData.success) {
            return { error: "Invalid data", success: false};
        }
    
        const { email, password } = validData.data;
    
        const userExists = await getUserByEmail(email);
    
        if(!userExists) {
            return { error : "User not found", success: false}
        }
        await signIn("credentials", {
            email : email,
            password : password,
            redirect : false
        });
        return {message : "Success", success: true};
    } catch (error) {
        if((error as any).type === "CredentialsSignin") {
            return { message: "Invalid credentials", success: false };
        }

        return { message: "An error occurred", success: false };
        
    }
};