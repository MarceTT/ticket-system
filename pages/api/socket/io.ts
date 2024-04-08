import { Server as NetServer } from "http";
import { NextApiRequest } from "next";
import { Server as ServerIO } from "socket.io";

import { NextApiResponseServerIO } from "@/types/server";
import { getAllNoReadMessages, noReadMessagesByUser, ticketByIdForTheAssigned } from "@/actions/comments";

export const config = {
  api: {
    bodyParser: false,
  },
};

const ioHandler = (req: NextApiRequest, res: NextApiResponseServerIO) => {
  if (!res.socket.server.io) {
    const path = "/api/socket/io";
    const httpServer: NetServer = res.socket.server as any;
    const io = new ServerIO(httpServer, {
      path: path,
      addTrailingSlash: true,
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
      },
    });
    io.on("connection", (socket) => {
      console.log("Nuevo cliente conectado");

      socket.on("adminRoom", async () => {
        socket.join("adminRoom");
        console.log(`Cliente ${socket.id} se unió a la sala 'adminRoom'`);
        const mensajesNoLeidos = await getAllNoReadMessages();

        io.to("adminRoom").emit("actualizarMensajesNoLeidos", { count: mensajesNoLeidos });
        console.log({ count: mensajesNoLeidos });
      });


      socket.on("joinRoom", async (ticketId) => {
        socket.join(ticketId);

        console.log(`Cliente ${socket.id} se unió a la sala ${ticketId}`);
      });

      socket.on("newMessage", async (data) => {
        const { ticketId, ...messageData } = data;
        io.to(ticketId).emit(`messageReceived:${ticketId}`, messageData);

        // // Actualizar conteos de mensajes no leídos y emitir a las salas correspondientes
        const mensajesNoLeidosAdmin = await getAllNoReadMessages(); // Total de mensajes no leídos para admin
        io.to('adminRoom').emit('actualizarMensajesNoLeidos', mensajesNoLeidosAdmin);

        console.log(`Mensaje enviado en la sala ${ticketId}`, messageData);
        //console.log(`Mensajes no leidos ${mensajesNoLeidos}`);
      });

      socket.on("disconnect", () => {
        console.log("Cliente desconectado");
      });
    });
    res.socket.server.io = io;
  }

  res.end();
};

export default ioHandler;
