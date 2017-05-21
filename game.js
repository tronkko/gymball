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
    this.setup (0);
}
Game.prototype = {};
Game.prototype.constructor = Game;

/* Set up scenes */
Game.prototype.setup = function (level) {
    switch (level) {
    case 0:
        this.scene = new StaticScene ({
            background: 'tossunalla',
            delay: 10000,
            next: function (game) {
                game.setup (10);
            },
        });
        break;

    case 10:
        this.scene = new StaticScene ({
            background: 'grandmaList',
            delay: 3000,
            text: [
                '',
                'Maanantai',
            ],
            next: function (game) {
                game.setup (11);
            },
        });
        break;

    case 11:
        this.scene = new StaticScene ({
            background: 'grandmaList',
            delay: 5000,
            text: [
                'Hae kaupasta:',
                'jauhopaketti',
            ],
            next: function (game) {
                game.setup (12);
            },
        });
        break;

    case 12:
        this.scene = new PlayScene ({
            startpos: [ 400, 940 ],
            exitpos: [ 250, 70 ],
            bounds: [ 0, 0, 720, 1024 ],
            obstacles: [
                [ 'counter', 50, 240 ],
                [ 'shelfLeft', 500, 200 ],
                [ 'shelfTop', 0, 900 ],
                [ 'shelfTop', 500, 900 ],
                [ 'basket', 300, 600 ],
            ],
            collectibles: [
                [ 'banaani', 300+10, 600+10, 0 ],
                [ 'jauhopussi', 500+10, 200+80, 1 ],
                [ 'kahvi', 0+80, 900+20, 0 ],
                [ 'kahvi', 500+80, 900+20, 0 ],
            ],
            cashier: [ 'euro', 50, 240+120, 1 ],
            money: 55,
            required: {
                jauhopussi: 1,
            },
            success: function (game) {
                game.setup (19);
            },
            failure: function (game) {
                game.setup (13);
            },
        });
        break;

    case 13:
        this.scene = new StaticScene ({
            background: 'grandmaAngry',
            delay: 5000,
            text: [
            ],
            next: function (game) {
                game.setup (11);
            },
        });
        break;

    case 19:
        this.scene = new StaticScene ({
            background: 'grandmaList',
            delay: 3000,
            text: [
                '',
                'Hyvä!',
            ],
            next: function (game) {
                game.setup (20);
            },
        });
        break;

    case 20:
        this.scene = new StaticScene ({
            background: 'grandmaList',
            delay: 3000,
            text: [
                '',
                'Tiistai',
            ],
            next: function (game) {
                game.setup (21);
            },
        });
        break;

    case 21:
        this.scene = new StaticScene ({
            background: 'grandmaList',
            delay: 5000,
            text: [
                'Hae kaupasta:',
                'kalaa',
                'kahvipaketti',
            ],
            next: function (game) {
                game.setup (22);
            },
        });
        break;

    case 22:
        this.scene = new PlayScene ({
            startpos: [ 400, 940 ],
            exitpos: [ 100, 70 ],
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
                [ 'kala', 600+10, 600+80, 1 ],
                [ 'kahvi', 10+20, 250+80, 1 ],
                [ 'makkara', 0+80, 900+20, 0 ],
                [ 'kettukarkki', 500+80, 900+20, 0 ],
            ],
            cashier: [ 'euro', 550, 140+120, 1 ],
            money: 30,
            required: {
                kala: 1,
                kahvi: 1,
            },
            success: function (game) {
                game.setup (29);
            },
            failure: function (game) {
                game.setup (23);
            },
        });
        break;

    case 23:
        this.scene = new StaticScene ({
            background: 'grandmaAngry',
            text: [
            ],
            next: function (game) {
                game.setup (21);
            },
        });
        break;

    case 29:
        this.scene = new StaticScene ({
            background: 'grandmaList',
            delay: 3000,
            text: [
                '',
                'Hyvä!',
            ],
            next: function (game) {
                game.setup (30);
            },
        });
        break;

    case 30:
        this.scene = new StaticScene ({
            background: 'grandmaList',
            delay: 3000,
            text: [
                '',
                'Keskiviikko',
            ],
            next: function (game) {
                game.setup (31);
            },
        });
        break;

    case 31:
        this.scene = new StaticScene ({
            background: 'grandmaList',
            delay: 5000,
            text: [
                'Hae kaupasta:',
                'kettukarkkia',
                'mansikkaa',
            ],
            next: function (game) {
                game.setup (32);
            },
        });
        break;

    case 32:
        this.scene = new PlayScene ({
            startpos: [ 400, 1440 ],
            exitpos: [ 100, 70 ],
            bounds: [ 0, 0, 720, 1524 ],
            obstacles: [
                [ 'counter', 550, 140 ],

                [ 'shelfLeft', 600, 900 ],
                [ 'shelfRight', 10, 950 ],
                [ 'basket', 300, 1000 ],

                [ 'basket', 400, 700 ],

                [ 'shelfTop', 10, 400 ],
                [ 'shelfBottom', 10, 528 ],
            ],
            collectibles: [
                [ 'kurkku', 10+20, 950+80, 0 ],
                [ 'kettukarkki', 600+10, 900+80, 1 ],
                [ 'makkara', 300+10, 1000+10, 0 ],
                [ 'banaani', 400+10, 700+10, 0 ],
                [ 'pullapussi', 10+80, 400+10, 0 ],
                [ 'mansikka', 10+80, 528+20, 1 ],
            ],
            cashier: [ 'euro', 550, 140+120, 1 ],
            money: 30,
            required: {
                kettukarkki: 1,
                mansikka: 1,
            },
            success: function (game) {
                game.setup (39);
            },
            failure: function (game) {
                game.setup (33);
            },
        });
        break;

    case 33:
        this.scene = new StaticScene ({
            background: 'grandmaAngry',
            text: [
            ],
            next: function (game) {
                game.setup (31);
            },
        });
        break;

    case 39:
        this.scene = new StaticScene ({
            background: 'grandmaList',
            delay: 3000,
            text: [
                '',
                'Hyvä!',
            ],
            next: function (game) {
                game.setup (40);
            },
        });
        break;

    case 40:
        this.scene = new StaticScene ({
            background: 'grandmaList',
            delay: 3000,
            text: [
                '',
                'Torstai',
            ],
            next: function (game) {
                game.setup (41);
            },
        });
        break;

    case 41:
        this.scene = new StaticScene ({
            background: 'grandmaList',
            delay: 5000,
            text: [
                'Hae kaupasta:',
                'kukka',
                'omena',
            ],
            next: function (game) {
                game.setup (42);
            },
        });
        break;

    case 42:
        this.scene = new PlayScene ({
            startpos: [ 400, 1440 ],
            exitpos: [ 100, 70 ],
            bounds: [ 0, 0, 1080, 1524 ],
            obstacles: [
                [ 'counter', 550, 140 ],

                [ 'shelfTop', 200, 1000 ],
                [ 'shelfBottom', 200, 1128 ],
                [ 'shelfTop', 640, 1000 ],
                [ 'shelfBottom', 640, 1128 ],

                [ 'shelfTop', 200, 550 ],
                [ 'shelfBottom', 200, 678 ],
                [ 'shelfTop', 640, 550 ],
                [ 'shelfBottom', 640, 678 ],

                [ 'shelfTop', 0, 1400 ],
                [ 'shelfTop', 500, 1400 ],
            ],
            collectibles: [
                [ 'kukka', 200+80, 1000+10, 1 ],
                [ 'kurkku', 200+80, 1128+20, 0 ],
                [ 'kala', 640+80, 1000+10, 0 ],
                [ 'kettukarkki', 640+80, 1128+20, 0 ],

                [ 'mansikka', 200+80, 550+10, 0 ],
                [ 'kahvi', 200+80, 678+20, 0 ],
                [ 'omena', 640+80, 550+10, 1 ],
                [ 'jauhopussi', 640+80, 678+20, 0 ],

                [ 'kala', 0+80, 1400+10, 0 ],
                [ 'banaani', 500+80, 1400+10, 0 ],
            ],
            cashier: [ 'euro', 550, 140+120, 1 ],
            money: 30,
            required: {
                kukka: 1,
                omena: 1,
            },
            success: function (game) {
                game.setup (49);
            },
            failure: function (game) {
                if (this.money >= 0) {
                    /* Did not get everything */
                    game.setup (43);
                } else {
                    /* Run out of money */
                    game.setup (44);
                }
            },
        });
        break;

    case 43:
        this.scene = new StaticScene ({
            background: 'grandmaAngry',
            text: [
            ],
            next: function (game) {
                game.setup (41);
            },
        });
        break;

    case 44:
        this.scene = new StaticScene ({
            background: 'grandmaList',
            text: [
                '',
                'Raha ei riitä'
            ],
            next: function (game) {
                game.setup (41);
            },
        });
        break;

    case 49:
        this.scene = new StaticScene ({
            background: 'grandmaList',
            delay: 3000,
            text: [
                '',
                'Hyvä!',
            ],
            next: function (game) {
                game.setup (90);
            },
        });
        break;

    case 90:
        this.scene = new StaticScene ({
            background: 'grandmaHappy',
            text: [
                '',
                'Hienosti meni!',
            ],
            next: function (game) {
                game.setup (10);
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


