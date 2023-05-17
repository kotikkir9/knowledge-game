import Lobby from './components/Lobby.js';
import Start from './components/Start.js';
import { Status } from './model/entities.js'

const status_text = document.querySelector('#status-text');
const content = document.getElementById('content');


let id = undefined;
const WS_PORT = 5000;

const ws = new WebSocket(`ws://${window.location.hostname}:${WS_PORT}`);

ws.onopen = () => {
    console.log('Connection open');
    // ws.send(JSON.stringify({ method: 'connect', name: input_name.value }));
    setStatus(Status.online);
}

ws.onmessage = (msg) => {
    const result = JSON.parse(msg.data);
    console.log(result);

    if (!result.method) return;

    if (result.method === 'join-accept') {
        changePage(Lobby(ws));
    }
}

ws.onclose = () => {
    console.log('connection closed');
    setStatus(Status.offline);
}

ws.onerror = (err) => {
    setStatus(Status.error);
}

function setStatus(conn_status) {
    status_text.textContent = conn_status;
    status_text.className = 'status-' + conn_status.toLowerCase()
}

function changePage(component) {
    while (content.firstChild) {
        content.firstChild.remove();
    }

    content.append(component)
}

// Initial start page
changePage(Start(ws));
