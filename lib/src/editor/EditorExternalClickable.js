define(['Editor', 'jquery'], function (Editor, $) {
    function EditorExternalClickable() {
        this.down = false;
        this.moved = false;

        this.selectedItem = undefined;
    }
    EditorExternalClickable.prototype = new Editor("EditorExternalClickable");

    EditorExternalClickable.prototype.add = function (container) {
        Editor.prototype.add.call(this, container);

        this.layer = container.getLayer("LayerExternalData");
        this.clickableGroup = this.layer.getDataType('outdoor_clickable').g;

        this.camera = container.camera;
    };

    EditorExternalClickable.prototype.onMouseDown = function (event) {
        this.down = true;
        this.moved = false;
        this.x = event.offsetX;
        this.y = event.offsetY;
    };
    EditorExternalClickable.prototype.onMouseMove = function (event) {
        if (this.down) {
            if (this.x !== event.offsetX && this.y !== event.offsetY) {
                this.moved = true;
            }
        }
    };
    EditorExternalClickable.prototype.onMouseUp = function (event) {
        if (this.down && !this.moved) {
            var intersected = this.camera.raySelect(event.offsetX, event.offsetY, this.clickableGroup);
            if (intersected.length > 0) {
                var item = intersected[0].object.userData;
                this.selectedItem = item;
                console.log(item.id);
                if (item.onSelected && item.obj) {
                    item.onSelected(item.obj);
                    var coord = this.container.camera.project3dToScreen(item.position3d);
                    if (coord) {
                        item.onUpdate(item, true, coord.x, coord.y);
                    } else {
                        item.onUpdate(item, false, 0, 0);
                    }
                }
                event.preventDefault();
            }
        }
        this.down = false;
        this.moved = false;
    };

    EditorExternalClickable.prototype.update = function (deltatime) {
        if (this.selectedItem) {
            var item = this.selectedItem;
            var coord = this.container.camera.project3dToScreen(item.position3d);
            if (coord) {
                item.onUpdate(item, true, coord.x, coord.y);
            } else {
                item.onUpdate(item, false, 0, 0);
            }
        }
    };

    EditorExternalClickable.prototype.exit = function () {
        if (this.selectedItem) {
            var item = this.selectedItem;
            item.onExit(item);
            this.selectedItem = undefined;
        }
    };


    //TODO update -> if selectedItem -> update x/y

    return EditorExternalClickable;
});