"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Users } from "@/types/users";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, ShieldCheck, UserCheck } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export const columns: ColumnDef<Users>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "role",
    header: "Role",
    id: "role",
    cell: ({ row }) => {
      return (
        <>
          {row.original.role === "ADMIN" ? (
            <div className="flex  gap-1">
              <ShieldCheck className="h-4 w-4 ml-2 mt-1 text-rose-700" />
              <span className="inline-flex items-center gap-1 rounded-md bg-rose-50 px-2 py-1 text-xs font-semibold text-rose-700">
                <span className="h-1.5 w-1.5 rounded-md bg-rose-700"></span>
                ADMIN
              </span>
            </div>
          ) : (
            <div className="flex gap-1">
              <UserCheck className="h-4 w-4 ml-2 mt-1 text-[#1BB68D]" />
              <span className="inline-flex items-center gap-1 rounded-md bg-green-50 px-2 py-1 text-xs font-semibold text-[#1BB68D]">
                <span className="h-1.5 w-1.5 rounded-md bg-[#1BB68D]"></span>
                USER
              </span>
            </div>
          )}
        </>
      );
    },
  },
  {
    accessorKey: "stateAccount",
    header: "Status",
    cell: ({ row }) => {
      return (
        <>
          {row.original.stateAccount === true ? (
            <Badge className="bg-green-500 text-white text-xs px-2 py-1 rounded-md">
              Active
            </Badge>
          ) : (
            <Badge className="bg-red-500 text-white text-xs px-2 py-1 rounded-md">
              Blocked
            </Badge>
          )}
        </>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return (
        <>
          {row.original.role !== "ADMIN" && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="primary" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem
                  // onClick={() => navigator.clipboard.writeText(row.original.id)}
                  asChild
                >
                  <Link href={`/user-list/${row.original.id}`}>Edit user</Link>
                </DropdownMenuItem>
                {/* <DropdownMenuItem>
                    <Link href={'#'} onClick={() => onOpenEditAssignedModal(row.original)}>Edit Assigned</Link>
                </DropdownMenuItem> */}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </>
      );
    },
  },
];
