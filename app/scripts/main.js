// REQUIRES ----------------------------------------

var socketDomain = 'localhost';//'d.caffeine.io';
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
    var counter = 0;
    var buffer = 0;
    var queue = [];
    var denominations = [0.01, 0.05, 0.10, 0.25, 0.50];

    function init(earnings) {
        total = counter = earnings;
        el.innerHTML = toCurrency(counter);
    }

    function sliceBacon(bacon) {
        buffer += bacon;

        var slice = function (val) {
            if (buffer > val) {
                queue.push(val);
                buffer -= val;
                total += val;
                return true;
            }
            return false;
        };
        while (buffer > 0.01) {
            denominations.reverse().some(slice);
        }
    }

    function rainBacon() {
        if (!queue.length) return;

        var val = queue.shift();
        total += val;

        var fragment = document.createDocumentFragment();
        var bacon = fragment.appendChild(document.createElement('div'));
        bacon.className = 'bacon';
        bacon.appendChild(document.createTextNode(val * 100 + '¢'));
        bacon.style.left = Math.floor(Math.random() * 60 + 20) + 'vw';
        document.body.insertBefore(bacon, document.body.firstChild);

        setTimeout(function () {
            counter += val;
            el.innerHTML = toCurrency(counter);
            bacon.parentNode.removeChild(bacon);
        }, 5000);
    }

    // Public

    this.start = function () {
        setInterval(rainBacon, 250);
    };

    this.receiveBacon = function (msg) {
        var earnings = parseFloat(msg.earnings);
        if (!total) { init(earnings); }
        sliceBacon(earnings - total);
    };

}

function toCurrency(num) {
    return parseFloat(num).toFixed(2).toLocaleString();
}
