/* Trap errors */
window.onerror = function (msg, url, lineNo, columnNo, error) {
    var string = msg.toLowerCase ();
    var substring = "script error";
    if (string.indexOf (substring) > -1){
        alert ('Script Error: See Browser Console for Detail');
    } else {
        var message = [
            'Message: ' + msg,
            'URL: ' + url,
            'Line: ' + lineNo,
            'Column: ' + columnNo,
            'Error object: ' + JSON.stringify(error)
        ].join(' - ');

        alert (message);
    }
    return false;
};

/* Construct game */
function Game () {
    /* Initialize object */
    this.path = [];
    this.pathlength = 20;
    this.borderwidth = 5;
    this.scene = new Scene ({});
    this.images = {};
    this.x = 0;
    this.y = 0;

    /* Initialize player */
    this.player = new Player ();

    /* Initialize canvas */
    this.canvas = document.getElementById ('canvas');
    this.ctx = canvas.getContext ('2d');

    /* Resize canvas to fill the screen */
    this.resize ();

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

    /* Set up scene */
    this.setup (0);
}
Game.prototype = {};
Game.prototype.constructor = Game;

/* Set up scene */
Game.prototype.setup = function (level) {
    switch (level) {
    case 0:
        this.scene = new Scene ({
            startpos: [ 150, 480 ],
            bounds: [ 10, 10, 1024, 1920 ],
            bg: 'img/bg.png',
            images: {
                counter: 'img/counter.png',
                shelfLeft: 'img/shelfLeft.png',
            },
            objects: [
                [ 'counter', 200, 200 ],
                [ 'shelfLeft', 600, 200 ],
            ],
            paint: function (ctx) {
            },
            update: function () {
            },
        });
        break;

    default:
        throw new Error ('Invalid level ' + level);
    }

    /* Set player start position */
    this.player.x = this.scene.startpos[0];
    this.player.y = this.scene.startpos[1];

    /* Load background image */
    this.bg = new Image ();
    this.bg.src = this.scene.bg;

    /* Load images */
    this.images = {};
    for (var i in this.scene.images) {
        var img = new Image ();
        img.src = this.scene.images[i];
        this.images[i] = img;
    }

    /* Reset path */
    this.path = [];
};

/* Handle window resize */
Game.prototype.resize = function (e) {
    /* Compute aspect ratio */
    var ratio = this.canvas.width / this.canvas.height;

    /* Compute new width and height */
    var h = window.innerHeight;
    var w = Math.round (h * ratio);

    /* Scale canvas */
    this.canvas.style.width = w+'px';
    this.canvas.style.height = h+'px';
};

/* Update player position */
Game.prototype.update = function () {
    /* Get constraints */
    var bounds = this.scene.bounds;
    var x1 = bounds[0] + this.player.width / 2;
    var y1 = bounds[1] + this.player.height / 2;
    var x2 = bounds[2] - this.player.width / 2;
    var y2 = bounds[3] - this.player.height / 2;

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

    /* Compute aspect ratio */
    var ratio = this.canvas.width / this.canvas.height;

    /* Compute width and height of screen in scaled coordinates */
    var w = window.innerWidth * (this.canvas.height / window.innerHeight);
    var h = window.innerHeight * (this.canvas.height / window.innerHeight);

    /* Center screen on player */
    var x0 = x - w / 2;
    var y0 = y - h / 2;
    if (x0 + w > bounds[2] + this.borderwidth) {
        x0 = bounds[2] + this.borderwidth - w;
    }
    if (y0 + h > bounds[3] + this.borderwidth) {
        y0 = bounds[3] + this.borderwidth - h;
    }
    if (x0 < 0) {
        x0 = 0;
    }
    if (y0 < 0) {
        y0 = 0;
    }
    this.x = x0;
    this.y = y0;

    /* Animate player */
    this.player.update ();
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
    var bounds = this.scene.bounds;

    /* Scroll view */
    ctx.save ();
    ctx.translate (-this.x, -this.y);

    /* Draw background image */
    if (this.bg) {
        ctx.drawImage (this.bg, 0, 0);
    }

    /* Draw background grid */
    var d = 100;
    ctx.strokeStyle = 'rgba(0,0,0,0.2)';
    ctx.beginPath ();
    for (var i = bounds[0] + d; i < bounds[2]; i += d) {
        ctx.moveTo (i, bounds[1]);
        ctx.lineTo (i, bounds[3]);
    }
    for (var i = bounds[1] + d; i < bounds[3]; i += d) {
        ctx.moveTo (bounds[0], i);
        ctx.lineTo (bounds[2], i);
    }
    ctx.stroke ();

    /* Draw objects */
    for (var i in this.scene.objects) {
        var arr = this.scene.objects[i];
        ctx.drawImage (this.images[arr[0]], arr[1], arr[2]);
    }

    /* Draw scene boundary */
    var bw = this.borderwidth;
    ctx.fillStyle = '#f0f';
    ctx.beginPath ();
    ctx.moveTo (bounds[0], bounds[1]);
    ctx.lineTo (bounds[2], bounds[1]);
    ctx.lineTo (bounds[2], bounds[3]);
    ctx.lineTo (bounds[0], bounds[3]);
    ctx.lineTo (bounds[0], bounds[1]);
    ctx.moveTo (bounds[0] - bw, bounds[1] - bw);
    ctx.lineTo (bounds[0] - bw, bounds[3] + bw);
    ctx.lineTo (bounds[2] + bw, bounds[3] + bw);
    ctx.lineTo (bounds[2] + bw, bounds[1] - bw);
    ctx.lineTo (bounds[0] - bw, bounds[1] - bw);
    ctx.fill ();

    /* Get player position */
    var x = this.player.x;
    var y = this.player.y;
    var w = this.player.width;
    var h = this.player.height;

    /* Draw player's path */
    if (this.path.length > 2) {
        ctx.strokeStyle = '#f00';
        ctx.beginPath ();
        ctx.moveTo (this.path[0][0], this.path[0][1]);
        for (var i = 1; i < this.path.length; i++) {
            ctx.lineTo (this.path[i][0], this.path[i][1]);
        }
        ctx.stroke ();
    }

    /* Draw player */
    this.player.paint (ctx);
    ctx.fillStyle = '#000';
    ctx.fillText (this.player.phase, 10, 20);

    /* Restore position */
    ctx.restore ();
};

/* Initialize game */
var game = null;
$(document).ready (function () {
    game = new Game ();
});


