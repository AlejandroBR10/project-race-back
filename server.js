import { createServer } from "http";
import { Server } from "socket.io";
import gameSocket from "./sockets/gameSocket.js";
import { PORT, CORS_ORIGIN } from "./config/config.js";

const server = createServer();

const io = new Server(server, {
  cors: {
    origin: CORS_ORIGIN,
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("Cliente conectado", socket.id);
  gameSocket(io, socket); // Delegamos a gameSocket.js
});

server.listen(PORT, () => {
  console.log(`Servidor escuchandingggg en http://localhost:${PORT}`);
});
