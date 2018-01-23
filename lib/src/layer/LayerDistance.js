define(['THREE', 'Layer'], function (THREE, Layer) {
    function LayerDistance() {

    }
    LayerDistance.prototype = new Layer("LayerDistance");

    LayerDistance.prototype.load = function (stage, scene, sceneId) {  //add data to group
        //TODO read scene data and load existing lines

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



    }
    
    LayerDistance.prototype.removeLine = function () {
        
    }

    return LayerDistance;
});