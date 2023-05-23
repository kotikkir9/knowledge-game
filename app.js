// @ts-check
import { WebSocketServer } from 'ws';
import { create_http_server } from './src/http_server.js';
import { Player } from './src/model/Player.js';
import { create_guid, get_ipv4_address } from './src/utility.js';
import { method, colors } from './src/model/constants.js';

const PORT = 8000;
const WS_PORT = 5000;

const http_server = await create_http_server();
http_server.listen(PORT, () => console.log(`Server running at http://${get_ipv4_address()[0] ?? '0.0.0.0'}:${PORT}/`));

const players = {};
let game_started = false;
let interval = null;

const wss = new WebSocketServer({ port: WS_PORT });

wss.on('connection', (ws, req) => {
    // console.log(`Client ${req.socket.remoteAddress}:${req.socket.remotePort} established connection.`);
    const client_id = create_guid();

    ws.on('message', function message(data) {
        const result = JSON.parse(data.toString('utf-8'));
        console.log(result);

        if (!result.method) return;

        // =================================
        // PLAYER JOINS THE GAME
        // =================================
        if (result.method === method.JOIN_GAME) {
            for (const [, value] of Object.entries(players)) {
                if (value.name === result.name) {
                    ws.send(JSON.stringify({
                        method: method.ERROR,
                        content: {
                            message: `Name "${result.name}" is already taken.`
                        },
                    }));

                    return;
                }
            }

            const player = new Player(ws, client_id, result.name, req.socket.remoteAddress, req.socket.remotePort, colors.shift());
            players[client_id] = player;

            // Accept the 'join request' and return player data
            player.connection.send(JSON.stringify({
                method: method.JOIN_ACCEPT,
                content: {
                    id: client_id,
                    name: result.name,
                    players: Object.entries(players).map(([key, val]) => {
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

        if (result.method === method.PLAYER_STATUS_CHANGE) {
            players[client_id].ready = result.ready;

            let start_game = true;
            if (result.ready) {
                for (const [, value] of Object.entries(players)) {
                    if (value.ready === false) {
                        start_game = false;
                        break;
                    }
                }
            } else {
                start_game = false;
            }

            broadcast(method.PLAYER_STATUS_CHANGE, {
                id: client_id,
                ready: result.ready
            });

            if (interval !== null) {
                cancel_timer();
            }

            if (start_game) {
                set_timer(() => {
                    broadcast(method.GAME_START);
                }, 5);
            }
        }
    });

    ws.on('close', () => {
        if (!game_started) {
            if (!players[client_id]) return;

            colors.push(players[client_id].color);
            delete players[client_id];

            broadcast(method.PLAYER_DISCONNECT, { id: client_id });

            if (interval !== null) cancel_timer();
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
    for (const [id, value] of Object.entries(players)) {
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
