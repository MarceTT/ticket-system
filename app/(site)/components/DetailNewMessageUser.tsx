"use client";

import { MessagesNotReadAdmin } from "@/actions/comments";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Message } from "@/types/messages";
import { Eye } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import React, { useEffect, useState } from "react";

interface DetailMessageProps {
  isOpenMessageModal: boolean;
  onClose: () => void;
}

const DetailNewMessageUser = ({
  isOpenMessageModal,
  onClose,
}: DetailMessageProps) => {
  const [notReadMessges, setNotReadMessages] = useState<Message[]>([]);

  useEffect(() => {
    const getMessages = async () => {
        const response = await MessagesNotReadAdmin();
        setNotReadMessages(response as unknown as Message[]);
    };

    getMessages();
      // Establece un polling cada X segundos
      const interval = setInterval(getMessages, 2000); // 10 segundos como ejemplo

      // Limpieza al salir
      return () => clearInterval(interval);
  }, []);

  return (
    <Dialog open={isOpenMessageModal} onOpenChange={onClose}>
      <DialogContent className="w-full sm:max-w-[500px] md:max-w-[500px] lg:max-w-[500px] xl:max-w-[1100px]">
      {/* <DialogContent className="w-full px-4 sm:px-6 md:w-3/4 lg:w-3/4 xl:w-3/4 2xl:max-w-6xl mx-auto my-8 overflow-hidden"> */}
        <DialogHeader>
          <DialogTitle>Not Read Messages</DialogTitle>
        </DialogHeader>
        <section className="container px-4 mx-auto">
          <div className="flex flex-col">
            <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                <div className="overflow-hidden border border-gray-200 dark:border-gray-700 md:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                      <tr>
                        <th
                          scope="col"
                          className="py-3.5 px-4 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                        >
                          <div className="flex items-center gap-x-3">
                            <span className="font-bold">Ticket</span>
                          </div>
                        </th>

                        <th
                          scope="col"
                          className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                        >
                          <span className="font-bold">Message from</span>
                        </th>

                        <th
                          scope="col"
                          className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                        >
                          <span className="font-bold">Actions</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200 dark:divide-gray-700 dark:bg-gray-900">
                      {notReadMessges.length > 0 ? (
                        notReadMessges.map((message, index) => (
                          <tr key={index}>
                            <td className="px-4 py-4 text-sm font-medium text-gray-700 dark:text-gray-200 whitespace-nowrap">
                              <div className="inline-flex items-center gap-x-3">
                                <span>#{message.ticketId}</span>
                              </div>
                            </td>
                            <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap">
                              <div className="flex items-center gap-x-2">
                                <div className="relative h-10 w-10">
                                  <Image
                                    className="h-full w-full rounded-full object-cover object-center"
                                    src={message.creatorBy?.image || ""}
                                    alt="user image"
                                    fill={true}
                                    sizes="100%"
                                  />
                                </div>
                                <div>
                                  <h2 className="text-sm font-medium text-gray-800 dark:text-white ">
                                    {message.creatorBy?.name}
                                  </h2>
                                  <p className="text-xs font-normal text-gray-600 dark:text-gray-400">
                                    {message.creatorBy?.email}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-4 text-sm whitespace-nowrap">
                              <div className="flex items-center gap-x-6">
                                <Link
                                  className="text-[#2B3064] transition-colors duration-200 hover:text-blue-600 focus:outline-none"
                                  href={`/tickets/${message.ticketId}`} onClick={onClose}
                                >
                                  <Eye />
                                </Link>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan={3}
                            className="text-center py-4 text-sm text-gray-500"
                          >
                            no messages to read.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </section>
        <DialogFooter></DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DetailNewMessageUser;
