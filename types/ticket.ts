// export interface Ticket {
//     id: string
//     title: string | null;
//     createdById: string
//     assignedTo:string
//     categoryId:string
//     projectId:string
//     priorityId:string
//     status: string
//   }

import { Ticket, User } from "@prisma/client";

export type TicketList = Ticket & { users: User[], createdBy: User, assigened: User, category: { id: string, name: string }, project: { id: string, name: string }, priority: { id: string, name: string } };
