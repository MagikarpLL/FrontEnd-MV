define(['THREE', 'Layer', 'measureUtils', 'jquery'], function (THREE, Layer, measureUtils, $) {
    function LayerDistance() {
        this.color = '#0B96FF';
    }
    LayerDistance.prototype = new Layer("LayerDistance");

    LayerDistance.prototype.load = function (stage, scene) {  //add data to group
        //TODO read scene data and load existing lines
        Layer.prototype.load.call(this, stage, scene);
        if(this.scene.data && this.scene.data.distanceData){
            measureUtils.changeObjToV3d(this.scene.data.distanceData, 'distance');
            measureUtils.addDataImgLabel(this.scene.data.distanceData, 'distance', this.container);
            measureUtils.addLines(this.container, this.group,this.scene.data.distanceData,'distanceDiv', this.color);
        }else{
            if(this.scene.data){
            }else{
                this.scene.data = {};
            }
            this.scene.data.distanceData = [];
        }
    };

    LayerDistance.prototype.unload = function () {
        for (var i = this.group.children.length - 1; i >= 0; i--) {
            this.group.remove(this.group.children[i]);
        }
        this.lineList = [];
        measureUtils.deleteDataImgLabel(this.scene.data.distanceData);
        measureUtils.clearDivLabel('distanceDiv');
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

    
    LayerDistance.prototype.addLine = function (linePointList) {
        linePointList.dataIndex = this.scene.data.distanceData.length;
        this.scene.data.distanceData.push(linePointList);
        for(var i = 1; i < linePointList.length; i++ ){
            this.group.add(measureUtils.createLine(linePointList[i-1].point, linePointList[i].point, this.color));
        }
        measureUtils.syncPosition(this.container, linePointList);
        measureUtils.updateContent(this.container, linePointList, 'distance');
        linePointList[linePointList.length - 1].label[0].children[0].setAttribute('onclick','removeLine('+ linePointList.dataIndex +')');

        measureUtils.saveDataToServer(this.scene.id, this.scene.data);

    };


    LayerDistance.prototype.removeLine = function (dataIndex) {
        this.scene.data.distanceData.splice(dataIndex,1);
        for(var i = 0; i< this.scene.data.distanceData.length; i++){
            if(this.scene.data.distanceData[i].dataIndex !== i){
                this.scene.data.distanceData[i].dataIndex = i;
                var tempList = this.scene.data.distanceData[i];
                tempList.dataIndex = i;
                tempList[tempList.length - 1].label[0].children[0].setAttribute('onclick','removeLine(' + i +')');
            }
        }
        for (var j = this.group.children.length - 1; j >= 0; j--) {
            this.group.remove(this.group.children[j]);
        }
        measureUtils.clearDivLabel('distanceDiv');
        measureUtils.addLines(this.container,this.group,this.scene.data.distanceData, 'distanceDiv', this.color);

        measureUtils.saveDataToServer(this.scene.id, this.scene.data);

    };
    
    LayerDistance.prototype.syncPosition = function () {
        for(var i = 0; i < this.scene.data.distanceData.length; i++){
            measureUtils.syncPosition(this.container, this.scene.data.distanceData[i]);
        }
    };

    return LayerDistance;
});