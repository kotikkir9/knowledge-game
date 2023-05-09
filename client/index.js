const btn_connect = document.querySelector('#btn-connect');
const input_name = document.querySelector('#player-name');

let ws = undefined;
let id = undefined;
const WS_PORT = 5000;

btn_connect.addEventListener('click', () => {
    ws = new WebSocket(`ws://${window.location.hostname}:${WS_PORT}`);

    ws.onopen = () => {
        console.log('Connection open');
        ws.send(JSON.stringify({ method: 'connect', name: input_name.value }));
    }

    ws.onmessage = (msg) => {
        const result = JSON.parse(msg.data);
        console.log(result);

        if (result.method === 'connect-accept') {
            id = result.id;
            console.log(`Client ${id} successfully connected  to the game.`);
        }
    }

    ws.onclose = () => {
        console.log('connection closed');
    }
});
