/* Construct scene */
function Scene (arr) {
    /* Set defaults */
    this.startpos = [ 0, 0 ];
    this.images = {};
    this.pathlength = 20;
    this.borderwidth = 5;

    /* Set properties */
    for (var i in arr) {
        this[i] = arr[i];
    }

    /* Load images */
    for (var i in this.images) {
        /* Get image source */
        var src = this.images[i];

        /* Load Image */
        var img = new Image ();
        img.src = src;

        /* Replace image source with the actual image */
        this.images[i] = img;
    }
}
Scene.prototype = {};
Scene.prototype.contructor = Scene;

Scene.prototype.update = function (game) {
    /*NOP*/;
};

Scene.prototype.paint = function (ctx) {
    /*NOP*/;
};


