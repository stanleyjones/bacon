// WEB SOCKET SERVER ----------------------------------------

var ws = require('ws');
var port = 8888;

var wss = new ws.Server({port: port});
wss.on('connection', function (ws) {

    var earnings = 100 * Math.random();

    var sendBacon = setInterval(function () {
        earnings += (Math.random() / 10);
        ws.send(JSON.stringify({company: 'Chartboost', earnings: earnings}));
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
