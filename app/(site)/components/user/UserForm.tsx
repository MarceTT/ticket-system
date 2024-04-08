"use client";
import { ProfileSchema } from "@/schemas/profile";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { useSession } from "next-auth/react";

const UserForm = () => {
  const session = useSession();
  const form = useForm({
    resolver: zodResolver(ProfileSchema),
    defaultValues: {
      name: "",
      email: "",
      role: "",
      image: undefined,
    },
  });
  const isLoading = form.formState.isSubmitting;
  const { setValue } = form;

  useEffect(() => {
    if (session) {
      setValue("name", session.data?.user.name ?? ""),
        setValue("email", session.data?.user.email ?? "");
      setValue("role", session.data?.user.role ?? "");
    }
  }, [session.data]);

  const onSubmit = async (values: z.infer<typeof ProfileSchema>) => {
    console.log(values);
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="shadcn" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="space-y-2">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="shadcn" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="space-y-2">
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <FormControl>
                    <Input disabled placeholder="shadcn" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="space-y-2">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image</FormLabel>
                  <FormControl>
                    <Image
                      src={session.data?.user.image || ""}
                      alt="user image"
                      className="w-20 h-20 rounded-full"
                      width={80}
                      height={80}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <Button type="submit" variant={"primary"}>Edit Profile</Button>
      </form>
    </Form>
  );
};

export default UserForm;
