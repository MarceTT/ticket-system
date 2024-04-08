"use server";

import * as z from "zod";
import { databse } from "@/lib/prismadb";
import { TicketSchema } from "@/schemas/ticket";
import { revalidatePath } from "next/cache";
import { customAlphabet } from "nanoid";
import { SelectEditTicketSchema } from "@/schemas/select-edit-ticket";
import { auth } from "@/auth";
import { Resend } from "resend";
import ChangeAssigned from "@/email/change-assigned";

type CreateTicket = z.infer<typeof TicketSchema>;
type EditTicketModal = z.infer<typeof SelectEditTicketSchema>;
const resend = new Resend(process.env.RESEND_API_KEY);

const session = auth();

export const CreateTicketData = async (values: CreateTicket) => {
  const {
    title,
    assignedTo,
    project,
    description,
    category,
    priority,
    createdBy,
    image,
  } = values;
  const nanoid = customAlphabet("1234567890", 6);

  console.log(values);
  const ticket = await databse.ticket.create({
    data: {
      title,
      description,
      status: "OPEN",
      numberTicket: nanoid(),
      createdBy: {
        connect: {
          id: createdBy,
        },
      },
      assigened: {
        connect: {
          id: assignedTo,
        },
      },

      project: {
        connect: {
          id: project,
        },
      },
      category: {
        connect: {
          id: category,
        },
      },
      priority: {
        connect: {
          id: priority,
        },
      },
    },
  });

  if (ticket && ticket.id) {
    const tracking = await databse.trackingTicket.create({
      data: {
        url: image ? image : null,
        ticket: {
          connect: {
            id: ticket.id,
          },
        },
      },
    });
  }

  revalidatePath("/tickets");

  return { message: "Ticket created successfully!", success: true, ticket };
};

