/* Construct game */
function Game () {
    /* Initialize object */
    this.scene = new Scene ({});
    this.money = 1000.0;

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
    this.setup (2);
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
                [ 'kahvi', 0+80, 900+20, 0 ],
                [ 'kahvi', 500+80, 900+20, 0 ],
                [ 'euro', 150+10, 140+100, 1 ],
            ],
            money: 55,
            required: {
                jauhopussi: 1,
            },
            success: function (game) {
                game.setup (1);
            },
            failure: function (game) {
                game.setup (0);
            },
        });
        break;

    case 1:
        this.scene = new StaticScene ({
            background: 'grandmaList',
            next: function (game) {
                game.setup (2);
            },
        });
        break;

    case 2:
        this.scene = new PlayScene ({
            startpos: [ 400, 940 ],
            bounds: [ 0, 0, 720, 1024 ],
            obstacles: [
                [ 'counter', 550, 140 ],
                [ 'shelfLeft', 600, 600 ],
                [ 'shelfTop', 0, 900 ],
                [ 'shelfTop', 500, 900 ],
                [ 'basket', 300, 600 ],
                [ 'shelfRight', 10, 250 ],
            ],
            collectibles: [
                [ 'banaani', 300+10, 600+10, 0 ],
                [ 'jauhopussi', 600+10, 600+80, 1 ],
                [ 'jauhopussi', 10+20, 250+80, 1 ],
                [ 'makkara', 0+80, 900+20, 0 ],
                [ 'kettukarkki', 500+80, 900+20, 0 ],
                [ 'euro', 550+10, 140+100, 1 ],
            ],
            money: 30,
            required: {
                jauhopussi: 2,
            },
            success: function (game) {
                game.setup (3);
            },
            failure: function (game) {
                game.setup (2);
            },
        });
        break;

    case 3:
        this.scene = new StaticScene ({
            background: 'grandmaList',
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


