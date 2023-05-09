import { WebSocketServer } from 'ws';
import { create_http_server } from './src/http_server.js';
import { get_ipv4_address } from './src/ip_address.js';
import { Player } from './src/entities/Player.js';
import { create_guid } from './src/utility.js';

const PORT = 8000;
const WS_PORT = 5000;

const http_server = await create_http_server();
http_server.listen(PORT, () => console.log(`Server running at http://${get_ipv4_address()[0] ?? '0.0.0.0'}:${PORT}/`));


const players = {};

const wss = new WebSocketServer({ port: WS_PORT });

wss.on('connection', (ws, req) => {
    console.log(`Client ${req.socket.remoteAddress}:${req.socket.remotePort} established connection.`);
    const client_id = create_guid();

    ws.on('message', function message(data) {
        const result = JSON.parse(data.toString('utf-8'));
        console.log(result);

        if (!result.method) return;

        if (result.method === 'connect') {
            const player =  new Player(ws, client_id, result.name, req.socket.remoteAddress, req.socket.remotePort);
            players[client_id] = player;
            ws.send(JSON.stringify({ method: 'connect-accept', id: client_id }));

            for (const [id, value] of Object.entries(players)) {
                if (id === client_id) continue;
                value.connection.send(JSON.stringify({ method: 'player-join', message: `${player.name} joined the game.`}));
            }
        }
    });

    ws.on('close', () => {
        // delete players[client_id];
        // console.log(players);
    });

    ws.on('error', console.error);

    // wss.clients.forEach(client => {
    //     if (client.readyState === WebSocket.OPEN) {
    //         client.send('Welcome to OSU!');
    //     }
    // });
});