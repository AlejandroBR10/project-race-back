import { COMBO_SEQUENCE } from "../config/config.js";

const baseY = 200;       // posición inicial vertical
const laneHeight = 160;  // separación entre pistas
const maxLanes = 5;      // Número máximo de carriles
const players = {};
const availableLanes = Array.from({ length: maxLanes }, (_, i) => i); // Carriles disponibles

/**
 * Agrega un nuevo jugador al sistema y le asigna un carril único.
 * @param {string} id - ID único del jugador (generalmente el ID del socket).
 * @param {string} [playerName="Jugador"] - Nombre del jugador.
 * @param {string} [carKey="car1"] - Clave del coche seleccionado por el jugador.
 * @returns {Object} Información del jugador recién agregado.
 * @throws {Error} Si no hay carriles disponibles para nuevos jugadores.
 */
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

/**
 * Actualiza la posición de un jugador en el sistema.
 * @param {string} id - ID único del jugador.
 * @param {Object} pos - Objeto con las nuevas coordenadas del jugador.
 * @param {number} pos.x - Coordenada X del jugador.
 * @param {number} pos.y - Coordenada Y del jugador.
 * @returns {boolean} `true` si el jugador fue actualizado correctamente, `false` si no existe.
 */
function updatePlayer(id, pos) {
  if (!players[id]) return false;
  players[id].x = pos.x;
  players[id].y = pos.y;
  return true;
}

/**
 * Elimina a un jugador del sistema y libera su carril.
 * @param {string} id - ID único del jugador.
 */
function removePlayer(id) {
  if (!players[id]) return;

  const { laneIndex } = players[id];
  availableLanes.push(laneIndex); // Libera el carril
  availableLanes.sort(); // Asegura que los carriles estén ordenados
  delete players[id];
}

/**
 * Obtiene el estado actual de todos los jugadores.
 * @returns {Object} Un objeto con todos los jugadores y su información.
 */
function getState() {
  return players;
}

export default { addPlayer, updatePlayer, removePlayer, getState };