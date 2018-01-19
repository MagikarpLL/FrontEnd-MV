define(['Editor'], function (Editor) {
    function EditorErase() {
        this.down = false;
    }
    EditorErase.prototype = new Editor("EditorErase");

    EditorErase.prototype.add = function (container) {
        Editor.prototype.add.call(this, container);
        this.lineLayer = container.getLayer("LayerLines");
    };

    EditorErase.prototype.onMouseDown = function (event) {
        this.down = true;
    };
    EditorErase.prototype.onMouseMove = function (event) {
        if (this.down) {
            this.lineLayer.removeLine(event.clientX, event.clientY);
        }
    };
    EditorErase.prototype.onMouseUp = function (event) {
        this.down = false;
    };

    return EditorErase;
});