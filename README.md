# Project Race Sockets

**Project Race Sockets** es un sistema de juego multijugador en tiempo real desarrollado con **Node.js** y **Socket.IO**. Este proyecto permite a los jugadores competir en una carrera virtual, gestionando salas, posiciones y eventos en tiempo real. Fue diseñado como parte de un curso de **Sistemas Distribuidos** y está optimizado para manejar múltiples jugadores en diferentes salas.

## Características

- **Gestión de Salas**: Los jugadores se agrupan en salas con un máximo de 5 jugadores por sala.
- **Actualización en Tiempo Real**: Las posiciones de los jugadores se sincronizan en tiempo real entre los clientes conectados.
- **Eventos de Juego**: Soporte para eventos como:
  - Movimiento de jugadores.
  - Notificación de ganadores.
  - Manejo de desconexiones.
- **Sistema de Carriles**: Cada jugador se asigna a un carril único para evitar colisiones visuales.
- **Configuración Personalizable**: Configuración de puerto, origen CORS y frecuencia de actualización.
- **Escalabilidad**: Soporte para múltiples salas y jugadores simultáneamente.

## Tecnologías Utilizadas

- **Node.js**: Entorno de ejecución para el backend.
- **Socket.IO**: Biblioteca para la comunicación en tiempo real.
- **JavaScript**: Lenguaje principal del proyecto.
- **dotenv**: Manejo de variables de entorno.

## Instalación

Sigue estos pasos para configurar y ejecutar el proyecto en tu máquina local:

1. **Clona este repositorio**:
   ```bash
   git clone https://github.com/AlejandroBR10/project-race-back
   cd project-race-back
   ```

2. **Instala las dependencias**:
   ```bash
   npm install
   ```

3. **Configura las variables de entorno (opcional)**:
   - Crea un archivo `.env` en la raíz del proyecto.
   - Define las siguientes variables si deseas personalizar la configuración:
     ```env
     PORT=3000
     CORS_ORIGIN=http://localhost:3000
     ```

4. **Inicia el servidor**:
   ```bash
   npm start
   ```

5. **Conéctate al servidor**:
   - El servidor estará disponible en `http://localhost:3000` (o el puerto que hayas configurado).

## Configuración

El archivo [`config/config.js`](config/config.js) contiene las configuraciones principales del proyecto:

- **`PORT`**: Puerto en el que se ejecutará el servidor.
- **`CORS_ORIGIN`**: Origen permitido para solicitudes CORS.
- **`COMBO_SEQUENCE`**: Secuencia de comandos para combos en el juego.
- **`TICK_RATE`**: Frecuencia de actualización de las posiciones en milisegundos.

## Estructura del Proyecto

```plaintext
project-race-back/
├── config/
│   └── config.js         # Configuración del servidor y del juego
├── game/
│   └── gameManager.js    # Lógica principal del juego (gestión de jugadores y carriles)
├── sockets/
│   └── gameSocket.js     # Gestión de eventos de WebSocket
├── .env                  # Variables de entorno (opcional)
├── [`package.json`](package.json )          # Dependencias y scripts del proyecto
└── [`README.md`](README.md )             # Documentación del proyecto
```

### Descripción de los Archivos

- **`config/config.js`**: Contiene las configuraciones principales del servidor y del juego.
- **`game/gameManager.js`**: Lógica principal del juego, incluyendo la gestión de jugadores, carriles y posiciones.
- **`sockets/gameSocket.js`**: Define los eventos de WebSocket para manejar la interacción en tiempo real entre los jugadores y el servidor.

## Funcionalidades Principales

### Gestión de Jugadores
El archivo [`game/gameManager.js`](game/gameManager.js) se encarga de:
- Agregar jugadores y asignarles un carril único.
- Actualizar las posiciones de los jugadores.
- Eliminar jugadores y liberar sus carriles.

### Eventos de WebSocket
El archivo [`sockets/gameSocket.js`](sockets/gameSocket.js) define los eventos principales:
- **`joinGame`**: Un jugador se une a una sala.
- **`playerMove`**: Actualización de la posición de un jugador.
- **`winner`**: Notificación de que un jugador ha ganado.
- **`disconnect`**: Manejo de la desconexión de un jugador.

### Configuración del Juego
El archivo [`config/config.js`](config/config.js) permite personalizar aspectos clave del servidor y del juego, como el puerto, el origen CORS y la frecuencia de actualización.

## Ejemplo de Flujo del Juego

1. Un jugador se conecta al servidor y se une a una sala.
2. El servidor asigna al jugador un carril único y notifica a los demás jugadores de la sala.
3. Los jugadores envían sus movimientos al servidor, que los retransmite en tiempo real.
4. Cuando un jugador gana, se notifica a todos los jugadores de la sala.

## Contribuciones

Si deseas contribuir a este proyecto:
1. Haz un fork del repositorio.
2. Crea una rama para tu funcionalidad o corrección:
   ```bash
   git checkout -b feature/nueva-funcionalidad
   ```
3. Realiza tus cambios y haz un commit:
   ```bash
   git commit -m "Agrega nueva funcionalidad"
   ```
4. Envía un pull request.

## Licencia

Este proyecto está bajo la licencia **MIT**. Puedes usarlo, modificarlo y distribuirlo libremente.

---

¡Gracias por usar **Project Race Sockets**! Si tienes alguna pregunta o sugerencia, no dudes en abrir un issue o contactarme.

