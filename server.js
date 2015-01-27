var http = require('http'),
    kafka = require('kafka-node'),
    fs = require('fs'),
    ws = require('ws');

var httpPort = 8888,
    wsPort = 8080;

// KAFKA ----------------------------------------

var client = new kafka.Client('sa-zk-001.high.caffeine.io:2181'),
    consumer = new kafka.HighLevelConsumer(client, [{topic: 'json_transactions'}], {groupId: 'cb-kafka'});

consumer.on('message', function (msg) {
    console.log(this.id, msg);
});

consumer.on('error', function (err) {
    console.error(err);
});

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
    ws.on('message', function (msg) {
        console.log('received: %s', msg);
    });

    // Send random fake bacon
    setInterval(function () {
        ws.send(JSON.stringify({bacon: (10 * Math.random()).toFixed(2)}));
    }, 1000);

});
console.log('WebSocket listening on', wsPort);

// HELPERS ----------------------------------------
