var http = require('http'),
fs = require('fs');

var port = 8888;

http.createServer(function (req, res) {
    var filename = './public' + req.url;
    fs.exists(filename, function (exists) {
        if (!exists) {
            console.log('file does not exist', fileName);
            res.writeHead(404);
            res.end();
            return;
        }

        if (fs.statSync(filename).isDirectory()) filename += '/index.html';

        fs.readFile(filename, {encoding:'UTF-8'}, function (err, data) {
            res.end(data);
        });
    });
}).listen(port);

console.log('listening on', port);
