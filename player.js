/* Construct player */
function Player () {
    /* Set initial position */
    this.x = 0;
    this.y = 0;
    this.dx = 0;
    this.dy = 0;
    this.speed = 0.5;
    this.width = 128;
    this.height = 128;
    this.sensitivity = 2;
    this.alpha = 0;
    this.beta = 0;
    this.gamma = 0;

    /* Load sprite sheet */
    this.spritesheet = new Image ();
    this.spritesheet.src = 'img/grandpaSpriteSheet.png';
    this.phase = 0;
    this.direction = 'still';
    this.animspeed = 2;

    /* Install device orientation event */
    var _self = this;
    if (window.DeviceOrientationEvent) {
        window.addEventListener ('deviceorientation', function (ev) {
            _self.motion (ev);
            return true;
        }, false);
    } else {
        throw new Error(
            'DeviceOrientation not supported in this device, sorry!');
    }
}
Player.prototype = {};
Player.prototype.constructor = Player;

/* Handle change of orientation */
Player.prototype.motion = function (ev) {
    /* Gamma is the left-to-right tilt in degrees, where right is positive */
    var lr = ev.gamma;

    /* Beta is the front-to-back tilt in degrees, where front is positive */
    var fb = ev.beta;

    /* Alpha is the compass direction the device is facing in degrees */
    var dir = ev.alpha

    /* Compute direction of change */
    var dx = lr;
    var dy = fb;

    /* Allow small error in movement */
    var len = Math.sqrt (dx * dx + dy * dy);
    if (len > this.sensitivity) {
        /* Movement large enough */
        this.dx = dx * this.speed;
        this.dy = dy * this.speed;
    } else {
        this.dx = 0;
        this.dy = 0;
    }

    /* Save raw motion direction */
    this.alpha = ev.alpha;
    this.beta = ev.beta;
    this.gamma = ev.gamma;
};

/* Paint player */
Player.prototype.paint = function (ctx) {
    /* Compute upper left coordinate on screen */
    var x0 = this.x - this.width / 2;
    var y0 = this.y - this.height / 2;

    /* Compute row in sprite sheet */
    var row;
    switch (this.direction) {
    case 'up':
    case 'still':
        row = 0;
        break;

    case 'right':
        row = 2;
        break;

    case 'left':
        row = 1;
        break;

    case 'down':
        row = 3;
        break;

    default:
        throw new Error ('Invalid direction ' + this.direction);
    }

    /* Compute column in sprite sheet */
    var column = Math.floor (this.phase / this.animspeed);

    /* Draw player */
    ctx.drawImage(
        this.spritesheet,
        column * this.width,
        row * this.height,
        this.width,
        this.height,
        x0,
        y0,
        this.width,
        this.height
    );
};

/* Animate player */
Player.prototype.update = function () {
    /* Get distance moved */
    var dx = this.dx;
    var dy = this.dy;
    var distance = Math.sqrt (dx * dx + dy * dy);

    /* Change direction */
    switch (this.direction) {
    case 'still':
        /* Wait until player starts moving */
        if (this.phase < this.animspeed) {
            if (distance < 0.001) {
                /* Player standing still, no animation */
                break;
            }
        }
        /*FALLTHROUGH*/

    case 'up':
    case 'left':
    case 'right':
    case 'down':
        /* Change direction when at phase zero */
        if (this.phase < this.animspeed) {
            if (distance > 0.001) {
                /* Still moving */
                if (Math.abs (this.dx) < Math.abs (this.dy)) {
                    /* Moving primarily in up and down direction */
                    if (this.dy < 0) {
                        this.direction = 'up';
                    } else {
                        this.direction = 'down';
                    }
                } else {
                    /* Moving primarily in left-right direction */
                    if (this.dx < 0) {
                        this.direction = 'left';
                    } else {
                        this.direction = 'right';
                    }
                }

            } else {
                /* Player stopped */
                this.direction = 'still';
            }
        }

        /* Advance animation */
        this.phase++;
        var i = Math.floor (this.phase / this.animspeed);
        if ((i + 1) * this.width > this.spritesheet.width) {
            /* Restart from frame zero */
            this.phase = 0;
        }
        break;

    default:
        throw new Error ('Invalid direction ' + this.direction);
    }
};


