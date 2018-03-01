define(['Editor'], function (Editor) {
    function EditorCamera() {
        this.downX = -1;
        this.downY = -1;
        this.down = false;
    }
    EditorCamera.prototype = new Editor("EditorCamera");

    EditorCamera.prototype.onMouseDown = function (event) {
        this.down = true;
        this.downX = event.offsetX;
        this.downY = event.offsetY;
        event.preventDefault();
    };
    EditorCamera.prototype.updateLayers = function () {
        this.container.camera.update();
        this.container.getLayer("LayerAmap").syncCamera();
        this.container.getLayer("LayerDistance").syncPosition();
        this.container.getLayer("LayerHeight").syncPosition();
        this.container.getLayer("LayerArea").syncPosition();
        this.container.getLayer("LayerText").syncPosition();
    };
    EditorCamera.prototype.onMouseMove = function (event) {
        if (this.down) {
            if (event.which === 0 && event.button === 0) {
                EditorCamera.prototype.onMouseUp.call(this);
                return;
            }

            var dx = (this.downX - event.offsetX);
            var dy = (event.offsetY - this.downY);
            var tan_fovd2 = Math.tan(this.container.camera.fov / 2 / 180 * Math.PI);
            this.downX = event.offsetX;
            this.downY = event.offsetY;
            this.container.camera.lng += dx * 0.1 * tan_fovd2;
            this.container.camera.lat += dy * 0.1 * tan_fovd2;
            this.updateLayers();
        }
    };
    EditorCamera.prototype.onMouseUp = function (event) {
        this.down = false;
        this.updateLayers();
    };
    EditorCamera.prototype.onMouseWheel = function (event) {
        this.container.camera.fov = this.container.camera.fov + event.deltaY * 0.05;
        this.updateLayers();
    };

    return EditorCamera;
});