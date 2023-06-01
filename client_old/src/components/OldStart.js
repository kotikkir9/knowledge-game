// @ts-check
import { create } from "../utility/helpers.js";
import { state } from "../storage/state.js";
import Lobby from "../pages/Lobby.js";

/**
 * Returns Start component
 * @param {WebSocket} ws - Websocket object containing TCP connection
 */
function StartPage(ws, changePage) {
    let errorTimeout = null;

    const inputField = create('input', {
        classList: 'text-field',
        placeholder: 'Your name here...'
    }, {
        input: handleInput,
    });

    const button = create('button', {
        classList: 'btn',
        textContent: 'Join Game'
    }, {
        click: handleClick
    });

    const errorMessage = create('span', {
        classList: 'error-message',
    });

    function propagateEvent(data) {
        if (data.method == 'join-accept') {
            state.setId(data.content.id);
            state.setName(data.content.name);
            changePage(Lobby(ws, data.content, changePage));

        } else if (data.method === 'error') {
            shakeInputField(data.content.message);
        }
    }

    function handleInput({ currentTarget: target }) {
        const text = target.value;
        if (text.length > 15) {
            target.value = text.slice(0, -1);
            shakeInputField('Too many characters!');
        }
    }

    function handleClick() {
        const text = inputField.value;
        if (text.trim().length === 0) {
            shakeInputField(`Your name can't be empty.`);
            return
        }

        ws.send(JSON.stringify({
            method: 'join-game',
            name: text
        }));
    }

    function triggerError(message = '') {
        errorMessage.textContent = message;
        clearTimeout(errorTimeout);
        errorTimeout = setTimeout(() => {
            triggerError();
        }, 2000);
    }

    function shakeInputField(message = '') {
        triggerError(message);
        inputField.classList.add('bg-error');

        setTimeout(() => {
            inputField.classList.remove('bg-error');
        }, 500);
    }

    return create('div', {
        classList: 'start-container',
        event: propagateEvent,
    }, {}, errorMessage, inputField, button);
}

export default StartPage;