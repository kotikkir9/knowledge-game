import * as crypto from 'node:crypto'

export async function get_all_servers() {

    await new Promise(resolve => setTimeout(resolve, 5000));

    const items = [];
    for (let i = 0; i < 15; i++) {
        items.push({
            name: crypto.randomUUID(),
            playerCount: 5,
            maxAllowed: 8,
            status: "Pending",
            locked: i % 2 === 0,
        });
    }

    console.log('get_all_servers');
    return {
        result: items,
        status_code: 200,
    };
}

export async function create_game_server() {
    console.log('create_game_server');
    return {
        result: {},
        status_code: 201,
    };
}