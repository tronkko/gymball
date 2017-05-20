/* Construct scene */
function Scene (arr) {
    /* Set defaults */
    this.startpos = [ 0, 0 ];
    this.images = {
        counter: 'img/counter.png',
        shelfLeft: 'img/shelfLeft.png',
        basket: 'img/basket.png',
        shelfTop: 'img/shelfTop.png',
        banaani: 'img/banaani.png',
        jauhopussi: 'img/jauhopussi.png',
        kahvi: 'img/kahvi.png',
        kala: 'img/kala.png',
        kettukarkki: 'img/kettukarkki.png',
        kukka: 'img/kukka.png',
        makkara: 'img/makkara.png',
        omena: 'img/omena.png',
        pullapussi: 'img/pullapussi.png',
        bg: 'img/bg.png',
        shelfRight: 'img/shelfRight.png',
        grandmaList: 'img/grandmaList.png',
        euro: 'img/omena.png',
    };
    this.background = 'bg';
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
        shelfRight: [
            [ 5, 5 ],
            [ 50, 6 ],
            [ 79, 75 ],
            [ 79, 251 ],
            [ 17, 252 ],
            [ 3, 235 ],
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



