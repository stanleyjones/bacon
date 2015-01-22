var ws = new WebSocket('ws://localhost:8080/');

ws.onopen = function () {
    console.log('Opened WebSocket');
    ws.send('something from the browser');
};
ws.onmessage = function (message) {
    console.log('received: %s', message.data);
};
