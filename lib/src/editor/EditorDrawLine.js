define(['Editor', 'THREE', 'Meshline'], function (Editor, THREE, Meshline) {
    function EditorDrawLine() {
        this.down = false;
        this.moved = false;
        this.color = 0x0000ff;
    }
    EditorDrawLine.prototype = new Editor("EditorDrawLine");

    EditorDrawLine.prototype.add = function (container) {
        Editor.prototype.add.call(this, container);
    };

    EditorDrawLine.prototype.setColor = function (color) {
        //TODO default color?
        this.color = color;
        //TODO change current material color
    };

    EditorDrawLine.prototype.onMouseDown = function (event) {
        this.down = true;
        this.moved = false;
    };
    EditorDrawLine.prototype.onMouseMove = function (event) {
        if (this.down) {
            if (event.which === 0 && event.button === 0) {
                EditorDrawLine.prototype.onMouseUp.call(this);
                return;
            }

            if(this.line) {
                this.group.remove(this.line);
            }
            if (!this.moved) {
                this.points = [];
            }
            var p = this.container.camera.airpointMouse(100, event.offsetX, event.offsetY);
            this.points.push(new THREE.Vector3(p.x, p.y, p.z));

            this.line = new Meshline(this.points, 1, this.color);
            this.group.add(this.line);

            this.moved = true;
        }
    };
    EditorDrawLine.prototype.onMouseUp = function (event) {
        if (this.down && this.moved) {
            this.group.remove(this.line);
            this.container.getLayer("LayerLines").addLine(this.points, this.color);
        }
        this.down = false;
        this.moved = false;
    };

    return EditorDrawLine;
});