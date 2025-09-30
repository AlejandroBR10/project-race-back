import { COMBO_SEQUENCE } from "../config/config.js";

/*const players = {};

function addPlayer(id) {
  // Elegimos un carro de ejemplo
  const carKey = `car${Object.keys(players).length % 3 + 1}`;
  players[id] = {
    x: 100,
    y: 100,
    carKey,
    comboIndex: 0, // índice del combo
    score: 0
  };
}

function removePlayer(id) {
  delete players[id];
}

function updatePlayer(id, data) {
  if (!players[id]) return;

  // Actualizar posición básica
  players[id].x = data.x;
  players[id].y = data.y;

  // Validar combo (opcional, para tu mecánica)
  const expectedKey = COMBO_SEQUENCE[players[id].comboIndex];
  if (data.keyPressed === expectedKey) {
    players[id].comboIndex++;
    players[id].score += 10;
    if (players[id].comboIndex >= COMBO_SEQUENCE.length) {
      players[id].comboIndex = 0; // reiniciar combo
    }
  } else if (data.keyPressed) {
    players[id].comboIndex = 0; // fallo en combo
    players[id].score -= 5;
  }
}

function getState() {
  return players;
}

function getPlayerPosition(id) {
  if (!players[id]) return { x: 0, y: 0 };
  return { x: players[id].x, y: players[id].y };
}

function getPlayerInfo(id) {
  if (!players[id]) return null;
  const { x, y, carKey } = players[id];
  return { id, x, y, carKey };
}

export default {
  addPlayer,
  removePlayer,
  updatePlayer,
  getState,
  getPlayerPosition,
  getPlayerInfo
};
*/

const baseY = 200;       // posición inicial vertical
const laneHeight = 160;  // separación entre pistas
const players = {};

function addPlayer(id, playerName = "Jugador", carKey = "car1") {
  const laneIndex = Object.keys(players).length;
  const trackY = baseY + laneIndex * laneHeight;

  const playerInfo = {
    id,
    x: 150,
    y: trackY,
    trackY,
    carKey,         // Usa el coche recibido
    playerName,     // Guarda el nombre recibido
  };

  players[id] = playerInfo;
  return playerInfo;
}

function updatePlayer(id, pos) {
  if (!players[id]) return false;
  players[id].x = pos.x;
  players[id].y = pos.y;
  return true;
}

function removePlayer(id) {
  delete players[id];
}

function getState() {
  return players;
}

export default { addPlayer, updatePlayer, removePlayer, getState };
