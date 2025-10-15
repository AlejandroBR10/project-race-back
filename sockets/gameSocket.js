import gameManager from "../game/gameManager.js";

const MAX_PLAYERS_PER_ROOM = 6;
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

function printRoomsStatus() {
  let msg = "\n=== Estado actual de las salas ===";
  Object.entries(rooms).forEach(([roomName, players]) => {
    msg += `\nSala: ${roomName} (${players.length} jugadores)`;
    players.forEach((p, idx) => {
      msg += `\n  ${idx + 1}. ${p.playerName} (ID: ${p.id.substring(0, 8)}...)`;
    });
  });
  msg += "\n=================================\n";
  console.log(msg);
}

function broadcastPlayerList(io, roomName) {
  if (!rooms[roomName] || rooms[roomName].length === 0) return;

  const orderedIds = rooms[roomName].map((p) => p.id);
  console.log(
    `Enviando playerList a ${roomName}:`,
    orderedIds.map((id) => id.substring(0, 8)),
  );
  io.to(roomName).emit("playerList", orderedIds);
}

export default function gameSocket(io, socket) {
  let roomName = null;

  socket.on("joinGame", ({ playerName, playerCar }) => {
    roomName = findOrCreateRoom();
    const currentRoomPlayers = rooms[roomName];

    const playerInfo = gameManager.addPlayer(socket.id, playerName, playerCar);
    playerInfo.room = roomName;
    currentRoomPlayers.push(playerInfo);
    socket.join(roomName);

    console.log(`${playerName} se unio a ${roomName}`);

    socket.emit("newPlayer", playerInfo);

    socket.emit("roomInfo", {
      message: `Estas conectado en la sala: ${roomName}!`,
      room: roomName,
      playersInRoom: currentRoomPlayers.map((p) => p.playerName),
    });

    currentRoomPlayers.forEach((p) => {
      if (p.id !== socket.id) {
        socket.emit("newPlayer", p);
      }
    });

    socket.to(roomName).emit("newPlayer", playerInfo);

    setTimeout(() => {
      broadcastPlayerList(io, roomName);
    }, 100);

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
      const winner = rooms[roomName].find((p) => p.id === winnerId);

      socket.emit("youWon");

      socket.to(roomName).emit("someOneWon", {
        winnerId,
        message: `${winner?.playerName || "Un jugador"} ha ganado la carrera!`,
      });

      console.log(`${winner?.playerName} gano en ${roomName}`);
    }
  });

  socket.on("disconnect", () => {
    if (!roomName) return;

    const disconnectedPlayer = rooms[roomName].find((p) => p.id === socket.id);
    console.log(
      `${disconnectedPlayer?.playerName || socket.id} desconectandose de ${roomName}`,
    );

    gameManager.removePlayer(socket.id);

    rooms[roomName] = rooms[roomName].filter((p) => p.id !== socket.id);

    socket.to(roomName).emit("removePlayer", socket.id);

    setTimeout(() => {
      if (rooms[roomName] && rooms[roomName].length > 0) {
        broadcastPlayerList(io, roomName);
      } else if (rooms[roomName] && rooms[roomName].length === 0) {
        delete rooms[roomName];
        console.log(`Sala ${roomName} eliminada (vacia)`);
      }
    }, 150);

    printRoomsStatus();
  });
}
