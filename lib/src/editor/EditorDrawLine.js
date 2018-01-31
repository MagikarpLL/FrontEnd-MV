define(['Editor', 'THREE'], function (Editor, THREE) {
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

            if (!this.moved) {
                this.points = [];
                this.linecount = 0;
                this.capability = 100;
                this.lineGeometry = new THREE.BufferGeometry();
                this.linePosition = new Float32Array(this.capability * 3); // 3 vertices per point
                this.lineGeometry.addAttribute('position', new THREE.BufferAttribute(this.linePosition, 3));
                this.lineGeometry.setDrawRange(0, this.linecount);
                this.lineMaterial = new THREE.LineBasicMaterial({color: this.color, linewidth: 1});
                this.line = new THREE.Line(this.lineGeometry, this.lineMaterial);
                this.line.frustumCulled = false;
                this.group.add(this.line);
            }

            this.linecount++;
            if (this.linecount === this.capability) {
                this.capability *= 2;
                var old = this.linePosition;
                this.linePosition = new Float32Array(this.capability * 3);
                for (var i = 0; i < old.length; i++) {
                    this.linePosition[i] = old[i];
                }
                this.lineGeometry.addAttribute('position', new THREE.BufferAttribute(this.linePosition, 3));
            }
            var p = this.container.camera.airpointMouse(100, event.offsetX, event.offsetY);
            this.linePosition[this.linecount * 3 - 3] = p.x;
            this.linePosition[this.linecount * 3 - 2] = p.y;
            this.linePosition[this.linecount * 3 - 1] = p.z;
            this.points.push(new THREE.Vector3(p.x, p.y, p.z));
            this.lineGeometry.setDrawRange(0, this.linecount);
            this.lineGeometry.attributes.position.needsUpdate = true;

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