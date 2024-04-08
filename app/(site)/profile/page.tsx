"use client";
import { profile } from "@/actions/profile";
import React, { useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import OatuhForm from "../components/user/OatuhForm";
import UserForm from "../components/user/UserForm";

type ProfileProps = {
  params: {
    id: string;
  };
};

const Profile = ({ params }: ProfileProps) => {
  const session = useSession();
  console.log(session);

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-10 mx-auto max-w-7xl">
    <Card className="w-full max-w-3xl">
      <CardHeader>
        <CardTitle>Profile</CardTitle>
        {session.data?.user.isOAuth ? (
          <CardDescription>You can see your profile information.</CardDescription>
        ) : (
          <CardDescription>Update your profile information.</CardDescription>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {session.data?.user.isOAuth ? <OatuhForm /> : <UserForm />}
      </CardContent>
    </Card>
    </div>
  );
};

export default Profile;
