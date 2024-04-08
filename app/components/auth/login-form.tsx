"use client";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import CardWrapper from "./card-wrapper";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema } from "@/schemas/login";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChevronRight, Loader2, LogIn } from "lucide-react";
import { login } from "@/actions/login";
import { useState } from "react";
import MessageResponse from "./message-response";
import { useRouter } from "next/navigation";
import GoogleButton from "./google-button";

const LoginForm = () => {
  const form = useForm({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  const [message, setMessage] = useState<string | { message: string } | null>(null);
  const router = useRouter();

  const onSubmit = async (values: z.infer<typeof LoginSchema>) => {
    const resp = await login(values);
    if (resp.success) {
      router.replace("/dashboard");
    }else{
      setMessage(resp.error || resp.message || "An error occurred");
    }
  };
  return (
    <CardWrapper>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="jondoe@mail.cl" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="******" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {message !== "Success" && message && <MessageResponse msg={typeof message === 'string' ? message : message?.message || ""} />}
          <div className="flex flex-col mt-6">
            {isLoading ? (
              <Button disabled={isLoading} variant={"primary"} className="w-full">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </Button>
            ) : (
              <Button type="submit" variant={"primary"} className="w-full">
                Login <LogIn className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        </form>
       
      </Form>
       <GoogleButton />
    </CardWrapper>
  );
};

export default LoginForm;
