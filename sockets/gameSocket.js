import gameManager from "../game/gameManager.js";

export default function gameSocket(io, socket) {
  /*socket.on("joinGame", () => {
    const playerInfo = gameManager.addPlayer(socket.id);

    // enviar al jugador sus datos
    socket.emit("newPlayer", playerInfo);

    // enviar a los demás que hay un nuevo jugador
    socket.broadcast.emit("newPlayer", playerInfo);

    // reenviar al jugador todos los que ya estaban
    Object.values(gameManager.getState()).forEach((p) => {
      if (p.id !== socket.id) socket.emit("newPlayer", p);
    });
  });*/


  socket.on("joinGame", ({ playerName, playerCar }) => {
  const playerInfo = gameManager.addPlayer(socket.id, playerName, playerCar);

  // enviar al jugador sus datos
  socket.emit("newPlayer", playerInfo);

  // enviar a los demás que hay un nuevo jugador
  socket.broadcast.emit("newPlayer", playerInfo);

  // reenviar al jugador todos los que ya estaban
  Object.values(gameManager.getState()).forEach((p) => {
    if (p.id !== socket.id) socket.emit("newPlayer", p);
  });
});

  socket.on("playerMove", (pos) => {
    const updated = gameManager.updatePlayer(socket.id, pos);
    if (updated) {
      socket.broadcast.emit("updatePlayer", {
        id: socket.id,
        x: pos.x,
        y: pos.y,
      });
    }
  });

  socket.on("winner", () => {
    const winnerId = socket.id;
    //Evento para el ganador
    socket.emit("youWon");

    //Evento para el resto de jugadores (los que perdieron :))
    socket.broadcast.emit("someOneWon", {
      winnerId: winnerId,
      message: `El jugador ${winnerId} ha ganado la carrera!!!!!`
    });
  });

  socket.on("disconnect", () => {
    gameManager.removePlayer(socket.id);
    socket.broadcast.emit("removePlayer", socket.id);
    console.log("Jugador desconectado:", socket.id);
  });
}
