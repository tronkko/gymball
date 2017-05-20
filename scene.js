/* Construct scene */
function Scene (arr) {
    /* Set defaults */
    this.startpos = [ 0, 0 ];
    this.images = {};
    this.borderwidth = 5;
    this.polygons = {
        counter: [
            [ 13, 17 ],
            [ 103, 16 ],
            [ 95, 252 ],
            [ 5, 249 ],
        ],
        shelfLeft: [
            [ 50, 72 ],
            [ 78, 5 ],
            [ 123, 5 ],
            [ 124, 235 ],
            [ 110, 252 ],
            [ 50, 251 ],
        ],
        shelfTop: [
            [ 32, 27 ],
            [ 224, 26 ],
            [ 253, 81 ],
            [ 253, 124 ],
            [ 3, 124 ],
            [ 3, 83 ],
        ],
        basket: [
            [ 11, 11 ],
            [ 116, 7 ],
            [ 114, 116 ],
            [ 16, 115 ],
        ],
    };

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

Scene.prototype.next = function (game) {
    /*NOP*/;
};


