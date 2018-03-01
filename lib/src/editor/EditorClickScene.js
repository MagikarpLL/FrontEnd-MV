define(['Editor', 'THREE'], function (Editor, THREE) {
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
        this.x = event.offsetX;
        this.y = event.offsetY;
    };
    EditorClickScene.prototype.onMouseMove = function (event) {
        if (this.down) {
            if (this.x !== event.offsetX && this.y !== event.offsetY) {
                this.moved = true;
            }
        }
    };
    EditorClickScene.prototype.onMouseUp = function (event) {
        var container = this.container;
        if (this.down && !this.moved) {
            var intersectedScene = this.camera.raySelect(event.offsetX, event.offsetY, this.lineLayer.group);
            if (intersectedScene.length > 0) {
                var scene = intersectedScene[0].object.userData;
                setTimeout(function () {
                    container.loadScene(container.stage, scene.id);
                }, 0);
                event.preventDefault();
            }

            var raycaster = this.camera.raycaster;
            var x = (event.offsetX / this.container.width) * 2 - 1;
            var y = -(event.offsetY / this.container.height) * 2 + 1;
            raycaster.setFromCamera(new THREE.Vector2(x, y), this.container.cameraOrtho);
            var intersectedUi = raycaster.intersectObject(this.container.groupOrtho, true);
            if (intersectedUi.length > 0) {
                this.camera.lng = 0;
                this.container.getEditor("EditorCamera").updateLayers();
            }
        }
        this.down = false;
        this.moved = false;
    };

    return EditorClickScene;
});