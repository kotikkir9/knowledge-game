import * as os from 'node:os'

export function create_guid() {
    const s4 = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    return `${s4() + s4()}-${s4()}-${s4()}-${s4()}-${s4() + s4() + s4()}`;
}

export function get_ipv4_address() {
    const networkInterfaces = os.networkInterfaces();
    const addresses = [];

    Object.keys(networkInterfaces).forEach((e) => {
        networkInterfaces[e].forEach((address) => {
            if (address.family === 'IPv4' && !address.internal) {
                addresses.push(address.address);
            }
        });
    });

    return addresses;
}