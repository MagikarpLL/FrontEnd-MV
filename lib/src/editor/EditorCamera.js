define(['Editor'], function (Editor) {
    function EditorCamera() {
        this.downX = -1;
        this.downY = -1;
        this.down = false;
    }
    EditorCamera.prototype = new Editor("EditorCamera");

    EditorCamera.prototype.onMouseDown = function (event) {
        this.down = true;
        this.downX = event.clientX;
        this.downY = event.clientY;
        event.preventDefault();
    };
    EditorCamera.prototype.onMouseMove = function (event) {
        if (this.down) {
            var dx = (this.downX - event.clientX);
            var dy = (event.clientY - this.downY);
            this.downX = event.clientX;
            this.downY = event.clientY;
            this.container.camera.lng += dx * 0.1;
            this.container.camera.lat += dy * 0.1;
        }
    };
    EditorCamera.prototype.onMouseUp = function (event) {
        this.down = false;
    };

    return EditorCamera;
});