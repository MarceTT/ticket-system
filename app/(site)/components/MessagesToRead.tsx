'use client';

import { Badge } from "@/components/ui/badge";
import React, { useEffect, useState } from "react";
import io from 'socket.io-client';


const MessagesToRead = () => {
  const [mensajesNoLeidos, setMensajesNoLeidos] = useState<number>(0);
  const [key, setKey] = useState(Math.random());

  useEffect(() => {
    // Establecer la conexión con el servidor WebSocket
    const socket = io(process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000/", { path: "/api/socket/io" });

    socket.on('connect', () => {
      console.log('Conectado al servidor WebSocket');
      
      // Emitir evento para unirse a la sala 'exampleRoom'
      socket.emit('adminRoom');
    });

    socket.on('actualizarMensajesNoLeidos', (data: { count: number }) => {
      console.log("Datos recibidos del servidor: ", data);
      setMensajesNoLeidos(data.count);
      setKey(Math.random());
    });

    return () => {
      socket.off('connect');
      socket.off('actualizarMensajesNoLeidos');
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    console.log("El estado de mensajesNoLeidos ha cambiado:", mensajesNoLeidos);
  }, [mensajesNoLeidos]);
  return (
    <Badge key={key} className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#1BB68D] text-white hover:bg-[#1BB68D]">
      {mensajesNoLeidos}
    </Badge>
  );
};

export default MessagesToRead;
