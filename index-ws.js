const express = require('express');
const server = require('http').createServer();
const app = express();

app.get('/', function (req, res) {
    res.sendFile('index.html', { root: __dirname });
});

server.on('request', app);
server.listen(3000, function () { console.log('Listening on 3000')});

process.on('SIGINT', () => {
    console.log('sigint');
    wss.clients.forEach(function each(client) {
        client.close();
    });

    server.close(() => {
        shutDownDB();
    });
})

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

    db.run(`INSERT INTO visitors (count, time)
            VALUES ( ${numberOfClients}, datetime('now') )
        `);

    wss.on('close', function close() {
        console.log('A client has disconnected');
    })
});

wss.broadcast = function broadcast(data) {
    wss.clients.forEach(function each(client) {
        client.send(data);
    });
}

/** End web sockets */

/** Start DB */
const sqlite = require('sqlite3');
const db = new sqlite.Database(':memory:');

db.serialize(() => {
    db.run(`
        CREATE TABLE visitors (
            count INT,
            time TEXT
        )    
    `)
});

function getCounts () {
    db.each("SELECT * FROM visitors", (err, row) => {
        console.log(row);
    })
}

function shutDownDB () {
    getCounts();
    console.log('Shutting down db');
    db.close();
}


/** End DB */