import StartPage from './components/start_page.js';
import { Status } from './model/entities.js'

const status_text = document.querySelector('#status-text');
const content = document.getElementById('content');

content.append(StartPage())

let id = undefined;
const WS_PORT = 5000;

const ws = new WebSocket(`ws://${window.location.hostname}:${WS_PORT}`);

ws.onopen = () => {
    console.log('Connection open');
    // ws.send(JSON.stringify({ method: 'connect', name: input_name.value }));
    set_status(Status.online);
}

ws.onmessage = (msg) => {
    const result = JSON.parse(msg.data);
    console.log(result);

    if (result.method === 'connect-accept') {
    }
}

ws.onclose = () => {
    console.log('connection closed');
    set_status(Status.offline);
}

ws.onerror = (err) => {
    set_status(Status.error);
}

function set_status(conn_status) {
    status_text.textContent = conn_status;
    status_text.className = 'status-' + conn_status.toLowerCase()
}
