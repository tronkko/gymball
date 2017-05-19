/* Construct scene */
function Scene (arr) {
    for (var i in arr) {
        this[i] = arr[i];
    }
}

