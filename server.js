var http = require('http'),
    fs = require('fs'),
    ws = require('ws');

var httpPort = 8888,
    wsPort = 8080;

// WEB SERVER ----------------------------------------

http.createServer(function (req, res) {
    var filename = './public' + req.url;
    fs.exists(filename, function (exists) {
        if (!exists) {
            console.error('[404]', filename);
            res.writeHead(404);
            res.end();
            return;
        }

        if (fs.statSync(filename).isDirectory()) filename += '/index.html';

        fs.readFile(filename, {encoding:'UTF-8'}, function (err, data) {
            res.end(data);
        });
    });
}).listen(httpPort);
console.log('HTTP listening on', httpPort);

// WEB SOCKET SERVER ----------------------------------------

var wss = new ws.Server({port: wsPort});
wss.on('connection', function (ws) {
    ws.on('message', function (message) {
        console.log('received: %s', message);
    });

    // Send random fake bacon
    setInterval(function () {
        ws.send(JSON.stringify({bacon: (10 * Math.random()).toFixed(2)}));
    }, 1000);

});
console.log('WebSocket listening on', wsPort);

// HELPERS ----------------------------------------
