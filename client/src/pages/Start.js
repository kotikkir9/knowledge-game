// @ts-check
import ServersContainer from "../components/ServersContainer.js";
import { create } from "../utility/helpers.js";

/**
 * Returns Start component
 * @param {(component: any) => void} changePage
 */
function Start(changePage) {
    const text = create('p', {
        textContent: 'Servers',
        classList: 'top-text',
    });

    const createServerButton = create('button', {
        textContent: 'Create Server',
        classList: 'btn',
    });

    const refreshButton = create('button', {
        textContent: 'Refresh',
        classList: 'btn',
    });

    const buttonContainer = create('div', {
        classList: 'servers-btn-container',
    }, {}, createServerButton, refreshButton);

    // const button = create('button', {
    //     classList: 'btn',
    //     textContent: 'Join Game'
    // }, {
    //     click: handleClick
    // });

    // const errorMessage = create('span', {
    //     classList: 'error-message',
    // });

    const serverContainer = ServersContainer();

    return create('div', {
        classList: 'start-container',
    }, {}, text, serverContainer, buttonContainer);
}

export default Start;