const { app } = require('electron');
const net = require('net');
const { Client } =  require('./client.js');

const PORT = 6978;
const HOST = 'localhost';

async function joinSession(window) {
    // try to join the session. If none exists then we create one.

    return new Promise((resolve, reject) => {
        const client = new net.Socket();
        var socket = client.connect({host: HOST, port: PORT});
        socket.on('connect', () => {
            console.log("CONNECTED");
            socket.on('data', (data) => {
                window.webContents.send('inbound-message', data.toString());
            });
            const cli = new Client(socket, window);
            resolve(cli);
            
        })
        socket.on('error', () => {
            console.log('FAILED TO CONNECT TO SESSION... CREATING ONE');
            const server = new net.Server();
            server.listen(PORT, () => {
                console.log("Listening");
            });
            server.on('close', () => {
                server.close();
                console.log("Client disconnected");
            });
            server.on('error', (reason) => {
                reject(reason);
            });
            server.on('connection', (socket) => {
                console.log("CONNECTED");
                socket.on('data', (data) => {
                    window.webContents.send('inbound-message', data.toString());
                });
                const cli = new Client(socket, window);
                resolve(cli);
            });
        });

    });
}

module.exports.joinSession = joinSession;