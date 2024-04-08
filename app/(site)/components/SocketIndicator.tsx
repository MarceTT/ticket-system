"use client";

import { useSocket } from "@/app/components/providers/SocketProvider";
import { Badge } from "@/components/ui/badge";

export const SocketIndicator = () => {
  const { isConected } = useSocket();
  return (
    <Badge
      className={`${isConected ? "bg-green-500" : "bg-red-500"} text-white`}
    >
      {isConected ? "Connected" : "Disconnected"}
    </Badge>
  );
};
