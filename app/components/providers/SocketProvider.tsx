"use client";
import { ReactNode, createContext, useContext, useEffect, useState } from "react";
import { io as ClientIO } from "socket.io-client";

type SocketContextType = {
  socket: any | null;
  isConected: boolean;
};
const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConected: false,
});

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }: {children : ReactNode}) => {
    const [socket, setSocket] = useState<any | null>(null);
    const [isConected, setIsConected] = useState<boolean>(false);
    
    useEffect(() => {
        const socketInstance = new (ClientIO as any)(process.env.NEXT_PUBLIC_APP_URL!,{
            path: "/api/socket/io",
            addTrailingSlash: true,
        });
        socketInstance.on("connect", () => {
            setIsConected(true);
        });
        socketInstance.on("disconnect", () => {
            setIsConected(false);
          });
      
          setSocket(socketInstance);
      
          return () => {
            socketInstance.disconnect();
          }
    }, []);
    
    return (
        <SocketContext.Provider value={{ socket, isConected }}>
        {children}
        </SocketContext.Provider>
    );
    };