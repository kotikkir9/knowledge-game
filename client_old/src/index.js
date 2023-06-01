// @ts-check

import Start from './pages/Start.js';
import { Status } from './model/entities.js';

const status_text = document.querySelector('#status-text');
const root = document.getElementById('root');

// const ws = new WebSocket(`ws://${window.location.hostname}:${5000}`);

let id = undefined;
const players = {};
let currentPage = Start(changePage);


// ws.onopen = () => {
//     console.log('Connection open');
//     setStatus(Status.online);
// }

// ws.onmessage = (msg) => {
//     const result = JSON.parse(msg.data);
//     // DEBUG
//     console.log(result);

//     if (!result.method) return;

//     if (Object.hasOwn(currentPage, 'event')) {
//         currentPage.event(result);
//     }
// }

// ws.onclose = () => {
//     console.log('connection closed');
//     setStatus(Status.offline);
// }

// ws.onerror = (err) => {
//     setStatus(Status.error);
// }

function setStatus(conn_status) {
    status_text.textContent = conn_status;
    status_text.className = 'status-' + conn_status.toLowerCase()
}

function changePage(component) {
    currentPage = component;

    while (root.firstChild) {
        root.firstChild.remove();
    }

    root.append(currentPage);
}

// Initial start page
changePage(currentPage);
