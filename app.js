// @ts-check
import * as crypto from 'node:crypto'
import { WebSocketServer } from 'ws';
import { create_http_server } from './src/http_server.js';
import { Player } from './src/model/Player.js';
import { get_ipv4_address } from './src/utility.js';
import { ws_method as method, colors } from './src/game_config.js';
import { game_state as state } from './src/game_state.js';
import { create_game_server, get_all_servers } from './src/api_routes.js';

let interval = null; // Interval ref for setInterval

const PORT = 8000;
const WS_PORT = 5000;
const MAX_PLAYERS = 8;

const routes = {
    '/api/servers': {
        get: get_all_servers,
        post: create_game_server
    },
}

const http_server = await create_http_server(routes);
http_server.listen(PORT, () => console.log(`Server running at http://${get_ipv4_address()[0] ?? '0.0.0.0'}:${PORT}/`));


const wss = new WebSocketServer({ port: WS_PORT });

wss.on('connection', (ws, req) => {
    // console.log(`Client ${req.socket.remoteAddress}:${req.socket.remotePort} established connection.`);
    const client_id = crypto.randomUUID();

    ws.on('message', function message(data) {
        const result = JSON.parse(data.toString('utf-8'));
        console.log(result);

        if (!result.method) return;

        // =================================
        // PLAYER JOIN
        // =================================
        if (result.method === method.JOIN_GAME) {
            if (state.game_started()) {
                send_error_message(ws, 'The game session is already in progress.');
                return;
            }

            if (state.get_players_count() == MAX_PLAYERS) {
                send_error_message(ws, 'Sorry, the lobby is full.');
                return;
            }

            for (const [, value] of state.get_players_entries()) {
                if (value.name === result.name) {
                    send_error_message(ws, `Name "${result.name}" is already taken.`);
                    return;
                }
            }

            const player = new Player(ws, client_id, result.name, req.socket.remoteAddress, req.socket.remotePort, colors.shift());
            state.add_player(player);
            
            // Accept the 'join request' and return player data
            player.connection.send(JSON.stringify({
                method: method.JOIN_ACCEPT,
                content: {
                    id: client_id,
                    name: result.name,
                    players: state.get_players_entries().map(([key, val]) => {
                        return {
                            id: key,
                            name: val.name,
                            self: key === client_id,
                            color: val.color,
                            ready: val.ready,
                        };
                    }),
                },
            }));

            if (interval !== null)
                cancel_timer();

            // Message to everyone that new player joined the lobby
            broadcast(method.PLAYER_JOIN, {
                id: client_id,
                name: player.name,
                color: player.color,
            }, client_id);
        }


        // =================================
        // PLAYER STATUS CHANGE
        // =================================
        if (result.method === method.PLAYER_STATUS_CHANGE) {
            state.get_player(client_id).ready = result.ready;

            broadcast(method.PLAYER_STATUS_CHANGE, {
                id: client_id,
                ready: result.ready,
            });

            let start_game = true;
            if (result.ready) {
                for (const [, value] of state.get_players_entries()) {
                    if (value.ready === false) {
                        start_game = false;
                        break;
                    }
                }
            } else {
                start_game = false;
            }

            if (interval !== null) {
                cancel_timer();
            }

            if (start_game) {
                if (state.get_players_count() < 2) return;

                set_timer(() => {
                    broadcast(method.GAME_START);
                    state.set_game_started(true);
                }, 5);
            }
        }
    });

    ws.on('close', () => {
        if (!state.game_started()) {
            const player = state.get_player(client_id);
            if (!player) return;

            colors.push(player.color);
            state.remove_player(client_id);

            broadcast(method.PLAYER_DISCONNECT, { id: client_id });

            if (interval !== null) cancel_timer();
        }

        //TODO: need to find a way to reset the game
        state.remove_player(client_id);
        if (state.get_players_count() === 0) {
            state.set_game_started(false);
        }
    });

    ws.on('error', console.error);
});

// =================================
// GLOBAL SERVICE METHODS
// =================================

/**
 * @param {string} method 
 * @param {object} content 
 * @param {string | null} exclude_id 
 */
function broadcast(method, content = {}, exclude_id = null) {
    for (const [id, value] of state.get_players_entries()) {
        if (exclude_id)
            if (id === exclude_id) continue;

        value.connection.send(JSON.stringify({
            method: method,
            content: content,
        }));
    }
}

function cancel_timer() {
    clearInterval(interval);
    interval = null;
    broadcast(method.TIMER_CANCEL);
}


/**
 * Sets a timer that counts down from the specified number of seconds.
 *
 * @param {function} [cb=() => {}] - Optional callback function to execute when the timer ends.
 * @param {number} [seconds=0] - Number of seconds to set for the timer.
 * @returns {void}
 */
function set_timer(cb = () => {}, seconds = 0) {
    clearInterval(interval);

    broadcast(method.TIMER_START, {
        seconds: seconds,
    });

    interval = setInterval(() => {
        seconds -= 1;

        if (seconds < 0) {
            clearInterval(interval);
            interval = null;
            broadcast(method.TIMER_END);
            cb();
            return;
        }

        broadcast(method.TIMER_UPDATE, {
            seconds: seconds,
        });
    }, 1000);
}

/**
 * @param {import("ws").WebSocket} ws
 * @param {string} message
 */
function send_error_message(ws, message) {
    ws.send(JSON.stringify({
        method: method.ERROR,
        content: {
            message: message,
        },
    }));
}