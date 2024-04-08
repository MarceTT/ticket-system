"use client";

import { auth } from "@/auth";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSession } from "next-auth/react";
import Image from "next/image";
const OatuhForm = () => {
  const session = useSession();
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input disabled id="name" value={session.data?.user.name} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input disabled id="email" value={session.data?.user.email} type="email" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="phone">Role</Label>
        <Input disabled id="phone" value={session.data?.user.role} />
      </div>
      <div className="space-y-2">
        <Label>Image</Label>
        {session.data?.user.image ? (
          <Image
            src={session.data?.user.image}
            alt="user image"
            className="w-20 h-20 rounded-full"
            width={80}
            height={80}
          />
        ) : (
          <div className="w-20 h-20 rounded-full bg-gray-200"></div>
        )}
      </div>
    </div>
  );
};

export default OatuhForm;
