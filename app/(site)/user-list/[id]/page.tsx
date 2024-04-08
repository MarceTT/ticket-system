"use client";

import { GetUserById, UpdateStatusAccont } from "@/actions/users";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { UserDetail } from "@/types/users";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { EyeOff, TriangleAlert } from "lucide-react";
import SkeletonTicketDetail from "../../components/SkeletonTicketDetail";
import { toast } from "sonner";

const UserEdit = () => {
  const params = useParams<{ id: string }>();
  const id = params?.id ?? "";
  const [dataUser, setDataUser] = useState<UserDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isBlocked, setIsBlocked] = useState<boolean | undefined>(undefined);


  useEffect(() => {
    const GetDetailUser = async () => {
      const response = await GetUserById(id);
      setDataUser(response as unknown as UserDetail);
      setLoading(false);
    };
    if (id) {
    GetDetailUser();
    }
  }, [id]);

  useEffect(() => {
    if (dataUser) {
      setIsBlocked(dataUser?.stateAccount); // Asegúrate de que esta propiedad refleje el estado de bloqueo
    }
  }, [dataUser]);


  const handleBlockToggle = async () => {
    try {
      // Suponiendo que 'userId' es el ID del usuario que quieres bloquear/desbloquear
      const updatedStatus = !isBlocked;
      const response = await UpdateStatusAccont(dataUser?.id as string, updatedStatus);
      
      // Actualiza el estado según la respuesta del servidor
      if (response.success) {
        toast.success(response.message, {
          duration: 2000,
          position: "top-center",
        });
        setIsBlocked(updatedStatus);
      } else {
        throw new Error('No se pudo cambiar el estado de bloqueo del usuario');
      }
    } catch (error) {
      console.error(error);
      // Aquí podrías establecer algún estado de error para mostrar un mensaje al usuario
    }
  };


  return (
    <>
    {loading ? (
      <SkeletonTicketDetail />
    ):(
      <div className="flex space-y-4 p-4 items-center justify-center mt-6">
      <Card className="w-full items-center justify-center">
        <CardHeader>
          <CardTitle>User Account</CardTitle>
          <CardDescription>
            View the details bewlo account settings.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="col-span-8 overflow-hidden rounded-xl sm:bg-white sm:px-8 ">
            <p className="py-2 text-xl font-semibold">Email Address</p>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <p className="text-gray-600">
                The email address is <strong>{dataUser?.email}</strong>
              </p>
              {/* <button className="inline-flex text-sm font-semibold text-blue-600 underline decoration-2">
                Change
              </button> */}
            </div>
            {dataUser?.password !== null && (
              <>
                <hr className="mt-4 mb-8" />
                <p className="py-2 text-xl font-semibold">Password</p>
                <div className="flex items-center">
                  <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-3">
                    <label>
                      <span className="text-sm text-gray-500">
                        Current Password
                      </span>
                      <div className="relative flex overflow-hidden rounded-md border-2 transition focus-within:border-blue-600">
                        <input
                          type="password"
                          id="login-password"
                          className="w-full flex-shrink appearance-none border-gray-300 bg-white py-2 px-4 text-base text-gray-700 placeholder-gray-400 focus:outline-none"
                          placeholder="***********"
                        />
                      </div>
                    </label>
                    <label>
                      <span className="text-sm text-gray-500">
                        New Password
                      </span>
                      <div className="relative flex overflow-hidden rounded-md border-2 transition focus-within:border-blue-600">
                        <input
                          type="password"
                          id="login-password-repeat"
                          className="w-full flex-shrink appearance-none border-gray-300 bg-white py-2 px-4 text-base text-gray-700 placeholder-gray-400 focus:outline-none"
                          placeholder="***********"
                        />
                      </div>
                    </label>
                  </div>
                  <EyeOff className="mt-5 ml-2 h-6 w-6 cursor-pointer text-sm font-semibold text-gray-600 underline decoration-2" />
                </div>
                <p className="mt-2">
                  Can't remember your current password.{" "}
                  <a
                    className="text-sm font-semibold text-blue-600 underline decoration-2"
                    href="#"
                  >
                    Recover Account
                  </a>
                </p>
                <Button
                  className="mt-4 rounded-lgpx-4 py-2 text-white"
                  variant={"primary"}
                >
                  Save Password
                </Button>
              </>
            )}
            <hr className="mt-4 mb-8" />

            <div className="mb-10">
              <p className="py-2 text-xl font-semibold">Block Account</p>
              <p className="inline-flex items-center rounded-md bg-rose-100 px-4 py-1 text-rose-600">
                <TriangleAlert className="mr-2 h-5 w-5" />
                Proceed with caution
              </p>
              <p className="mt-2">
                Make sure you have taken backup of your account in case you ever
                need to get access to your data. We will completely wipe your
                data. There is no way to access your account after this action.
              </p>
              <div className="flex items-center space-x-2 mt-4">
                <Switch 
                id="block-user"
                checked={!isBlocked}
                onCheckedChange={handleBlockToggle}
                 />
                <Label
                  htmlFor="block-user"
                  className="ml-auto text-sm font-semibold text-rose-600"
                >
                  Continue with block
                </Label>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter></CardFooter>
      </Card>
    </div>
    )}
    
    </>
  );
};

export default UserEdit;
