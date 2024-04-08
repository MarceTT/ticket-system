"use client";
import { Badge } from "@/components/ui/badge";
import {
  Bell,
  CirclePlus,
  HomeIcon,
  LineChartIcon,
  PackageIcon,
  Ticket,
  UsersIcon,
} from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { CountAllTicketsSessionUser } from "@/actions/tickets";
import { useSession } from "next-auth/react";
import MessagesToRead from "../MessagesToRead";
import { getAllNoReadMessages } from "@/actions/comments";
import DetailNewMessageUser from "../DetailNewMessageUser";
import { useQuery } from "@tanstack/react-query";

type MobileMenuProps = {
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const AdminMenu = ({isMobileMenuOpen,setIsMobileMenuOpen}: MobileMenuProps) => {
  const pathname = usePathname();
  const [sessionTicket, setSessionTicket] = useState<number>(0);
  const [mensajesNoLeidos, setMensajesNoLeidos] = useState<number>(0);
  const [openModalMessages, setOpenModalMessages] = useState(false);
  const { data: session } = useSession();

  useEffect(() => {
    const fetchMensajesNoLeidos = async () => {
      const count = await getAllNoReadMessages();
      setMensajesNoLeidos(count);
    };

    fetchMensajesNoLeidos();
    const interval = setInterval(fetchMensajesNoLeidos, 2000); // 10 segundos como ejemplo

    return () => clearInterval(interval);
  }, []);

  // const { data: dataMessages, isLoading} = useQuery({ 
  //   queryKey: ['messages'], 
  //   queryFn: async () => {
  //     const response = await getAllNoReadMessages();
  //     return response;
  //   },
  //   refetchInterval: 2000,
  // });

  //console.log(mensajesNoLeidos)

  const isActive = (path: string) => {
    return pathname?.startsWith(path) ? "bg-[#2B3064] text-white" : "";
  };

  //const sessionTicket = await CountAllTicketsSessionUser(session?.user.id as string, session?.user.role as string);
  return (
    <nav className="flex-1 overflow-y-auto space-y-2 py-4 px-2">
      {" "}
      {/* Added overflow-y-auto */}
      <Link
        className={`flex items-center gap-3 rounded-lg ${isActive(
          "/dashboard"
        )} px-3 py-2 text-white transition-all hover:text-white hover:bg-[#2B3064] dark:text-gray-400 dark:hover:text-gray-50`}
        href="/dashboard"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        <HomeIcon className="h-4 w-4" />
        Home
      </Link>
      <Link
        className={`flex items-center gap-3 text-white rounded-lg ${isActive(
          "/tickets"
        )} px-3 py-2 transition-all hover:text-white hover:bg-[#2B3064] dark:text-gray-400 dark:hover:text-gray-50`}
        href="/tickets"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        <Ticket className="h-4 w-4" />
        Tickets
        {/* <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#1BB68D] text-white hover:bg-[#1BB68D]">
            {sessionTicket}
          </Badge> */}
      </Link>
      <Link
        className="flex items-center gap-3 rounded-lg px-3 py-2 text-white transition-all hover:text-white hover:bg-[#2B3064] dark:text-gray-400 dark:hover:text-gray-50"
        href="/tickets/create"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        <CirclePlus className="h-4 w-4" />
        New Ticket
      </Link>
      <Link
        className={`flex items-center gap-3 text-white rounded-lg ${isActive(
          "/user-list"
        )} px-3 py-2 transition-all hover:text-white hover:bg-[#2B3064] dark:text-gray-400 dark:hover:text-gray-50`}
        href="/user-list"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        <UsersIcon className="h-4 w-4" />
        Users
      </Link>
      <div
        className="flex items-center gap-3 rounded-lg px-3 py-2 text-white transition-all hover:text-white hover:bg-[#2B3064] dark:text-gray-400 dark:hover:text-gray-50"
        onClick={() => setOpenModalMessages(true)}
      >
        <Bell className="h-4 w-4"/>
        Notifications
        <MessagesToRead/>
      </div>
      <DetailNewMessageUser
          isOpenMessageModal={openModalMessages}
          
          onClose={() => setOpenModalMessages(false)}
        />
    </nav>
  );
};

export default AdminMenu;
