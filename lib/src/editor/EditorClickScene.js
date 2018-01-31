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
        this.x = event.clientX;
        this.y = event.clientY;
    };
    EditorClickScene.prototype.onMouseMove = function (event) {
        if (this.down) {
            if (this.x !== event.clientX && this.y !== event.clientY) {
                this.moved = true;
            }
        }
    };
    EditorClickScene.prototype.onMouseUp = function (event) {
        var container = this.container;
        if (this.down && !this.moved) {
            var intersected = this.camera.raySelect(event.offsetX, event.offsetY, this.lineLayer.group);
            if (intersected.length > 0) {
                var scene = intersected[0].object.userData;
                setTimeout(function () {
                    container.loadScene(container.stage, scene.id);
                }, 0);
                event.preventDefault();
            }
        }
        this.down = false;
        this.moved = false;
    };

    return EditorClickScene;
});