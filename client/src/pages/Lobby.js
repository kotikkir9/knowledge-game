// @ts-check
import { create } from "../utility/helpers";
import { state } from "../storage/state";

/**
 * Returns Lobby component
 * @param {WebSocket} ws - Websocket object containing TCP connection
 */
function Lobby(ws, data, changePage) {
    let ready = false;

    const playersContainer = create('div', {
        classList: 'players-container'
    });

    const readyBtn = create('button', {
        textContent: 'Ready',
        classList: 'btn'
    }, {
        click: requestStatusChange,
    });

    const timerModal = create('div', {
        classList: 'timer-modal',
    });

    function propagateEvent(data) {
        switch (data.method) {
            case 'player-join':
                addPlayer(data.content);
                break;
            case 'player-disconnect':
                removePlayer(data.content);
                break;
            case 'player-status-change':
                changeStatus(data.content);
                break;
            case 'timer-start':
            case 'timer-update':
                updateTimer(data.content.seconds);
                break;
            case 'timer-cancel':
                cancelTimer();
                break;
            case 'game-start':
                startGame();
                break;
        }
    }

    // Service methods
    function addPlayer(player) {
        playersContainer.append(create('div', {
            id: player.id,
            classList: 'player-box',
        }, {},
            create('span', {
                style: `background-color:${player.color}`,
                classList: 'player-color',
            }),
            create('p', {
                textContent: player.name,
            }),
            create('span', {
                textContent: player.ready ? 'READY' : '',
                classList: 'ready-status',
            }),
        ));
    }

    function removePlayer(player) {
        for (const child of playersContainer.children) {
            if (child.id === player.id) {
                child.remove();
                break;
            }
        }
    }

    function requestStatusChange() {
        ws.send(JSON.stringify({
            method: 'player-status-change',
            ready: !ready,
        }));
    }

    function changeStatus(data) {
        if (data.id === state.getId()) {
            ready = data.ready;
            readyBtn.textContent = ready ? 'Not Ready' : 'Ready';
            readyBtn.classList.toggle('ready', ready);
        }

        for (const player of playersContainer.children) {
            if (player.id === data.id) {
                player.querySelector('.ready-status').textContent = data.ready ? 'READY' : '';
                break;
            }
        }
    }

    function updateTimer(seconds) {
        if (!playersContainer.contains(timerModal)) {
            playersContainer.prepend(timerModal);
        }

        timerModal.textContent = seconds;
    }

    function cancelTimer() {
        timerModal.remove();
    }

    function startGame(e) {
        changePage('This is game page placeholder.');
    }


    // Initialize
    data.players.forEach(e => addPlayer(e));

    return create('div', {
        classList: 'lobby-container',
        event: propagateEvent,
    }, {}, playersContainer, readyBtn);
}

export default Lobby;