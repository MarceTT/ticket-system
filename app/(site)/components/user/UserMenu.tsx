"use client";
import { Badge } from "@/components/ui/badge";
import { Bell, CirclePlus, HomeIcon, Ticket } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { CountAllTicketsSessionUser } from "@/actions/tickets";
import { useSession } from "next-auth/react";
import MessagesToRead from "../MessagesToRead";

const UserMenu = () => {
  const pathname = usePathname();
  const [sessionTicket, setSessionTicket] = useState<number>(0);
  const { data: session } = useSession();

  useEffect(() => {
    const loadSessionData = async () => {
      const ticketCount = await CountAllTicketsSessionUser(session?.user.id as string, session?.user.role as string);
      setSessionTicket(ticketCount);
    };

    loadSessionData();
  }, []);

  const isActive = (path: string) => {
    return pathname?.startsWith(path) ? "bg-[#2B3064] text-white" : "";
  };

  return (
    <nav className="flex-1 overflow-y-auto space-y-2 py-4 px-2">
      {" "}
      {/* Added overflow-y-auto */}
      <Link
        className={`flex items-center gap-3 rounded-lg ${isActive(
          "/dashboard"
        )} px-3 py-2 text-white transition-all hover:text-white hover:bg-[#2B3064] dark:text-gray-400 dark:hover:text-gray-50`}
        href="/dashboard"
      >
        <HomeIcon className="h-4 w-4" />
        Home
      </Link>
      <Link
        className={`flex items-center gap-3 text-white rounded-lg ${isActive(
          "/tickets"
        )} px-3 py-2 transition-all hover:text-white hover:bg-[#2B3064] dark:text-gray-400 dark:hover:text-gray-50`}
        href="/tickets"
      >
        <Ticket className="h-4 w-4" />
        Tickets
        <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#1BB68D] text-white hover:bg-[#1BB68D]">
        {sessionTicket}
        </Badge>
      </Link>
      <Link
        className="flex items-center gap-3 rounded-lg px-3 py-2 text-white transition-all hover:text-white hover:bg-[#2B3064] dark:text-gray-400 dark:hover:text-gray-50"
        href="/tickets/create"
      >
        <CirclePlus className="h-4 w-4" />
        New Ticket
      </Link>
      <Link
        className="flex items-center gap-3 rounded-lg px-3 py-2 text-white transition-all hover:text-white hover:bg-[#2B3064] dark:text-gray-400 dark:hover:text-gray-50"
        href="#"
      >
        <Bell className="h-4 w-4" />
        Notifications
        <MessagesToRead />
      </Link>
    </nav>
  );
};

export default UserMenu;
