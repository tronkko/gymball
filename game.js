/* Construct game */
function Game () {
    /* Initialize object */
    this.scene = new Scene ({});

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

    /* Set up first scene */
    this.setup (0);
}
Game.prototype = {};
Game.prototype.constructor = Game;

/* Set up scene */
Game.prototype.setup = function (level) {
    switch (level) {
    case 0:
        this.scene = new PlayScene ({
            startpos: [ 400, 940 ],
            bounds: [ 0, 0, 720, 1024 ],
            images: {
                counter: 'img/counter.png',
                shelfLeft: 'img/shelfLeft.png',
                basket: 'img/basket.png',
                shelfTop: 'img/shelfTop.png',
                jauhopussi: 'img/jauhopussi.png',
                banaani: 'img/banaani.png',
                background: 'img/bg.png',
            },
            obstacles: [
                [ 'counter', 150, 140 ],
                [ 'shelfLeft', 450, 200 ],
                [ 'shelfTop', 0, 900 ],
                [ 'shelfTop', 500, 900 ],
                [ 'basket', 300, 600 ],
            ],
            collectibles: [
                [ 'banaani', 300+10, 600+10, 0 ],
                [ 'jauhopussi', 450+10, 200+80, 1 ],
                [ 'jauhopussi', 150+10, 140+100, 1 ],
            ],
            next: function (game) {
                game.setup (1);
            },
        });
        break;

    case 1:
        this.scene = new StaticScene ({
            images: {
                background: 'img/grandmaList.png',
            },
            next: function (game) {
                game.setup (0);
            },
        });
        break;

    default:
        throw new Error ('Invalid level ' + level);
    }
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

/* Update game screen */
Game.prototype.update = function () {
    this.scene.update (this);
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
    this.scene.paint (ctx);
};

/* Initialize game */
var game = null;
$(document).ready (function () {
    game = new Game ();
});


