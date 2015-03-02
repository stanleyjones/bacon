// WEB SOCKET SERVER ----------------------------------------

var ws = require('ws');
var port = 8080;

var wss = new ws.Server({port: port});
wss.on('connection', function (ws) {

    // Send random fake bacon
    var sendBacon = setInterval(function () {
        ws.send(JSON.stringify({bacon: (10 * Math.random()).toFixed(2)}));
    }, 1000);

    ws.on('open', function (msg) {
        console.log(msg);
    });

    ws.on('message', function (msg) {
        console.log('received: %s', msg);
    });

    ws.on('close', function () {
        clearInterval(sendBacon);
    });

});
console.log('WebSocket listening on', port);