export const GetDataTickets = async (userId: string, userRole: string) => {
  let whereCondition = {};

  if (userRole !== "ADMIN") {
    whereCondition = {
      OR: [
        { createdById: userId }, // El usuario creó el ticket
        { assignedTo: userId }, // El ticket está asignado al usuario
      ],
      orderBy: {
        createdAt: 'asc', // o 'asc' para orden ascendente
      },
    };
    
  }

  const tickets = await databse.ticket.findMany({
    where: whereCondition,
    include: {
      createdBy: {
        select: {
          id: true,
          name: true,
        },
      },
      assigened: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          role: true,
        },
      },
      category: {
        select: {
          id: true,
          name: true,
        },
      },
      project: {
        select: {
          id: true,
          name: true,
        },
      },
      priority: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  revalidatePath("/tickets");

  return tickets;
};

export const CountOpenTickets = async (userId: string, userRole: string) => {
  let whereCondition = {};
  if (userRole === "ADMIN") {
    whereCondition = {
      status: "OPEN", // Conservamos la condición de tickets abiertos
    };
  } else {
    whereCondition = {
      status: "OPEN", // Conservamos la condición de tickets abiertos
      OR: [
        { createdById: userId }, // El usuario creó el ticket
        { assignedTo: userId }, // El ticket está asignado al usuario
      ],
    };
  }

  const count = await databse.ticket.count({
    where: whereCondition,
  });

  return count;
};

export const CountClosedTickets = async (userId: string, userRole: string) => {
  let whereCondition = {};

  if (userRole !== "ADMIN") {
    whereCondition = {
      AND: [
        // Usa AND para combinar `status` con la condición `OR`
        { status: "CLOSED" },
        {
          OR: [
            //{ createdById: userId }, // El usuario creó el ticket
            { assignedTo: userId }, // El ticket está asignado al usuario
          ],
        },
      ],
    };
  } else {
    whereCondition = {
      status: "CLOSED",
    };
  }
  const count = await databse.ticket.count({
    where: whereCondition,
  });

  return count;
};

export const CountPendingTickets = async (userId: string, userRole: string) => {
  let whereCondition = {};

  if (userRole !== "ADMIN") {
    whereCondition = {
      AND: [
        // Usa AND para combinar `status` con la condición `OR`
        { status: "PROCESS" },
        {
          OR: [
            //{ createdById: userId }, // El usuario creó el ticket
            { assignedTo: userId }, // El ticket está asignado al usuario
          ],
        },
      ],
    };
  } else {
    whereCondition = {
      status: "PROCESS",
    };
  }
  const count = await databse.ticket.count({
    where: whereCondition,
  });

  return count;
};

export const CountFinishedTickets = async (
  userId: string,
  userRole: string
) => {
  let whereCondition = {};

  if (userRole !== "ADMIN") {
    whereCondition = {
      AND: [
        // Usa AND para combinar `status` con la condición `OR`
        { status: "FINISHED" },
        {
          OR: [
            //{ createdById: userId }, // El usuario creó el ticket
            { assignedTo: userId }, // El ticket está asignado al usuario
          ],
        },
      ],
    };
  } else {
    whereCondition = {
      status: "FINISHED",
    };
  }
  const count = await databse.ticket.count({
    where: whereCondition,
  });

  return count;
};

export const CountAllTickets = async () => {
  const count = await databse.ticket.count();

  return count;
};

export const CountAllTicketsSessionUser = async (
  userId: string,
  userRole: string
) => {
  let whereCondition = {};

  if (userRole === "ADMIN") {
    // Para usuarios ADMIN, contar todos los tickets en estados OPEN o IN PROCESS
    whereCondition = {
      OR: [{ status: "OPEN" }, { status: "PROCESS" }],
    };
  } else {
    // Para usuarios no ADMIN, contar solo los tickets asignados al usuario y que estén en estados OPEN o IN PROCESS
    whereCondition = {
      assignedTo: userId, // Asegúrate de que este campo coincida con tu modelo Prisma
      AND: [
        {
          OR: [{ status: "OPEN" }, { status: "PROCESS" }],
        },
      ],
    };
  }

  const count = await databse.ticket.count({
    where: whereCondition,
  });

  revalidatePath("/", "layout");

  return count;
};

export const GetTicketById = async (id: string) => {
  const ticket = await databse.ticket.findUnique({
    where: {
      id,
    },
    include: {
      createdBy: {
        select: {
          id: true,
          name: true,
        },
      },
      assigened: {
        select: {
          id: true,
          name: true,
        },
      },
      category: {
        select: {
          id: true,
          name: true,
        },
      },
      project: {
        select: {
          id: true,
          name: true,
        },
      },
      priority: {
        select: {
          id: true,
          name: true,
        },
      },
      tracking: {
        select: {
          id: true,
          url: true,
        },
      },
    },
  });

  const updateMessages = await databse.comment.updateMany({
    where: {
      ticketId: id,
    },
    data: {
      read: true,
    },
  });

  return ticket;
};

export const UpdateTicketModal = async (values: EditTicketModal) => {
  const { category, priority, id } = values;

  const ticket = await databse.ticket.update({
    where: {
      id,
    },
    data: {
      category: {
        connect: {
          id: category,
        },
      },
      priority: {
        connect: {
          id: priority,
        },
      },
    },
  });

  revalidatePath("/tickets");

  return { message: "Ticket updated successfully!", success: true, ticket };
};

export const updateAssignedTicket = async (
  assignedTo: string,
  idTicket: string
) => {
  const oldUserTicket = await databse.ticket.findFirst({
    where: {
      id: idTicket,
    },
  });

  const firstUser = await databse.user.findUnique({
    where: {
      id: oldUserTicket?.assignedTo,
    },
  });

  const secondUser = await databse.user.findUnique({
    where: {
      id: assignedTo,
    },
  });

  const newUserinTicket = await databse.ticket.update({
    where: {
      id: idTicket,
    },
    data: {
      assignedTo: assignedTo,
    },
  });

  const sendTo = secondUser?.email as string;

  try {
    await resend.emails.send({
      from: "ticket-tech@gmail.cl",
      to: [sendTo.toLocaleLowerCase()],
      subject: `You have been assigned the ticket number ${oldUserTicket?.numberTicket}`,
      react: ChangeAssigned({
        assigned: secondUser?.name as string,
        emailAssigned: secondUser?.email as string,
        imageAssigned: secondUser?.image as string,
        emailFrom: firstUser?.email as string,
        imageFrom: firstUser?.image as string,
        ticketNumber: oldUserTicket?.numberTicket as string,
        idTicket: idTicket,
      }),
    });

    revalidatePath("/tickets");

    return { success: true };
  } catch (error: unknown) {
    console.log(error);
    return { message: error, success: false };
  }
};

export const UpdateStatusTicket = async (
  idTicket: string,
  statusTicket: string
) => {
  const updateTicket = await databse.ticket.update({
    where: {
      id: idTicket,
    },
    data: {
      status: statusTicket,
    },
  });

  revalidatePath("/");

  return { message: "Status updated successfully", success: true };
};

export const TicketByCategory = async () => {
  const ticketsCountByCategory = await databse.ticket.groupBy({
    by: ["categoryId"],
    _count: {
      id: true,
    },
  });

  const categoryDetails = await Promise.all(
    ticketsCountByCategory.map(async (ticketGroup) => {
      const category = await databse.category.findUnique({
        where: { id: ticketGroup.categoryId },
      });
      return {
        categoryId: ticketGroup.categoryId,
        count: ticketGroup._count.id,
        name: category ? category.name : "Categoría no encontrada",
      };
    })
  );

  return categoryDetails;
};

export const TicketsByStaus = async () => {
  const ticketsByStatus = await databse.ticket.groupBy({
    by: ["status"],
    _count: {
      status: true,
    },
  });

  const simplifiedData = ticketsByStatus.map((item) => ({
    status: item.status,
    count: item._count.status,
  }));

  return simplifiedData;
};



export const TicketWithPriorityByUser = async () => {
    const ticketsWithPriorityByUser = await databse.ticket.findMany({
        where: {
          // Opcional: condiciones adicionales aquí si es necesario
        },
        include: {
          priority: true,
          assigened: {
            select: {
              name: true, // Suponiendo que quieres mostrar el nombre del usuario
            },
          },
        },
      });

      return ticketsWithPriorityByUser;
}
