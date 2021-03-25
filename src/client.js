const { spawn } = require('child_process');
const net = require('net');

class Client {
    constructor(socket, window) {
        this.socket = socket;
        this.window = window;
    }

    sendMessage(message) {
        this.window.webContents.send('sent-message', message);
        this.socket.write(message);
    }


}

module.exports.Client = Client;
