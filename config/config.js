/**
 * Puerto en el que se ejecutará el servidor.
 * @constant {number}
 */
export const PORT = process.env.PORT || 3000;

/**
 * Origen permitido para las solicitudes CORS.
 * @constant {string}
 */
export const CORS_ORIGIN = process.env.CORS_ORIGIN || "*";

/**
 * Secuencia de comandos para combos en el juego.
 * @constant {string[]}
 * @example
 * ["UP", "RIGHT", "DOWN", "LEFT"]
 */
export const COMBO_SEQUENCE = ["UP", "RIGHT", "DOWN", "LEFT"]; // Ejemplo de combossssss

/**
 * Frecuencia de actualización de las posiciones en el juego (en milisegundos).
 * @constant {number}
 */
export const TICK_RATE = 50; // ms para actualizar posiciones
