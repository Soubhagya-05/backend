import { Server } from "socket.io";

let ioInstance: Server | null = null;

export default function initSocket(io: Server) {
  ioInstance = io;

  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    // allow clients to join "rooms" (e.g., sector rooms)
    socket.on("subscribe", (room: string) => {
      if (room) socket.join(room);
    });

    socket.on("unsubscribe", (room: string) => {
      if (room) socket.leave(room);
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.id);
    });
  });
}

export function getIO(): Server {
  if (!ioInstance) throw new Error("Socket.io not initialized");
  return ioInstance;
}
