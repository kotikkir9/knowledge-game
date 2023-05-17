import { create } from "../helpers.js";

/**
 * Returns Lobby component
 * @param {WebSocket} ws - Websocket object containing TCP connection
 */
function Lobby(ws) {

    return create('div', { 
        classList: 'start-page-container',
        textContent: 'This is lobby'
    });
}

export default Lobby;