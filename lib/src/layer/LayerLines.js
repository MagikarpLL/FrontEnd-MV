define(['THREE', 'Layer'], function (THREE, Layer) {
    function LayerLines() {
        this.lineList = [];
    }
    LayerLines.prototype = new Layer("LayerLines");

    LayerLines.prototype.load = function (stage, scene) {
        //TODO read scene data and load existing lines
        this.lineList = [];
    };

    LayerLines.prototype.addLine = function (pointList, color) {
        var item = {points: pointList, color: color};
        this.lineList.push(item);
        var material = new THREE.LineBasicMaterial({color: color});
        var geometry = new THREE.Geometry();
        pointList.forEach(function (point) {
            geometry.vertices.push(point);
        });

        var line = new THREE.Line(geometry, material);
        line.userData = item;
        this.group.add(line);
    };
    LayerLines.prototype.removeLine = function (mouseX, mouseY) {
        var intersected = this.container.camera.raySelect(mouseX, mouseY, this.group);
        if (intersected.length > 0) {
            for (var i = 0; i < intersected.length; i++) {
                var obj = intersected[i].object;
                var index = this.lineList.indexOf(obj.userData);
                if (index >= 0) {
                    this.lineList.splice(index, 1);
                    this.group.remove(obj);
                }
            }
        }
    };

    LayerLines.prototype.unload = function () {
        for (var i = this.group.children.length - 1; i >= 0; i--) {
            this.group.remove(this.group.children[i]);
        }
        this.lineList = [];
    };

    return LayerLines;
});