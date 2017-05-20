function PlayScene (arr) {
    /* Set default properties */
    this.player = new Player ();
    this.path = [];
    this.scrollx = 0;
    this.scrolly = 0;
    this.phase = 0;
    this.start = new Date ();
    this.fadeIn = 1000;
    this.fadeOut = 1000;

    /* Assign properties */
    Scene.call (this, arr);

    /* Set player start position */
    this.player.x = this.startpos[0];
    this.player.y = this.startpos[1];
}
PlayScene.prototype = Object.create (Scene.prototype);
PlayScene.prototype.constructor = PlayScene;

PlayScene.prototype.update = function (game) {
    /* Update phase */
    var now = new Date ();
    this.phase = now.getTime () - this.start.getTime ();

    /* Get canvas dimensions */
    var cw = game.canvas.width;
    var ch = game.canvas.height;

    /* Get constraints */
    var bounds = this.bounds;
    var x1 = bounds[0] + this.player.width / 2;
    var y1 = bounds[1] + this.player.height / 2;
    var x2 = bounds[2] - this.player.width / 2;
    var y2 = bounds[3] - this.player.height / 2;

    /* Update player position while staying inside boundary */
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

    /* Save current player position */
    this.player.x = x;
    this.player.y = y;

    /* Add player position to path */
    if (this.path.length > this.pathlength) {
        this.path = this.path.slice (1, this.pathlength);
    }
    this.path[this.path.length] = [ x, y ];

    /* Animate player */
    this.player.update ();

    /* Compute aspect ratio */
    var ratio = cw / ch;

    /* Compute width and height of screen in scaled coordinates */
    var w = window.innerWidth * (ch / window.innerHeight);
    var h = window.innerHeight * (ch / window.innerHeight);

    /* Center screen on player */
    var x = this.player.x;
    var y = this.player.y;
    var bw = this.borderwidth;
    var x0 = x - w / 2;
    var y0 = y - h / 2;
    if (x0 + w > bounds[2] + bw) {
        x0 = bounds[2] + bw - w;
    }
    if (y0 + h > bounds[3] + bw) {
        y0 = bounds[3] + bw - h;
    }
    if (x0 < 0) {
        x0 = 0;
    }
    if (y0 < 0) {
        y0 = 0;
    }
    this.scrollx = x0;
    this.scrolly = y0;
};

PlayScene.prototype.paint = function (ctx) {
    ctx.save ();

    /* Fade in and out */
    if (this.phase < this.fadeIn) {

        /* Fading in */
        ctx.globalAlpha = this.phase / this.fadeIn;

    } else {

        /* Static display */
        ctx.globalAlpha = 1.0;

    }

    /* Scroll view */
    ctx.translate (-this.scrollx, -this.scrolly);

    /* Draw background image */
    if (this.images['background']) {
        ctx.drawImage (this.images['background'], 0, 0);
    }

    /* Draw background grid */
    var d = 100;
    ctx.strokeStyle = 'rgba(0,0,0,0.2)';
    ctx.beginPath ();
    var bounds = this.bounds;
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
    for (var i in this.objects) {
        var arr = this.objects[i];
        var id = arr[0];
        if (this.images[id]) {
            ctx.drawImage (this.images[id], arr[1], arr[2]);
        }
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

    /* Restore coordinate system */
    ctx.restore ();
};

