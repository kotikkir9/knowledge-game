// @ts-check
import * as fs from 'node:fs';
import * as http from 'node:http';
import * as path from 'node:path';

const DIST_PATH = path.join(process.cwd(), './client/dist');

const MIME_TYPES = {
    default:    'application/octet-stream',
    html:       'text/html; charset=UTF-8',
    js:         'application/javascript; charset=UTF-8',
    css:        'text/css',
    png:        'image/png',
    jpg:        'image/jpg',
    gif:        'image/gif',
    ico:        'image/x-icon',
    svg:        'image/svg+xml',
};

const toBool = [() => true, () => false];

/**
 * Returns a simple http server that serves static files
 * @returns {Promise<http.Server>}
 */
export async function create_http_server() {
    const server = http.createServer(async (req, res) => {
        // console.log(`${req.method} ${req.url}`);

        let filePath = path.join(DIST_PATH, req.url ?? '');
        const fileExists = await fs.promises.access(filePath).then(...toBool);

        if (req.url !== '/' && !fileExists) {
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