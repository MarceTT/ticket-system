"use client";

import { GetAllUsers } from "@/actions/users";
import React, { useEffect, useState } from "react";
import { Users } from "@/types/users";
import { UserDataTable } from "./data-table";
import { columns } from "./columns";
import SkeletonTable from "../components/SkeletonTable";

const UserList = () => {
  const [userList, setUserList] = useState<Users[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getUsers = async () => {
      try {
        const response = await GetAllUsers();
        setUserList(response as unknown as Users[]);
      } catch (error) {
        console.error("Failed to fetch users", error);
        setUserList([]); // Establece userList a un arreglo vacío en caso de error
      } finally {
        setIsLoading(false); // Carga completada o fallida, detener el indicador de carga
      }
    };
  
    getUsers();
  }, []);


  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-10 mx-auto max-w-7xl">
      <h1 className="text-4xl font-semibold text-center lg:text-left">Users</h1>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
        <div className="flex items-center gap-4">
          <h1 className="font-semibold text-lg justify-center md:text-xl">
            Users Administration
          </h1>
          {/* 
        <Button className="ml-auto" variant="primary">
          <Link href="/tickets/create">
              Create New Ticket
              </Link>
        </Button> */}
        </div>
        <div className="flex flex-col gap-4">
        {isLoading ? (
          <SkeletonTable /> // Aquí iría tu componente Skeleton
        ) : (
          <UserDataTable data={userList as Users[]} columns={columns} />
          )}
        </div>
      </main>
    </div>
  );
};

export default UserList;
