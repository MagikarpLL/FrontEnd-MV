define(['THREE', 'Layer', 'measureUtils'], function (THREE, Layer, measureUtils) {
    function LayerDistance() {

    }
    LayerDistance.prototype = new Layer("LayerDistance");

    LayerDistance.prototype.load = function (stage, scene) {  //add data to group
        //TODO read scene data and load existing lines
        Layer.prototype.load.call(this, stage, scene);

        if(typeof this.scene.data === 'undefined'){
            this.scene.data = [];
        }

    };

    LayerDistance.prototype.addIcon = function (mouseX, mouseY, imagePath) {

    };


    LayerDistance.prototype.removeIcon = function (mouseX, mouseY) {

    };

    LayerDistance.prototype.unload = function () {

        for (var i = this.group.children.length - 1; i >= 0; i--) {
            this.group.remove(this.group.children[i]);
        }

        this.lineList = [];
    };
    
    LayerDistance.prototype.addLine = function (linePointList) {
        this.scene.data.push(linePointList);

        for(var i = 1; i < linePointList.length; i++ ){
            this.group.add(measureUtils.createLine(linePointList[i-1].point, linePointList[i].point));
        }

        measureUtils.syncPosition(this.container, linePointList);
        measureUtils.updateContent(this.container, linePointList);



    }
    
    LayerDistance.prototype.removeLine = function () {
        
    }
    
    LayerDistance.prototype.syncPosition = function () {
        for(var i = 0; i < this.scene.data.length; i++){
            measureUtils.syncPosition(this.container, this.scene.data[i]);
        }
    }

    return LayerDistance;
});