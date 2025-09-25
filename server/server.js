const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "*" },
});

let players = {};

io.on("connection", (socket) => {
  console.log("Jugador conectado:", socket.id);

  socket.on("joinGame", () => {
    players[socket.id] = { x: 0, y: 300 }; 
    socket.broadcast.emit("newPlayer", socket.id);

    Object.keys(players).forEach((id) => {
      if (id !== socket.id) socket.emit("newPlayer", id);
    });
  });

  // recibir movimiento
  socket.on("playerMove", (pos) => {
    // actualizar estado en memoria
    players[socket.id] = pos;
    // enviar a todos los demás jugadores
    socket.broadcast.emit("updatePlayer", { id: socket.id, x: pos.x, y: pos.y });
  });

  socket.on("disconnect", () => {
    console.log("Jugador desconectado:", socket.id);
    delete players[socket.id];
    socket.broadcast.emit("removePlayer", socket.id);
  });
});


server.listen(3000, () => console.log("Servidor escuchando en http://localhost:3000"));
