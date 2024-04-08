"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import AuthHeader from "./auth-header";

interface CardWrapperProps {
    children: React.ReactNode;
}

const CardWrapper = ({children}: CardWrapperProps) => {
  return (
    <div className="relative flex flex-col justify-center items-center min-h-screen overflow-hidden">
      <div className="absolute inset-0 z-[-1] bg-gradient-to-r from-[#0A0F55] to-[#0C105A]" />
      <div className="absolute inset-0 z-[-1] bg-gradient-to-r from-[#0A0F55] to-[#0C105A] filter blur-3xl" />
      <div className="w-full mx-auto bg-white lg:max-w-lg rounded-md sm:w-screen">
        <Card>
          <CardHeader>
            <AuthHeader />
          </CardHeader>
          <CardContent className="grid gap-4">
            {children}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CardWrapper;
