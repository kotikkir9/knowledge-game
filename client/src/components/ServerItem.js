import { create } from "../utility/helpers.js";

function ServerItem(data) {
    const locked = create('td', {
        textContent: data.locked ? 'Yes': 'No',
    });

    const serverName = create('td', {
        textContent: data.name,
        classList: 'server-name-col',
    })
    const playersCount = create('td', {
        textContent: `${data.playersCount}/${data.maxAllowed}`,
    });

    const serverStatus = create('td', {
        textContent: data.status,
    });

    return create('tr', {
        classList: 'server-item',
    }, {}, locked, serverName, playersCount, serverStatus);
}

export default ServerItem;