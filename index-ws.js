const express = require('express');
const server = require('http').createServer();
const app = express();

app.get('/', function (req, res) {
    res.sendFile('index.html', { root: __dirname });
});

server.on('request', app);
server.listen(3000, function () { console.log('Listening on 3000')});

/** Start websockets */
const WebSocketServer = require('ws').Server;

const wss = new WebSocketServer({ server: server });

wss.on('connection', function connection(ws) {
    const numberOfClients = wss.clients.size;
    console.log('Clients connected: ', numberOfClients);

    wss.broadcast(`Current visitors: ${numberOfClients}`);

    if(ws.readyState === ws.OPEN) {
        ws.send('Welcome to this server');
    }

    wss.on('close', function close() {
        wss.broadcast(`Current visitors: ${numberOfClients}`);
        console.log('A client has disconnected')
    })
});

wss.broadcast = function broadcast(data) {
    wss.clients.forEach(function each(client) {
        client.send(data);
    });
}