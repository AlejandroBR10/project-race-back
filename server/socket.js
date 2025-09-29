import {createServer} from 'http';
import { Server } from "socket.io";

const PUERTO = 3000;

const server = createServer();
const io = new Server(server, {
    cors: {
        origin: '*'
    }
});

io.on("connection", (socket) => {
    console.log("Cliente conectado", socket.id);

    socket.on("ping", (msg) => {
        console.log("Ping recibido", msg);

        socket.emit("Pong", "pong desde el servidor");
    });

    socket.on("disconnect", () => {
        console.log("Cliente desconectado");
    });
});

server.listen(PUERTO, () => {
    console.log(`Servidor escuchando desde localhost:${PUERTO}`);
});
