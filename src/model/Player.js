export class Player {
    constructor(conn, id, name, ip, port, color) {
        this.id = id;
        this.name = name ? name : this.id.slice(0, 8);
        this.ip = ip;
        this.port = port;
        this.connection = conn;
        this.color = color;
        this.ready = false;
    }
}