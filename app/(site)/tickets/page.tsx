import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArchiveIcon, CheckCircleIcon, ClockIcon } from "lucide-react";
import { FcAddDatabase } from "react-icons/fc";
import Link from "next/link";
import React from "react";
import { CountOpenTickets, CountClosedTickets, CountPendingTickets, GetDataTickets, CountFinishedTickets } from "@/actions/tickets";
import { TicketDataTable } from "./data-table";
import { TicketList } from "@/types/ticket";
import WrapperTable from "../components/WrapperTable";
import { auth } from "@/auth";

const Ticket = async () => {
const session = await auth();
const openTickets = await CountOpenTickets(session?.user?.id as string, session?.user?.role as string);
const closedTickets = await CountClosedTickets(session?.user?.id as string, session?.user?.role as string);
const pendingTickets = await CountPendingTickets(session?.user?.id as string, session?.user?.role as string);
const tickets = await GetDataTickets(session?.user?.id as string, session?.user?.role as string);
const finished = await CountFinishedTickets(session?.user?.id as string, session?.user?.role as string);


  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-10 mx-auto max-w-7xl">
      <h1 className="text-4xl font-semibold text-center lg:text-left">Tickets</h1>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
        <div className="flex items-center gap-4">
          <h1 className="font-semibold text-lg md:text-xl">
            Ticket Administration
          </h1>

          <Button className="ml-auto" variant="primary">
            <Link href="/tickets/create">
                Create New Ticket
                </Link>
          </Button>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="flex flex-col items-center p-6">
            <ArchiveIcon className="w-8 h-8 text-green-500 dark:text-gray-400" />
            <div className="text-3xl font-bold">{openTickets}</div>
            <div className="text-sm text-center">Open Tickets</div>
          </Card>
          <Card className="flex flex-col items-center p-6">
            <ClockIcon className="w-8 h-8 text-yellow-500 dark:text-gray-400" />
            <div className="text-3xl font-bold">{pendingTickets}</div>
            <div className="text-sm text-center">Process Tickets</div>
          </Card>
          <Card className="flex flex-col items-center p-6">
            <CheckCircleIcon className="w-8 h-8 text-red-500 dark:text-gray-400" />
            <div className="text-3xl font-bold">{closedTickets}</div>
            <div className="text-sm text-center">Closed Tickets</div>
          </Card>
          <Card className="flex flex-col items-center p-6">
            <CheckCircleIcon className="w-8 h-8 text-indigo-500 dark:text-gray-400" />
            <div className="text-3xl font-bold">{finished}</div>
            <div className="text-sm text-center">Finished Tickets</div>
          </Card>
          {/* <Card className="flex flex-col items-center p-6">
            <ClockIcon className="w-8 h-8 text-gray-500 dark:text-gray-400" />
            <div className="text-3xl font-bold">12h 34m</div>
            <div className="text-sm text-center">Avg. Response Time</div>
          </Card> */}
        </div>
        <div className="flex flex-col gap-4">
          <WrapperTable data={tickets as TicketList[]}/>
        </div>
      </main>
    </div>
  );
};

export default Ticket;
