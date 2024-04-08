"use server";

import { databse } from "@/lib/prismadb";
import { revalidatePath } from "next/cache";

export const getConversation = async (id: string) => {
  const conversation = await databse.comment.findMany({
    where: {
      ticketId: id,
    },
    include: {
      creatorBy: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          role: true,
        },
      },
      fileUrl: {
        select: {
          url: true,
        },
      },
    },
  });

  return conversation;
};

export const newConversation = async (values: any) => {
  const { content, creatorById, ticketId, file } = values;

  const conversation = await databse.comment.create({
    data: {
      content,
      creatorBy: {
        connect: {
          id: creatorById,
        },
      },
      ticket: {
        connect: {
          id: ticketId,
        },
      },
      deleted: false,
    },
  });

  if ((file && file.length > 0) || file !== "") {
    const attachConversation = await databse.fileCommentUrl.create({
      data: {
        url: file,
        user: {
          connect: {
            id: creatorById,
          },
        },
        comment: {
          connect: {
            id: conversation.id,
          },
        },
      },
    });
  }

  const fullConversation = await databse.comment.findFirst({
    where: {
      AND: [
        { id: conversation.id },
        { creatorById: conversation.creatorById }, // Asegúrate de que 'creatorById' es el ID del usuario que esperas
      ], // Asegúrate de que 'conversation' incluye el 'id' del comentario recién creado
    },
    include: {
      creatorBy: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          role: true,
        },
      },
      fileUrl: {
        select: {
          url: true,
        },
      },
    },
  });

  return fullConversation;
};

export const noReadMessagesByUser = async (userId: string) => {
  const messages = await databse.comment.count({
    where: {
      creatorById: userId, // Asume que cada mensaje tiene un destinatarioId
      read: false, // Asume que los mensajes tienen un campo booleano 'leido'
      deleted: false, // Asume que los mensajes tienen un campo booleano 'eliminado'
    },
  });

  return messages;
};

export const getAllNoReadMessages = async () => {
  const messages = await databse.comment.count({
    where: {
      read: false, // Asume que los mensajes tienen un campo booleano 'leido'
    },
  });

  return messages;
};

export const ticketByIdForTheAssigned = async (id: string) => {
  const ticket = await databse.ticket.findUnique({
    where: {
      id,
    },
    include: {
      assigened: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  return ticket;
};

export const MessagesNotReadAdmin = async () => {
  const messages = await databse.comment.findMany({
    where: {
      read: false, // Asume que los mensajes tienen un campo booleano 'leido'
    },
    include: {
      creatorBy: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          role: true,
        },
      },

    }
  });

  return messages;
};
