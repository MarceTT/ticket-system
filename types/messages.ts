import { User } from "@prisma/client";

export interface Message {
    id: string;
    content: string;
    createdAt: string;
    updatedAt: string;
    creatorById: string;
    ticketId: string;
    deleted: boolean;
    creatorBy?: {
      id: string;
      name: string;
      email: string;
      image: string;
      role: string;
    }
  }