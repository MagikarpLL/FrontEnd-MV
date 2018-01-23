define(['Editor'], function (Editor) {
    function EditorClickScene() {
        this.down = false;
        this.moved = false;
    }
    EditorClickScene.prototype = new Editor("EditorClickScene");

    EditorClickScene.prototype.add = function(container) {
        Editor.prototype.add.call(this, container);

        this.lineLayer = container.getLayer("LayerSceneIcon");
        this.camera = container.camera;
    };

    EditorClickScene.prototype.onMouseDown = function (event) {
        this.down = true;
        this.moved = false;
    };
    EditorClickScene.prototype.onMouseMove = function (event) {
        if (this.down) {
            this.moved = true;
        }
    };
    EditorClickScene.prototype.onMouseUp = function (event) {
        var container = this.container;
        if (this.down && !this.moved) {
            var intersected = this.camera.raySelect(event.clientX, event.clientY, this.lineLayer.group);
            if (intersected.length > 0) {
                var scene = intersected[0].object.userData;
                console.log(scene);
                setTimeout(function () {
                    container.loadScene(container.stage, scene.id);
                }, 0);
            }
        }
        this.down = false;
        this.moved = false;
    };

    return EditorClickScene;
});