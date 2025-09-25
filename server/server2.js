const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

const io = new Server(server, { cors: { origin: "*" } });

let players = {};
const baseY = 200;       // posición inicial vertical
const laneHeight = 160;  // separación entre pistas

io.on("connection", (socket) => {
    console.log("Jugador conectado:", socket.id);

    socket.on("joinGame", () => {
        const laneIndex = Object.keys(players).length; // cada jugador ocupa un carril
        const trackY = baseY + laneIndex * laneHeight;

        const playerInfo = {
            id: socket.id,
            x: 150, // posición inicial X
            y: trackY,
            trackY,
            carKey: "car" + ((laneIndex % 5) + 1), // asignar car1..car5 en ciclo
        };

        // guardar en memoria
        players[socket.id] = playerInfo;

        // enviar al jugador sus datos
        socket.emit("newPlayer", playerInfo);

        // enviar a los demás que hay un nuevo jugador
        socket.broadcast.emit("newPlayer", playerInfo);

        // reenviar al jugador todos los que ya estaban
        Object.values(players).forEach((p) => {
            if (p.id !== socket.id) socket.emit("newPlayer", p);
        });
    });

    socket.on("playerMove", (pos) => {
        if (players[socket.id]) {
            players[socket.id].x = pos.x;
            players[socket.id].y = pos.y;
            socket.broadcast.emit("updatePlayer", {
                id: socket.id,
                x: pos.x,
                y: pos.y,
            });
        }
    });

    socket.on("disconnect", () => {
        console.log("Jugador desconectado:", socket.id);
        delete players[socket.id];
        socket.broadcast.emit("removePlayer", socket.id);
    });
});

server.listen(3000, () =>
console.log("Servidor escuchando en http://localhost:3000")
);
