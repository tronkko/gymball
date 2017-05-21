function PlayScene (arr) {
    /* Set default properties */
    this.player = new Player ();
    this.startpos = [ 0, 0 ];
    this.exitpos = [ 0, 0 ];
    this.path = [];
    this.pathlength = 200;
    this.scrollx = 0;
    this.scrolly = 0;
    this.phase = 0;
    this.start = new Date ();
    this.fadeIn = 1000;
    this.fadeOut = 1000;
    this.collected = [];
    this.required = {};
    this.cashier = [];
    this.prices = {
        banaani: 4.32,
        jauhopussi: 1.23,
        kahvi: 4.55,
        kala: 12.37,
        kettukarkki: 2.3,
        kukka: 20.3,
        makkara: 3.2,
        omena: 2.3,
        pullapussi: 4.2,
        euro: 0,
    };
    this.money = 100.0;

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

    /* Avoid obstacles */
    for (var j in this.obstacles) {
        var i = this.obstacles[j][0];
        if (typeof this.polygons[i] == 'undefined') {
            /* No boundary */
            continue;
        }

        /* Get coordinates for obstacle */
        var offsetx = this.obstacles[j][1];
        var offsety = this.obstacles[j][2];
        var coords = this.polygons[i];

        var x0 = coords[coords.length-1][0] + offsetx;
        var y0 = coords[coords.length-1][1] + offsety;
        for (var j = 0; j < coords.length; j++) {
            var x1 = coords[j][0] + offsetx;
            var y1 = coords[j][1] + offsety;

            /* Compute direction vector (x0,y0) - (x1,y1) */
            var dx = (x1 - x0);
            var dy = (y1 - y0);

            /* Compute direction vector (x0,y0) - (x,y) */
            var x4 = x - x0;
            var y4 = y - y0;

            /* Compute unit vector along vector (x0,y0) - (x1,y1) */
            var len = Math.sqrt (dx*dx + dy*dy);
            var x5 = dx / len;
            var y5 = dy / len;

            /* Project vector (x0,y0) -> (x,y) to (x0,y0) - (x1,y1) */
            var dot = (x4*x5 + y4*y5) / len;
            if (dot < 0) {
                dot = 0;
            }
            if (dot > 1) {
                dot = 1;
            }

            /* Compute point closest to player in line (x0,y0) - (x1,y1) */
            var xc = x0 + dot * dx;
            var yc = y0 + dot * dy;

            /* Compute distance to player */
            var dx = x - xc;
            var dy = y - yc;
            var d = Math.sqrt (dx * dx + dy * dy);
            var eps = this.player.width * 0.45;
            if (d < eps) {
                /* Player touches the boundary so bounce him back! */
                x = xc + eps * dx / d;
                y = yc + eps * dy / d;
            }

            x0 = x1;
            y0 = y1;
        }
    }

    /* Save player position (if movement is allowed) */
    this.player.x = x;
    this.player.y = y;

    /* Does the player touch the exit button? */
    if (this.images['exit']) {
        var exitx = this.exitpos[0] + this.images['exit'].width / 2;
        var exity = this.exitpos[1] + this.images['exit'].height / 2;
        var dx = x - exitx;
        var dy = y - exity;
        var distance = Math.sqrt (dx * dx + dy * dy);
        if (distance < this.images['exit'].width / 2) {
            if (this.canExit ()) {
                if (this.gotEverything ()) {
                    this.success (game);
                } else {
                    this.failure (game);
                }
            }
        }
    }

    /* Add player position to path */
    if (this.path.length > this.pathlength) {
        this.path = this.path.slice (1, this.pathlength);
    }
    this.path[this.path.length] = [ x, y + this.player.height * 0.4 ];

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
    var x0 = x - w / 2;
    var y0 = y - h / 2;
    if (x0 + w > bounds[2]) {
        x0 = bounds[2] - w;
    }
    if (y0 + h > bounds[3]) {
        y0 = bounds[3] - h;
    }
    if (x0 < 0) {
        x0 = 0;
    }
    if (y0 < 0) {
        y0 = 0;
    }
    this.scrollx = x0;
    this.scrolly = y0;

    /* Grab collectibles */
    for (var i in this.collectibles) {
        var arr = this.collectibles[i];

        /* Get collectible id */
        var id = arr[0];

        /* Get upper left corner of collectible item */
        var x0 = arr[1];
        var y0 = arr[2];

        /* Get width and height of item */
        var w;
        var h;
        if (this.images[id]) {
            w = this.images[id].width;
            h = this.images[id].height;
        } else {
            w = 100;
            h = 100;
        }

        /* Compute center coordinate of collectible item */
        var x1 = x0 + w / 2;
        var y1 = y0 + h / 2;

        /* Compute distance to player */
        var dx = x - x1;
        var dy = y - y1;
        var distance = Math.sqrt (dx * dx + dy * dy);
        var eps = this.player.width;
        if (distance < eps) {

            /* Add collectible to shopping cart */
            this.collected[this.collected.length] = id;

            /* Substract money from wallet */
            if (typeof this.prices[id] != 'undefined') {
                this.money -= this.prices[id];
            }
            
            /* Exit level if run out of money */
            if (this.money < 0.001) {
                this.failure (game);
            }

            /* Remove collectible from view but save cashier */
            if (id == 'euro') {
                this.cashier = this.collectibles[i];
            }
            delete this.collectibles[i];

            /* 
             * Make sure that cashier is active after you purchase an item.
             * This is essential after player returns to get an items AFTER
             * visiting the cashier.
             */
            switch (id) {
            case 'euro':
                /* No need to visit cashier */
                /*NOP*/;
                break;

            default:
                /* Must visit cashier */
                if (this.cashier.length > 0) {
                    this.collectibles[this.collectibles.length] = this.cashier;
                    this.cashier = [];
                }
            }
            break;

        }

    }
};
PlayScene.prototype.canExit = function () {
    var exit = true;

    /* Check whether player can exit the shop */
    for (var i in this.collected) {
        var id = this.collected[i];
        switch (id) {
        case 'euro':
            /* Went through cashier */
            exit = true;
            break;

        default:
            /* Bought something, require visit to cashier */
            exit = false;
        }
    }

    /* Player cannot exit the shop emptyhanded */
    if (this.collected.length == 0) {
        exit = false;
    }
    return exit;
};

