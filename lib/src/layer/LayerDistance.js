define(['THREE', 'Layer', 'measureUtils'], function (THREE, Layer, measureUtils) {
    function LayerDistance() {

    }
    LayerDistance.prototype = new Layer("LayerDistance");

    LayerDistance.prototype.load = function (stage, scene) {  //add data to group
        //TODO read scene data and load existing lines
        Layer.prototype.load.call(this, stage, scene);

        if(typeof this.scene.distanceData === 'undefined'){
            this.scene.distanceData = [];
        }else{
            measureUtils.addLines(this.container, this.group,this.scene.distanceData,'distanceDiv');

        }

    };

    LayerDistance.prototype.show = function () {
        this.visible = true;
        this.group.visible = true;
        $('#distanceDiv').show();
    };

    LayerDistance.prototype.hide = function () {
        this.visible = false;
        this.group.visible = false;
        $('#distanceDiv').hide();
    };

    LayerDistance.prototype.unload = function () {



        for (var i = this.group.children.length - 1; i >= 0; i--) {
            this.group.remove(this.group.children[i]);
        }
        this.lineList = [];

        // console.log(this.group);
        console.log(this.container.group);

        measureUtils.clearDivLabel('distanceDiv');
    };
    
    LayerDistance.prototype.addLine = function (linePointList) {
        linePointList.dataIndex = this.scene.distanceData.length;
        this.scene.distanceData.push(linePointList);
        for(var i = 1; i < linePointList.length; i++ ){
            this.group.add(measureUtils.createLine(linePointList[i-1].point, linePointList[i].point));
        }
        measureUtils.syncPosition(this.container, linePointList);
        measureUtils.updateContent(this.container, linePointList, 'distance');
        linePointList[linePointList.length - 1].label[0].children[0].setAttribute('onclick','removeLine('+ linePointList.dataIndex +')');


    }



    
    LayerDistance.prototype.removeLine = function (dataIndex) {

        this.scene.distanceData.splice(dataIndex,1);
        for(var i = 0; i< this.scene.distanceData.length; i++){
            if(this.scene.distanceData[i].dataIndex !== i){
                this.scene.distanceData[i].dataIndex = i;
                var tempList = this.scene.distanceData[i];
                tempList.dataIndex = i;
                tempList[tempList.length - 1].label[0].children[0].setAttribute('onclick','removeLine(' + i +')');
            }
        }
        for (var j = this.group.children.length - 1; j >= 0; j--) {
            this.group.remove(this.group.children[j]);
        }
        measureUtils.clearDivLabel('distanceDiv');
        measureUtils.addLines(this.container,this.group,this.scene.distanceData, 'distanceDiv');


    }
    
    LayerDistance.prototype.syncPosition = function () {
        for(var i = 0; i < this.scene.distanceData.length; i++){
            measureUtils.syncPosition(this.container, this.scene.distanceData[i]);
        }
    }

    return LayerDistance;
});