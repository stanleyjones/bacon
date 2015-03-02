// REQUIRES ----------------------------------------

var socketDomain = 'd.caffeine.io';
var socketPort = 8888;

// CONFIG ----------------------------------------

var ws = new WebSocket('ws://' + socketDomain + ':' + socketPort + '/account');
var baconHandler = new BaconHandler('js-total');

// MAIN ----------------------------------------

ws.onopen = function () {
    baconHandler.start();
};
ws.onmessage = function (msg) {
    baconHandler.receiveBacon(JSON.parse(msg.data));
};


// HELPERS ----------------------------------------

function BaconHandler(el) {

    // Private

    el = document.getElementsByClassName(el)[0];

    var total = 0;
    var buffer = 0;
    var queue = [];
    var denominations = [1, 5, 10, 20, 50, 100];

    function weighBacon() {
        if (buffer < 1) return;

        denominations.reverse().forEach(function (val) {
            if (buffer > val) {
                queue.push(val);
                buffer -= val;
            }
        });
    }

    function rainBacon() {
        if (!queue.length) return;

        var val = queue.shift();

        var fragment = document.createDocumentFragment();
        var bacon = fragment.appendChild(document.createElement('div'));
        bacon.className = 'bacon';
        bacon.appendChild(document.createTextNode(val));
        bacon.style.left = Math.floor(Math.random() * 60 + 20) + 'vw';
        document.body.insertBefore(bacon, document.body.firstChild);

        setTimeout(function () {
            total += val;
            el.innerHTML = parseInt(total, 10);
            bacon.parentNode.removeChild(bacon);
        }, 5000);
    }

    // Public

    this.start = function () {
        console.log('starting...');
        setInterval(rainBacon, 1000);
    };

    this.receiveBacon = function (msg) {
        buffer += parseFloat(msg.earnings) || 0;
        weighBacon();
    };

}