PlayScene.prototype.paint = function (ctx) {
    ctx.save ();

    /* Fade in and out */
    if (this.phase < this.fadeIn) {
        ctx.globalAlpha = this.phase / this.fadeIn;
    } else {
        ctx.globalAlpha = 1.0;
    }

    /* Scroll view */
    ctx.translate (-this.scrollx, -this.scrolly);

    /* Draw background image */
    if (this.images[this.background]) {
        ctx.drawImage (this.images[this.background], 0, 0);
    }

    /* Draw exit arrow */
    if (this.canExit ()) {
        if (this.images['exit']) {
            ctx.drawImage(
                this.images['exit'],
                this.exitpos[0],
                this.exitpos[1]
            );
        }
    } else {
        if (this.images['noexit']) {
            ctx.drawImage(
                this.images['noexit'],
                this.exitpos[0],
                this.exitpos[1]
            );
        }
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

    /* Draw obstacles */
    for (var i in this.obstacles) {
        var arr = this.obstacles[i];
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

    /* Draw obstacle boundaries */
    ctx.strokeStyle = '#f0f';
    for (var j in this.obstacles) {
        /* See if object has a boundary */
        var i = this.obstacles[j][0];
        if (typeof this.polygons[i] == 'undefined') {
            /* Boundary not defined */
            continue;
        }

        /* Get coordinates for obstacle */
        var offsetx = this.obstacles[j][1];
        var offsety = this.obstacles[j][2];
        var coords = this.polygons[i];

        /* Draw obstacle boundary */
        ctx.beginPath ();
        var x0 = coords[coords.length-1][0] + offsetx;
        var y0 = coords[coords.length-1][1] + offsety;
        ctx.moveTo (x0, y0);
        for (var j = 0; j < coords.length; j++) {
            var x1 = coords[j][0] + offsetx;
            var y1 = coords[j][1] + offsety;
            ctx.lineTo (x1, y1);

            x0 = x1;
            y0 = y1;
        }
        ctx.stroke ();
    }

    /* Draw collectibles */
    var highlight = true;
    for (var i in this.collectibles) {
        var arr = this.collectibles[i];
        var id = arr[0];
        if (!this.images[id]) {
            continue;
        }

        /* Highlight first active item */
        if (arr[3]  &&  highlight) {
            /* Highlight item */
            var w = this.images[id].width;
            var h = this.images[id].height;
            var x0 = arr[1] + w / 2;
            var y0 = arr[2] + h / 2;
            var d = 1 + Math.abs ((this.phase % 1000) / 1000 * 2 - 1) * 0.2;
            ctx.drawImage (
                this.images[id], 
                0,
                0,
                w,
                h,
                x0 - w * d / 2,
                y0 - h * d / 2,
                w * d,
                h * d
            );
            highlight = false;
        } else {
            /* No highlight */
            ctx.drawImage (this.images[id], arr[1], arr[2]);
        }
    }

    /* Get player position */
    var x = this.player.x;
    var y = this.player.y;
    var w = this.player.width;
    var h = this.player.height;

    /* Draw player's path */
    if (this.path.length > 3) {
        ctx.lineWidth = 2;

        ctx.strokeStyle = 'rgba(255,0,0,0.2)';
        ctx.beginPath ();
        ctx.moveTo (this.path[0][0], this.path[0][1]);
        for (var i = 2; i < this.path.length * 1 / 4; i++) {
            ctx.lineTo (this.path[i][0], this.path[i][1]);
        }
        ctx.stroke ();

        ctx.strokeStyle = 'rgba(255,0,0,0.5)';
        ctx.beginPath ();
        ctx.moveTo (this.path[0][0], this.path[0][1]);
        for (var i = 2; i < this.path.length * 2 / 4; i++) {
            ctx.lineTo (this.path[i][0], this.path[i][1]);
        }
        ctx.stroke ();

        ctx.strokeStyle = 'rgba(255,0,0,0.7)';
        ctx.beginPath ();
        ctx.moveTo (this.path[0][0], this.path[0][1]);
        for (var i = 2; i < this.path.length * 3 / 4; i++) {
            ctx.lineTo (this.path[i][0], this.path[i][1]);
        }
        ctx.stroke ();

        ctx.strokeStyle = 'rgba(255,0,0,1.0)';
        ctx.beginPath ();
        ctx.moveTo (this.path[0][0], this.path[0][1]);
        for (var i = 2; i < this.path.length; i++) {
            ctx.lineTo (this.path[i][0], this.path[i][1]);
        }
        ctx.stroke ();

        ctx.lineWidth = 1;
    }

    /* Draw player */
    this.player.paint (ctx);

    /* Restore coordinate system */
    ctx.restore ();

    /* Compute width of screen in scaled coordinates */
    var cw = ctx.canvas.width;
    var ch = ctx.canvas.height;
    var w = window.innerWidth * (ch / window.innerHeight);
    if (w > cw) {
        w = cw;
    }

    /* Draw HUD background */
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fillRect (0, 0, w, 80);

    /* Format money */
    var euros = Math.floor (this.money);
    var cents = '' + (100 + Math.floor ((this.money % 1) * 100));
    var money = 'Eurot ' + euros + ',' + cents.substr (1);

    /* Output money */
    ctx.fillStyle = 'rgba(255,255,255,1)';
    ctx.font = '48px Arial';
    ctx.textAlign = 'left';
    ctx.fillText (money, 10, 60);

    /* Format time */
    var time = 'Aika ';
    var t = Math.floor (this.phase / 1000);
    var min = Math.floor (t / 60);
    if (min < 10) {
        time += '0' + min;
    } else {
        time += min;
    }
    time += ':';
    var sec = Math.floor (t % 60);
    if (sec < 10) {
        time += '0' + sec;
    } else {
        time += sec;
    }

    /* Paint time */
    ctx.fillStyle = 'rgba(255,255,255,1)';
    ctx.font = '48px Arial';
    ctx.textAlign = 'right';
    ctx.fillText (time, w - 10, 60);
};

/* Check if player got everything */
Scene.prototype.gotEverything = function () {
    /* Compute items in the cart */
    var counts = {};
    for (var i in this.collected) {
        var id = this.collected[i];
        if (typeof counts[id] == 'undefined') {
            counts[id] = 0;
        }
        counts[id]++;
    }

    /* Loop through required items */
    var ok = true;
    for (var id in this.required) {
        /* Get number of items required */
        var required = this.required[id];

        /* Get number of items bought */
        if (typeof counts[id] != 'undefined') {
            collected = counts[id];
        } else {
            collected = 0;
        }

        /* See if the request is fulfilled */
        if (collected < required) {
            ok = false;
            break;
        }
    }

    /* Did not get everything if run out of money */
    if (this.money < 0.001) {
        ok = false;
    }
    return ok;
};
