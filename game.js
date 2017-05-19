/* Construct player */
function Player (x, y) {
    /* Set initial position */
    this.x = x;
    this.y = y;
    this.dx = 0;
    this.dy = 0;
    this.speed = 0.5;
    this.width = 20;
    this.height = 20;
    this.sensitivity = 2;
    this.alpha = 0;
    this.beta = 0;
    this.gamma = 0;

    /* Install device orientation event */
    var _self = this;
    if (window.DeviceOrientationEvent) {
        window.addEventListener ('deviceorientation', function (ev) {
            _self.motion (ev);
            return true;
        }, false);
    } else {
        alert ('DeviceOrientation not supported in this device, sorry!');
    }
}

/* Handle change of orientation */
Player.prototype.motion = function (ev) {
    /* Gamma is the left-to-right tilt in degrees, where right is positive */
    var lr = ev.gamma;

    /* Beta is the front-to-back tilt in degrees, where front is positive */
    var fb = ev.beta;

    /* Alpha is the compass direction the device is facing in degrees */
    var dir = ev.alpha

    /* Compute direction of change */
    var dx = lr * this.speed;
    var dy = fb * this.speed;

    /* Allow small error in movement */
    var len = Math.sqrt (dx * dx + dy * dy);
    if (len > this.sensitivity) {
        /* Movement large enough */
        this.dx = dx;
        this.dy = dy;
    } else {
        this.dx = 0;
        this.dy = 0;
    }

    /* Save raw motion direction */
    this.alpha = ev.alpha;
    this.beta = ev.beta;
    this.gamma = ev.gamma;
}

/* Construct game */
function Game () {
    /* Initialize object */
    this.path = [];
    this.pathlength = 20;

    /* Initialize canvas */
    this.canvas = document.getElementById ('canvas');
    this.ctx = canvas.getContext ('2d');

    /* Resize canvas to fill the screen */
    this.canvas.width = document.body.clientWidth;
    this.canvas.height = document.body.clientHeight;

    /* Position player in the middle of screen */
    var w = this.canvas.width;
    var h = this.canvas.height;

    /* Initialize player */
    this.player = new Player (w / 2, h / 2);

    /* Set up animation frame */
    var _self = this;
    window.requestAnimationFrame (function () {
        _self.animate ();
    });

    /* Install window resize event */
    $(window).on ('resize', function (e) {
        _self.resize (e);
        return true;
    });
}

/* Handle window resize */
Game.prototype.resize = function (e) {
    /* Resize canvas */
    this.canvas.width = document.body.clientWidth;
    this.canvas.height = document.body.clientHeight;
};

/* Update player position */
Game.prototype.update = function () {
    /* Get constraints */
    var x1 = this.player.width / 2;
    var y1 = this.player.height / 2;
    var x2 = this.canvas.width - this.player.width / 2;
    var y2 = this.canvas.height - this.player.height / 2;

    /* Update player position */
    var x = this.player.x + this.player.dx;
    var y = this.player.y + this.player.dy;
    if (x < x1) {
        x = x1;
    }
    if (y < y1) {
        y = y1;
    }
    if (x > x2) {
        x = x2;
    }
    if (y > y2) {
        y = y2;
    }

    /* Save current position */
    this.player.x = x;
    this.player.y = y;

    /* Add player position to path */
    if (this.path.length > this.pathlength) {
        this.path = this.path.slice (1, this.pathlength);
    }
    this.path[this.path.length] = [ x, y ];
}

/* Animate cycle */
Game.prototype.animate = function () {
    this.update ();
    this.clear ();
    this.paint ();

    /* Request another animation frame */
    var _self = this;
    window.requestAnimationFrame (function () {
        _self.animate ();
    });
};

Game.prototype.clear = function () {
    var ctx = this.ctx;
    ctx.fillStyle = '#ccc';
    ctx.fillRect (0, 0, this.canvas.width, this.canvas.height);
};

Game.prototype.paint = function () {
    var ctx = this.ctx;

    /* Get player position */
    var x = this.player.x;
    var y = this.player.y;
    var w = this.player.width;
    var h = this.player.height;

    /* Draw path */
    if (this.path.length > 2) {
        ctx.strokeStyle = '#f00';
        ctx.beginPath ();
        ctx.moveTo (this.path[0][0], this.path[0][1]);
        for (var i = 1; i < this.path.length; i++) {
            ctx.lineTo (this.path[i][0], this.path[i][1]);
        }
        ctx.stroke ();
    }

    /* Paint player */
    ctx.fillStyle = '#000';
    ctx.fillRect (x - w/2, y - h/2, w, h);

    /* Paint arrow */
    var alpha = -this.player.alpha * Math.PI * 2 / 360;
    var x0 = 50;
    var y0 = 50;
    var z0 = 0;
    var x1 = Math.sin (alpha) * 30;
    var y1 = Math.cos (alpha) * 30;
    var z1 = 0;
};


var game = new Game ();


