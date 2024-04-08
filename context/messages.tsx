"use client";

import { useSession } from "next-auth/react";
import { Context, ReactNode, createContext, useCallback, useContext, useEffect, useState } from "react";

import io from "socket.io-client";

interface MensajesContextType {
    mensajesNoLeidos: number;
    conectarSocket: () => void;
  }

const MensajesContext = createContext<MensajesContextType>({ mensajesNoLeidos: 0, conectarSocket: () => {} });

export const useMensajes = () => useContext(MensajesContext);

export const MensajesProvider = ({ children }: {children: ReactNode}) => {
  const [mensajesNoLeidos, setMensajesNoLeidos] = useState<number>(0);
  const [socket, setSocket] = useState<any>(null);
  const { data: session } = useSession();

  const conectarSocket = useCallback(() => {
    if (!socket) {
        const nuevoSocket = io(process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000", {
            path: "/api/socket/io/",
        });
        setSocket(nuevoSocket);

        nuevoSocket.on('actualizarMensajesNoLeidos', (cantidad) => {
            setMensajesNoLeidos(cantidad);
        });

        return () => nuevoSocket.disconnect();
    }
}, [socket]);

useEffect(() => {
    conectarSocket();

    return () => {
        if (socket) socket.disconnect();
    };
}, [conectarSocket, socket]);

useEffect(() => {
    if (session?.user && socket) {
        socket.emit("autenticarYUnirASala", { userId: session.user.id, userRole: session.user.role });
    }
}, [session, socket]);
  return (
    <MensajesContext.Provider value={{ mensajesNoLeidos, conectarSocket }}>
      {children}
    </MensajesContext.Provider>
  );
};