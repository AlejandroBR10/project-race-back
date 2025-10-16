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
const maxLanes = 5;      // Número máximo de carriles
const players = {};
const availableLanes = Array.from({ length: maxLanes }, (_, i) => i); // Carriles disponibles

function addPlayer(id, playerName = "Jugador", carKey = "car1") {
  if (availableLanes.length === 0) {
    throw new Error("No hay carriles disponibles para nuevos jugadores.");
  }

  const laneIndex = availableLanes.shift(); // Toma el primer carril disponible
  const trackY = baseY + laneIndex * laneHeight; // Calcula la posición vertical del carril

  const playerInfo = {
    id,
    x: 150, // Posición inicial horizontal
    y: trackY, // Posición inicial vertical (único para cada jugador)
    trackY, // Guarda el carril asignado
    carKey, // Coche seleccionado
    playerName, // Nombre del jugador
    laneIndex, // Índice del carril
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
  if (!players[id]) return;

  const { laneIndex } = players[id];
  availableLanes.push(laneIndex); // Libera el carril
  availableLanes.sort(); // Asegura que los carriles estén ordenados
  delete players[id];
}

function getState() {
  return players;
}

export default { addPlayer, updatePlayer, removePlayer, getState };