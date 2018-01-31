define(['THREE', 'Layer', 'measureUtils'], function (THREE, Layer, measureUtils) {
    function LayerLines() {

    }
    LayerLines.prototype = new Layer("LayerLines");

    LayerLines.prototype.load = function (stage, scene) {
        Layer.prototype.load.call(this, stage, scene);
        //TODO read scene data and load existing lines

        if( this.scene.data && this.scene.data.lineList){

            measureUtils.changeObjToV3d(this.scene.data.lineList, 'line');
            for(var i = 0; i < this.scene.data.lineList.length; i++){
                var tempLine = createDrawLine(this.scene.data.lineList[i]);
                this.group.add(tempLine);
            }
        }else{
            if(this.scene.data){
            }else{
                this.scene.data = {};
            }
            this.scene.data.lineList = [];
        }
    };
    
    this.createDrawLine = function (item) {
        var material = new THREE.LineBasicMaterial({color: '#' + item.color});
        var geometry = new THREE.Geometry();
        item.points.forEach(function (point) {
            geometry.vertices.push(point);
        });
        var line = new THREE.Line(geometry, material);
        line.userData = item;
        return line;
    }

    LayerLines.prototype.addLine = function (pointList, color) {
        var item = {points: pointList, color: color.slice(1)};
        this.scene.data.lineList.push(item);
        var material = new THREE.LineBasicMaterial({color: color});
        var geometry = new THREE.Geometry();
        pointList.forEach(function (point) {
            geometry.vertices.push(point);
        });

        var line = new THREE.Line(geometry, material);
        line.userData = item;
        this.group.add(line);

        measureUtils.saveDataToServer(this.scene.id, this.scene.data);

    };
    LayerLines.prototype.removeLine = function (mouseX, mouseY) {
        var intersected = this.container.camera.raySelect(mouseX, mouseY, this.group);
        if (intersected.length > 0) {
            for (var i = 0; i < intersected.length; i++) {
                var obj = intersected[i].object;
                var index =  this.scene.data.lineList.indexOf(obj.userData);
                if (index >= 0) {
                    this.scene.data.lineList.splice(index, 1);
                    this.group.remove(obj);
                    measureUtils.saveDataToServer(this.scene.id, this.scene.data);
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