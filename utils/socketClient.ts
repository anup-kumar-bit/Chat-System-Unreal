import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const initiateSocket = () => {
  if (!socket) {
    socket = io({
      path: "/api/socket",
    });
    console.log("🔗 Connecting to socket...");
  }
};

export const sendMessage = (message: string) => {
  if (socket) socket.emit("sendMessage", message);
};

export const onMessageReceived = (callback: (msg: string) => void) => {
  if (socket) socket.on("receiveMessage", callback);
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
