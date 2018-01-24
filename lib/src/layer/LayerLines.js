define(['THREE', 'Layer'], function (THREE, Layer) {
    function LayerLines() {

    }
    LayerLines.prototype = new Layer("LayerLines");

    LayerLines.prototype.load = function (stage, scene) {
        Layer.prototype.load.call(this, stage, scene);
        //TODO read scene data and load existing lines

        if(typeof this.scene.lineList === 'undefined'){
            this.scene.lineList = [];
        }else{
            for(var i = 0; i < this.scene.lineList.length; i++){
                this.group.add(createLine(this.scene.lineList[i]));
            }
        }

    };
    
    this.createLine = function (item) {
        var material = new THREE.LineBasicMaterial({color: item.color});
        var geometry = new THREE.Geometry();
        item.points.forEach(function (point) {
            geometry.vertices.push(point);
        });
        var line = new THREE.Line(geometry, material);
        line.userData = item;
        return line;
    }

    LayerLines.prototype.addLine = function (pointList, color) {
        var item = {points: pointList, color: color};
        this.scene.lineList.push(item);
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
                var index =  this.scene.lineList.indexOf(obj.userData);
                if (index >= 0) {
                    this.scene.lineList.splice(index, 1);
                    this.group.remove(obj);
                }
            }
        }
    };

    LayerLines.prototype.unload = function () {
        for (var i = this.group.children.length - 1; i >= 0; i--) {
            this.group.remove(this.group.children[i]);
        }

    };

    return LayerLines;
});