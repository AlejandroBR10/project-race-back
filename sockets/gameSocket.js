import gameManager from "../game/gameManager.js";

const MAX_PLAYERS_PER_ROOM = 5;
const rooms = {};

function findOrCreateRoom() {
  for (const [roomName, players] of Object.entries(rooms)) {
    if (players.length < MAX_PLAYERS_PER_ROOM) {
      return roomName;
    }
  }
  const newRoomName = `room-${Object.keys(rooms).length + 1}`;
  rooms[newRoomName] = [];
  return newRoomName;
}

// Helper para imprimir el estado actual de las salas y sus jugadores
function printRoomsStatus() {
  let msg = "\n=== Estado actual de las salas ===";
  Object.entries(rooms).forEach(([roomName, players]) => {
    msg += `\nSala: ${roomName}`;
    players.forEach((p) => {
      msg += `\n  - Jugador: ${p.playerName} (ID: ${p.id})`;
    });
  });
  msg += "\n=================================\n";
  console.log(msg);
}

export default function gameSocket(io, socket) {
  let roomName = null;

  socket.on("joinGame", ({ playerName, playerCar }) => {
    roomName = findOrCreateRoom();
    const currentRoomPlayers = rooms[roomName];

    // Agrega al jugador al estado global y a la sala
    const playerInfo = gameManager.addPlayer(socket.id, playerName, playerCar);
    playerInfo.room = roomName;
    currentRoomPlayers.push(playerInfo);
    socket.join(roomName);

    // Enviar al jugador su propio estado
    socket.emit("newPlayer", playerInfo);

    // Enviar mensaje con la sala asignada
    socket.emit("roomInfo", {
      message: `¡Estás conectado en la sala: ${roomName}!`,
      room: roomName,
      playersInRoom: currentRoomPlayers.map((p) => p.playerName),
    });

    // Reenviar al jugador todos los que ya estaban en la sala
    currentRoomPlayers.forEach((p) => {
      if (p.id !== socket.id) socket.emit("newPlayer", p);
    });

    // Notificar al resto de la sala sobre el nuevo jugador
    socket.to(roomName).emit("newPlayer", playerInfo);

    // Mostrar estado actual de todas las salas y jugadores conectados
    printRoomsStatus();
  });

  socket.on("playerMove", (pos) => {
    const updated = gameManager.updatePlayer(socket.id, pos);
    if (updated && roomName) {
      socket.to(roomName).emit("updatePlayer", {
        id: socket.id,
        x: pos.x,
        y: pos.y,
      });
    }
  });

  socket.on("winner", () => {
    if (roomName) {
      const winnerId = socket.id;
      // Evento para el ganador
      socket.emit("youWon");

      // Evento para el resto de la sala
      socket.to(roomName).emit("someOneWon", {
        winnerId,
        message: `El jugador ${winnerId} ha ganado la carrera!!!!!`,
      });
    }
  });

  socket.on("disconnect", () => {
    if (!roomName) return;
    gameManager.removePlayer(socket.id);

    // Elimina al jugador de la sala
    rooms[roomName] = rooms[roomName].filter((p) => p.id !== socket.id);

    // Notifica al resto de la sala
    socket.to(roomName).emit("removePlayer", socket.id);

    // Si la sala queda vacía, elimínala
    if (rooms[roomName].length === 0) {
      delete rooms[roomName];
    }

    console.log(`Jugador desconectado: ${socket.id}`);

    // Mostrar estado actual de todas las salas y jugadores conectados
    printRoomsStatus();
  });
}
