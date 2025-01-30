import { useEffect } from "react";
import io from "socket.io-client";

let socket;

const connectSocket = (token) => {
  socket = io("http://localhost:5000", {
    query: { token },
  });

  socket.on("connect", () => {
    console.log("Connected to the server");
  });
};

const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    console.log("Disconnected from the server");
  }
};

export { connectSocket, disconnectSocket };
