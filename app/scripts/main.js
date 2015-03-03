// REQUIRES ----------------------------------------

var socketDomain = 'd.caffeine.io';
var socketPort = 8888;

// CONFIG ----------------------------------------

var ws = new WebSocket('ws://' + socketDomain + ':' + socketPort + '/account');
var baconHandler = new BaconHandler({
    company: 'js-company',
    counter: 'js-total'
});

// MAIN ----------------------------------------

if (!readCookie('company_id')) { redirectAlert(); }

ws.onopen = function () {
    baconHandler.start();
};

ws.onmessage = function (msg) {
    baconHandler.receiveBacon(JSON.parse(msg.data));
};

// BACONHANDLER ----------------------------------------

function BaconHandler(opts) {
    opts = opts || {};

    // Private

    companyEl = document.getElementsByClassName(opts.company)[0];
    counterEl = document.getElementsByClassName(opts.counter)[0];

    var total = 0;
    var counter = 0;
    var buffer = 0;
    var vals = [0.01, 0.05, 0.10, 0.25, 0.50].reverse();

    function init(company, earnings) {
        total = counter = earnings;
        companyEl.innerHTML = company;
        counterEl.innerHTML = toCurrency(counter);
    }

    function weighBacon() {
        var slice = sliceBacon();
        if (slice) { rainBacon(slice); }
    }

    function sliceBacon() {
        var slice;
        for (var i = 0; i < vals.length; i++) {
            var val = vals[i];
            if (buffer > val) {
                slice = val;
                buffer -= val;
                total += val;
                break;
            }
        }
        return slice;
    }

    function rainBacon(slice) {
        var fragment = document.createDocumentFragment();
        var bacon = fragment.appendChild(document.createElement('div'));
        bacon.className = 'bacon';
        bacon.appendChild(document.createTextNode(slice * 100 + '¢'));
        bacon.style.left = Math.floor(Math.random() * 60 + 20) + 'vw';
        document.body.insertBefore(bacon, document.body.firstChild);

        setTimeout(function () {
            counter += slice;
            counterEl.innerHTML = toCurrency(counter);
            bacon.parentNode.removeChild(bacon);
        }, 5000);
    }

    // Public

    this.start = function () {
        setInterval(weighBacon, 500);
    };

    this.receiveBacon = function (msg) {
        var earnings = parseFloat(msg.earnings);
        var company = msg.company || '';

        if (!total) { init(company, earnings); }
        buffer = earnings - total;
    };
}

// HELPERS ----------------------------------------

function toCurrency(num) {
    return '$' + num.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function readCookie(key) {
    key += '=';
    var cookies = document.cookie.split(';');
    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i];
        while (cookie.charAt(0) == ' ') {
            cookie = cookie.substring(1, cookie.length);
        }
        if (cookie.indexOf(key) == 0) {
            return cookie.substring(key.length, cookie.length);
        }
    }
    return null;
}

function redirectAlert() {
    var alertEl = document.getElementsByClassName('js-alert')[0];
    alertEl.classList.add('-show');
}
