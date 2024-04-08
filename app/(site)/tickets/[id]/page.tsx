"use client";
import { GetTicketById } from "@/actions/tickets";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Ticket } from "@/types/ticket-detail";
import { ClockIcon } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import SkeletonTicketDetail from "../../components/SkeletonTicketDetail";
import { DateTime } from "luxon";
import { formatdDate } from "@/lib/utils";
import ChatConversation from "../../components/ChatConversation";
import ImageGalleryTicket from "../../components/ImageGalleryTicket";
import SelectStatus from "../../components/SelectStatus";
import io from "socket.io-client";
import { useSocket } from "@/app/components/providers/SocketProvider";

const UpdateTicket = () => {
  const params = useParams<{ id: string }>();
  const id = params?.id ?? "";
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [status, setStatus] = useState(ticket?.status);
  const { socket, isConected } = useSocket();

  useEffect(() => {
    if (isConected && socket) {
      // Solo emite el evento si el socket está conectado y definido
      socket.emit("adminRoom");
    }
  }, [isConected, socket]);

  useEffect(() => {
    const ticketDetail = async () => {
      const response = await GetTicketById(id);
      setTicket(response as unknown as Ticket);
      await socket.emit("adminRoom");
    };

    ticketDetail();
    // Fetch ticket by id
  }, [id]);

  const handleStatusChange = (newStatus: string) => {
    // Aquí puedes realizar las acciones necesarias cuando cambia el estado del ticket
    setStatus(newStatus);
  };

  const dateTimeHour = DateTime.fromJSDate(new Date(ticket?.createdAt || ""));
  const relativeTime = dateTimeHour.toRelative();

  if (!ticket) {
    return <SkeletonTicketDetail />;
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-10 mx-auto max-w-7xl">
      <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
        <Card>
          <CardHeader className="px-4 py-6 grid grid-cols-2 items-start gap-4">
            <div className="flex flex-col gap-1">
              <CardTitle className="text-lg font-semibold">
                Support Ticket #{ticket?.numberTicket}
              </CardTitle>
              <CardDescription className="text-sm text-gray-500 dark:text-gray-400">
                Ticket opened at{" "}
                <ClockIcon className="h-4 w-4 inline-block -translate-y-0.5" />{" "}
                {relativeTime}
              </CardDescription>
            </div>
            <div className="flex items-center justify-end">
              {ticket?.status === "OPEN" ? (
                <Badge className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                  Open
                </Badge>
              ) : ticket?.status === "CLOSED" ? (
                <Badge className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  Closed
                </Badge>
              ) : ticket?.status === "PROCESS" ? (
                <Badge className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                  In Process
                </Badge>
              ) : (
                <Badge className="bg-indigo-500 text-white text-xs px-2 py-1 rounded-full">
                  Finished
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="px-4 py-6 grid gap-4">
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Subject
              </div>
              <div className="font-medium">{ticket?.title}</div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Requester
              </div>
              <div className="font-medium">{ticket?.project.name}</div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Priority
              </div>
              <div className="font-medium">
                {ticket?.priority.name && ticket?.priority.name === "Low" ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-1 text-xs font-semibold text-green-600">
                    <span className="h-1.5 w-1.5 rounded-full bg-green-600"></span>
                    Low
                  </span>
                ) : ticket?.priority.name === "High" ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2 py-1 text-xs font-semibold text-red-600">
                    <span className="h-1.5 w-1.5 rounded-full bg-red-600"></span>
                    High
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full bg-yellow-50 px-2 py-1 text-xs font-semibold text-yellow-600">
                    <span className="h-1.5 w-1.5 rounded-full bg-yellow-600"></span>
                    Medium
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Detail
              </div>
              <div className="prose prose-sm prose-p:leading-normal">
                <p>{ticket?.description}</p>
              </div>
            </div>
            <ImageGalleryTicket images={ticket?.tracking} />

            <div className="flex items-center justify-start mb-4 gap-4">
              <SelectStatus currentStatus={ticket?.status || ""} idTicket={id}/>
            </div>

          </CardContent>
        </Card>
      </div>
      <ChatConversation ticketId={ticket.id} assignedId={ticket.assigened.id} />
    </div>
  );
};

export default UpdateTicket;
