import { create } from "../utility/helpers.js";
import ServerItem from "./ServerItem.js";

function ServersContainer(changePage) {
    const tableHeader = create('thead', {}, {},
        create('tr', {}, {},
            create('th', { textContent: 'L' }),
            create('th', { textContent: 'Servers', width: '90%' }),
            create('th', { textContent: 'Players' }),
            create('th', { textContent: 'Status' }),
        )
    );

    // const test = crypto.randomUUID()

    const items = [];
    for (let i = 0; i < 5; i++) {
        items.push(ServerItem({
            name: Math.round(Math.random() * 1_000_000_000),
            // name: 'This is a very loooooooooooooooong server name hell yeah',
            playersCount: 5,
            maxAllowed: 8,
            status: 'Pending',
            locked: i % 2 === 0,
        }));
    }

    const tableBody = create('tbody', {}, {}, ...items);

    const table = create('table', {
        cellSpacing: 0,
    }, {}, tableHeader, tableBody)

    return create('div', {
        classList: 'servers-container',
    }, {}, table);
}

export default ServersContainer;