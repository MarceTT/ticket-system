"use client";

import { ColumnDef } from "@tanstack/react-table";
import { TicketList } from "@/types/ticket";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, ArrowUpDown } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { DateTime, Settings } from "luxon";

type ModalProps = {
    onOpenEditModal: (row: TicketList) => void;
    onOpenEditAssignedModal: (row: TicketList) => void;
  };
export const getColumns = ({ onOpenEditModal, onOpenEditAssignedModal }: ModalProps): ColumnDef<TicketList>[] => [
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ cell }) => {
      //const statusColor = cell.row.original.status;

      const formattedDate = new Date(cell.row.original.createdAt).toLocaleDateString('es-ES', {
        day: '2-digit', // Día en dos dígitos
        month: '2-digit', // Mes en dos dígitos
        year: 'numeric', // Año en formato numérico
        hour: '2-digit', // Hora en dos dígitos
        minute: '2-digit', // Minutos en dos dígitos
        hour12: false, // Formato de 12 horas
      });
      return (
        <>
          <Link
            className="font-semibold text-[#2B3064] cursor-pointer hover:underline hover:text-[#1BB68D]"
            href={`/tickets/${cell.row.original.id}`}
          >
            {cell.row.getValue("title")}
          </Link>
          <div className="text-xs flex gap-2 mt-2">
            {cell.row.original.status === "OPEN" ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-1 text-xs font-semibold text-green-600">
                <span className="h-1.5 w-1.5 rounded-full bg-green-600"></span>
                Open
              </span>
            ) : cell.row.original.status === "CLOSED" ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2 py-1 text-xs font-semibold text-red-600">
                <span className="h-1.5 w-1.5 rounded-full bg-red-600"></span>
                Closed
              </span>
            ) : cell.row.original.status === "PROCESS" ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-yellow-50 px-2 py-1 text-xs font-semibold text-yellow-600">
                <span className="h-1.5 w-1.5 rounded-full bg-yellow-600"></span>
                Process
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-600">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-600"></span>
                Finished
              </span>
            )}
            {cell.row.original.priority.name === "Low" ? (
              <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                Low
              </span>
            ) : cell.row.original.priority.name === "Medium" ? (
              <span className="inline-flex items-center rounded-md bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-800 ring-1 ring-inset ring-yellow-600/20">
                Medium
              </span>
            ) : (
              <span className="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10">
                High
              </span>
            )}

            <span className="text-gray-400 font-semibold text-xs mt-1">
              {cell.row.original.category.name}
            </span>
            <span className="mt-1 m-0 mr-0 text-xs">|</span>
            <span className="text-gray-800 font-semibold text-xs mt-1">
              {formattedDate}
            </span>
          </div>
        </>
      );
    },
  },
  {
    accessorFn: (row) => row.assigened.name,
    id: "assignedTo",
    header: "Assigned To",
    cell: ({ cell }) => {
      return (
        <>
          <div className="flex items-center gap-1 px-6 py-4">
            <div className="relative h-10 w-10">
              {cell.row.original.assigened.image && (
                <Image
                  className="h-full w-full rounded-full object-cover object-center"
                  src={cell.row.original.assigened.image}
                  alt="user image"
                  fill={true}
                  sizes="100%"
                />
              )}
            </div>
            <div className="text-sm">
              <div className="font-medium text-gray-700">
                {cell.row.original.assigened.name}
              </div>
              <div className="text-gray-400">
                {cell.row.original.assigened.email}
              </div>
            </div>
          </div>
        </>
      );
    },
  },
  {
    accessorKey: "projectId",
    accessorFn: (row) => row.project.name,
    id: "projectId",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Project
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return (
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
              <Link href={'#'} onClick={() => onOpenEditModal(row.original)}>Edit Ticket</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
                <Link href={'#'} onClick={() => onOpenEditAssignedModal(row.original)}>Edit Assigned</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
      );
    },
  },
];
