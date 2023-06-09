// @ts-check
import * as fs from 'node:fs';
import * as http from 'node:http';
import * as path from 'node:path';

const DIST_PATH = path.join(process.cwd(), './client/dist');

const MIME_TYPES = {
    default: 'application/octet-stream',
    text: 'text/plain',
    html: 'text/html; charset=UTF-8',
    js: 'application/javascript; charset=UTF-8',
    css: 'text/css',
    png: 'image/png',
    jpg: 'image/jpg',
    gif: 'image/gif',
    ico: 'image/x-icon',
    svg: 'image/svg+xml',
    json: 'application/json; charset=UTF-8'
};

const toBool = [() => true, () => false];

/**
 * Returns a simple http server that serves static files
 * @returns {Promise<http.Server>}
 */
export async function create_http_server(routes = {}) {
    const server = http.createServer(async (req, res) => {
        // TODO: delete later
        res.setHeader('Access-Control-Allow-Origin', '*');
    
        // 1. Check if the route object has a property that matches the endpoint
        if (routes.hasOwnProperty(req.url ?? '')) {
            if (routes[req.url].hasOwnProperty(req.method?.toLowerCase())) {
                const response = await routes[req.url][req.method?.toLowerCase() ?? '']();
                const content_type = typeof response === 'object'
                    ? MIME_TYPES.json
                    : (typeof response === 'string' || typeof response === 'number')
                        ? MIME_TYPES.text
                        : MIME_TYPES.default;

                res.writeHead(response.status_code, { 'Content-Type': content_type });
                res.write(JSON.stringify(response.result));
                res.end();
                return;
            }
        }

        // 2. Check if there is a file within the client directory
        let filePath = path.join(DIST_PATH, req.url ?? '');
        const fileExists = await fs.promises.access(filePath).then(...toBool);

        if (req.method !== 'GET' || (req.url !== '/' && !fileExists)) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.write('Not Found');
            res.end();
            return;
        }

        if (fileExists && fs.lstatSync(filePath).isDirectory())
            filePath += '/index.html';

        const ext = path.extname(filePath).substring(1).toLowerCase();
        const stream = fs.createReadStream(filePath);

        res.writeHead(200, { 'Content-Type': MIME_TYPES[ext] || MIME_TYPES.default });
        stream.pipe(res);
    });

    return server;
}