import { create } from "../helpers.js";

/**
 * Returns Start component
 * @param {WebSocket} ws - Websocket object containing TCP connection
 */
function StartPage(ws) {
    const inputField = create('input', {
        classList: 'text-field',
        placeholder: 'What is your name?'
    });

    const handleClick = () => {
        const text = inputField.value;
        if (text.trim().length === 0) {
            inputField.classList.add('bg-error');
            setTimeout(() => {
                inputField.classList.remove('bg-error');
            }, 500);

            return
        }

        ws.send(JSON.stringify({
            method: 'join-game',
            name: text
        }));
    }

    const button = create('button', {
        classList: 'btn',
        textContent: 'Join Game'
    }, {
        click: handleClick
    });

    return create('div', { 
        classList: 'start-page-container' 
    }, {}, inputField, button);
}

export default StartPage;