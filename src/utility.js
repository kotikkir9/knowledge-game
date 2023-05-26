import * as os from 'node:os'

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