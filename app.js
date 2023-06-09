// @ts-check
import { create_http_server } from './src/http_server.js';
import { get_ipv4_address } from './src/utility.js';
import { create_game_server, get_all_servers } from './src/api_routes.js';

const PORT = 8000;

const routes = {
    '/api/servers': {
        get: get_all_servers,
        post: create_game_server
    },
}

const http_server = await create_http_server(routes);
http_server.listen(PORT, () => console.log(`Server running at http://${get_ipv4_address()[0] ?? '0.0.0.0'}:${PORT}/`));