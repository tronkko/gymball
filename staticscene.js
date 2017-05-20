function StaticScene (arr) {
    /* Set defaults */
    this.phase = 0;
    this.start = new Date ();
    this.delay = 5000;
    this.fadeIn = 1000;
    this.fadeOut = 1000;

    /* Set up common properties */
    Scene.call (this, arr);
}
StaticScene.prototype = Object.create (Scene.prototype);
StaticScene.prototype.constructor = StaticScene;

StaticScene.prototype.update = function (game) {
    /* Update phase */
    var now = new Date ();
    this.phase = now.getTime () - this.start.getTime ();

    /* Set up next scene */
    if (this.phase > this.delay) {
        this.next (game);
    }
};

StaticScene.prototype.paint = function (ctx) {
    ctx.save ();

    /* Paint according phase */
    if (this.phase < this.fadeIn) {

        /* Fading in */
        ctx.globalAlpha = this.phase / this.fadeIn;

    } else if (this.phase < this.delay - this.fadeOut) {

        /* Static display */
        ctx.globalAlpha = 1.0;

    } else {

        /* Fading out */
        ctx.globalAlpha = (this.delay - this.phase) / this.fadeOut;

    }

    /* Draw background image */
    if (this.images[this.background]) {
        ctx.drawImage (this.images[this.background], 0, 0);
    }

    ctx.restore ();
};

