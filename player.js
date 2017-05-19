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


