"use client";

import { getConversation, newConversation } from "@/actions/comments";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  Paperclip,
  PaperclipIcon,
  Send,
  ShieldCheck,
  UserCheck,
  Image,
  FileText,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { CommentSchema } from "@/schemas/comment";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { DateTime } from "luxon";
import { Message } from "@/types/messages";
import { ClockIcon } from "lucide-react";
import io from "socket.io-client";
import { useSocket } from "@/app/components/providers/SocketProvider";
import ActionTooltip from "./ActionTooltip";
import { Input } from "@/components/ui/input";
import ModalAttachConversation from "./ModalAttachConversation";
import IconForAttachmentType from "./IconForAttachmentType";

interface ChatConversationProps {
  ticketId: string;
  assignedId: string;
}

const socket = io(process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000", {
  path: "/api/socket/io/",
});

type Role = "ADMIN" | "USER";

const roleIconMap: Record<Role, JSX.Element> = {
  ADMIN: <ShieldCheck className="h-4 w-4 ml-2 text-rose-700" />,
  USER: <UserCheck className="h-4 w-4 ml-2 text-[#1BB68D]" />,
};

const ChatConversation = ({ ticketId, assignedId }: ChatConversationProps) => {
  const { socket, isConected } = useSocket();
  const { data: session } = useSession();

  const [messages, setMessages] = useState<any[]>([]);
  const [attachFromChild, setAttachFromChild] = useState<string>("");
  const [openAttachment, setOpenAttachment] = useState<boolean>(false);

  useEffect(() => {
    if (socket == null || !isConected) return;

    socket.emit("joinRoom", ticketId);

    const messageEvent = `messageReceived:${ticketId}`;
    socket.on(messageEvent, (newMessage: Message) => {
      setMessages((prevMessages) => {
        const messageExists = prevMessages.some(
          (message) => message.id === newMessage.id
        );
        return messageExists ? prevMessages : [...prevMessages, newMessage];
      });
    });

    const detailMessage = async () => {
      const response = await getConversation(ticketId);
      setMessages(response);
    };
    detailMessage();

    return () => {
      // Limpieza del listener cuando el componente se desmonta o cambia el ticketId
      socket.off(messageEvent);
    };
  }, [ticketId, socket, isConected]);

  const form = useForm({
    resolver: zodResolver(CommentSchema),
    defaultValues: {
      comment: "",
    },
  });

  const isValidate = form.formState.isValid;

  const proccessForm = async (values: z.infer<typeof CommentSchema>) => {
    try {
      const validate = CommentSchema.safeParse(values);
      const { comment } = values;
      const data = {
        content: comment,
        creatorById: session?.user.id,
        ticketId: ticketId,
        file: attachFromChild,
        assignedId: assignedId,
      };
      const resp = await newConversation(data);
      await socket.emit("newMessage", resp);
      await socket.emit("adminRoom");
      setMessages([...messages, resp]);
      form.reset();
      //setMessages([...messages, data]);
      //form.reset();
    } catch (error) {
      console.log(error);
    }
  };

  const dateTimeHour = DateTime.fromJSDate(
    new Date((messages[0]?.createdAt as string) || "")
  );
  const relativeTime = dateTimeHour.toRelative();

  const handleClock = (date: string) => {
    const dateTime = DateTime.fromJSDate(new Date(date));
    return dateTime.toRelative();
  }

  const handleMessageFromChild = (childMessage: string) => {
    setAttachFromChild(childMessage);
  };

  const fileType = attachFromChild?.split(".").pop();


  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
      {/* Contenedor principal del chat con fondo blanco y bordes redondeados */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-4 py-2 bg-gray-400 dark:bg-gray-700 rounded-t-lg">
          <h2 className="font-semibold text-lg text-gray-900 dark:text-white">
            Replies
          </h2>
        </div>
        {messages.length > 0 ? (
          <div className="space-y-4 p-4">
            {messages.map((message, index) => (
              <div
                key={message.id ? message.id : index}
                className={`flex items-start ${
                  message.creatorById === session?.user.id
                    ? "justify-end"
                    : "justify-start"
                } w-full`}
              >
                <div
                  className={`${
                    message.creatorById === session?.user.id
                      ? "bg-blue-100 dark:bg-blue-900"
                      : "bg-gray-50 dark:bg-gray-800"
                  } rounded-lg shadow p-4 flex flex-col flex-grow ${
                    message.creatorById === session?.user.id
                      ? "items-end text-right"
                      : "items-start"
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <img
                      alt={
                        message.creatorById === session?.user.id
                          ? "You"
                          : message.creatorBy?.name || "Unknown User"
                      }
                      className="rounded-full h-10 w-10"
                      src={
                        message.creatorById === session?.user.id
                          ? session?.user.image
                          : message.creatorBy?.image || "/default-avatar.png" // Asume que tienes una imagen predeterminada
                      }
                    />

                    <h3 className="text-sm font-bold text-gray-900 dark:text-gray-200">
                      {message.creatorById === session?.user.id
                        ? "You"
                        : message.creatorBy?.name || "Unknown User"}
                    </h3>
                    <ActionTooltip
                      label={(
                        message.creatorBy?.role || "default"
                      ).toLowerCase()}
                    >
                      {message.creatorBy?.role
                        ? roleIconMap[message.creatorBy.role as Role]
                        : null}
                    </ActionTooltip>
                    <time
                      className="text-sm text-gray-500 dark:text-gray-400"
                      dateTime={message.createdAt}
                    >
                      <ClockIcon className="h-4 w-4 inline-block -translate-y-0.5" />{" "}
                      {handleClock(message.createdAt)}{" "}
                      {/* Considera convertir esto en un cálculo dinámico basado en `message.createdAt` */}
                    </time>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                    {message.content}
                  </p>
                  {message.fileUrl && message.fileUrl.length > 0 && (
                    <div className="mt-2 flex items-center gap-2">
                      <IconForAttachmentType type={message.fileUrl[0].url} />
                      <a
                        href={message.fileUrl[0].url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-500 hover:underline truncate max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl"
                        // style={{ maxWidth: '600px' }} // Ajusta según tu diseño
                      >
                        {message.fileUrl[0].url}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 dark:text-gray-400 p-4">
            No messages found
          </div>
        )}
        {/* <div className="space-y-4 p-4">
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-md">
            <div className="flex items-start">
              <div className="flex-shrink-0 mr-4">
                <Avatar>
                  <AvatarImage
                    alt="User 1"
                    className="rounded-full"
                    height={48}
                    src="/placeholder-user.jpg"
                    width={48}
                  />
                </Avatar>
              </div>
              <div className="grid gap-1 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-gray-900 dark:text-gray-200">
                    Alice Johnson
                  </h3>
                  <time
                    className="text-sm text-gray-500 dark:text-gray-400"
                    dateTime="2023-08-12T19:14:00Z"
                  >
                    2 hours ago
                  </time>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Hey, just wanted to check in and see how you're doing. Haven't
                  heard from you in a while!
                </p>
                <div className="flex items-center gap-2 mt-4">
                  <PaperclipIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Attachments
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-md">
            <div className="flex items-start justify-end">
              <div className="grid gap-1 flex-1 text-right">
                <div className="flex justify-end items-center gap-2">
                  <time
                    className="text-sm text-gray-500 dark:text-gray-400"
                    dateTime="2023-08-12T19:14:00Z"
                  >
                    2 hours ago
                  </time>
                  <h3 className="text-sm font-bold text-gray-900 dark:text-gray-200">
                    You
                  </h3>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Hey, just wanted to check in and see how you're doing. Haven't
                  heard from you in a while!
                </p>
                <div className="flex justify-end items-center gap-2 mt-4">
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Attachments
                  </span>
                  <PaperclipIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                </div>
              </div>
              <div className="flex-shrink-0 ml-4">
                <Avatar>
                  <AvatarImage
                    alt="User 1"
                    className="rounded-full"
                    height={48}
                    src="/placeholder-user.jpg"
                    width={48}
                  />
                </Avatar>
              </div>
            </div>
          </div>
        </div> */}
        <div className="border-t border-gray-200 dark:border-gray-600"></div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(proccessForm)}>
            <div className="p-4 flex gap-4">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setOpenAttachment(true)}
              >
                <Paperclip className="h-4 w-4" />
              </Button>
              <Input
                className="bg-gray-100 dark:bg-gray-700 border rounded-lg p-2 flex-1"
                placeholder="Type your message..."
                {...form.register("comment")}
              />
              <Button disabled={!isValidate} variant={"primary"} size={"icon"}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
            {attachFromChild.length > 0 && fileType && (
              <div className="mt-4 flex gap-2 items-center border border-gray-200 dark:border-gray-600 p-2 rounded-md bg-gray-50 dark:bg-gray-800 hover:shadow-md transition-shadow duration-150">
                {fileType !== "pdf" ? (
                  <Image className="w-6 h-6 text-indigo-500 dark:text-indigo-400" />
                ) : (<FileText className="w-6 h-6 text-red-500 dark:text-red-400"/>)
                }
               <span className="text-sm text-gray-700 dark:text-gray-300 truncate" title={attachFromChild}>
                  {attachFromChild}
                </span>
                {/* Puedes agregar un botón para eliminar el adjunto si lo consideras necesario */}
                {/* <button className="ml-auto text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            <XCircleIcon className="w-4 h-4" />
          </button> */}
              </div>
            )}
          </form>
        </Form>
        <ModalAttachConversation
          isOpen={openAttachment}
          onClose={() => setOpenAttachment(false)}
          onMessageSend={handleMessageFromChild}
        />
      </div>
    </div>
  );
};

export default ChatConversation;
