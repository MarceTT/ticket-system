import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { databse } from "./prismadb";
import {
  generateUploadButton,
  generateUploadDropzone,
} from "@uploadthing/react";
import type { OurFileRouter } from "@/app/api/uploadthing/core";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

 
export const UploadButton = generateUploadButton<OurFileRouter>();
export const UploadDropzone = generateUploadDropzone<OurFileRouter>();


export const getUserByEmail = async (email: string) => {
 try {
  const lowerEmail = email.toLowerCase();
  const user = await databse.user.findFirst({
    where: {
      email: lowerEmail
    }
  });

  return user;
  
 } catch (error) {
  return null;
  
 }
}

export const getUserById = async (id: string) => {
  try {
    const user = await databse.user.findUnique({
      where: {
        id
      }
    });
  
    return user;
  } catch (error) {
    return null;
    
  }
}


export const formatdDate = (inputDate: Date): string => {
  const date = new Date(inputDate);
  const options: Intl.DateTimeFormatOptions = { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "numeric", timeZone: "America/Santiago" };
  const formattedDate : string = date.toLocaleDateString("en-US", options);
  return formattedDate;
}