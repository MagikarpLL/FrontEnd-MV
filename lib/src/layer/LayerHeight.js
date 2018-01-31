define(['THREE', 'Layer', 'measureUtils', 'jquery'], function (THREE, Layer, measureUtils, $) {
    function LayerHeight() {
        this.color = '#FF6C00';
    }
    LayerHeight.prototype = new Layer("LayerHeight");

    LayerHeight.prototype.load = function (stage, scene) {  //add data to group
        //TODO read scene data and load existing lines
        Layer.prototype.load.call(this, stage, scene);
        if( this.scene.data && this.scene.data.heightData){
            measureUtils.changeObjToV3d(this.scene.data.heightData, 'height');
            measureUtils.addDataImgLabel(this.scene.data.heightData, 'height', this.container);
            measureUtils.addLines(this.container, this.group,this.scene.data.heightData,'heightDiv', this.color);
        }else{
            if(this.scene.data){
            }else{
                this.scene.data = {};
            }
            this.scene.data.heightData = [];
        }
    };

    LayerHeight.prototype.unload = function () {
        for (var i = this.group.children.length - 1; i >= 0; i--) {
            this.group.remove(this.group.children[i]);
        }
        measureUtils.deleteDataImgLabel(this.scene.data.heightData);
        measureUtils.clearDivLabel('heightDiv');
    };

    LayerHeight.prototype.show = function () {
        this.visible = true;
        this.group.visible = true;
        $('#heightDiv').show();
    };

    LayerHeight.prototype.hide = function () {
        this.visible = false;
        this.group.visible = false;
        $('#heightDiv').hide();
    };

    LayerHeight.prototype.addLine = function (linePointList) {
        linePointList.dataIndex = this.scene.data.heightData.length;
        this.scene.data.heightData.push(linePointList);
        for(var i = 1; i < linePointList.length; i++ ){
            this.group.add(measureUtils.createLine(linePointList[i-1].point, linePointList[i].point, this.color));
        }
        measureUtils.syncPosition(this.container, linePointList);
        measureUtils.updateContent(this.container, linePointList, 'height');
        linePointList[linePointList.length - 1].label[0].children[0].setAttribute('onclick','removeHeight('+ linePointList.dataIndex +')');

        measureUtils.saveDataToServer(this.scene.id, this.scene.data);

    };

    LayerHeight.prototype.removeLine = function (dataIndex) {
        this.scene.data.heightData.splice(dataIndex,1);
        for(var i = 0; i< this.scene.data.heightData.length; i++){
            if(this.scene.data.heightData[i].dataIndex !== i){
                this.scene.data.heightData[i].dataIndex = i;
                var tempList = this.scene.data.heightData[i];
                tempList.dataIndex = i;
                tempList[tempList.length - 1].label[0].children[0].setAttribute('onclick','removeHeight(' + i +')');
            }
        }
        for (var j = this.group.children.length - 1; j >= 0; j--) {
            this.group.remove(this.group.children[j]);
        }
        measureUtils.clearDivLabel('heightDiv');
        measureUtils.addLines(this.container,this.group,this.scene.data.heightData, 'heightDiv', this.color);

        measureUtils.saveDataToServer(this.scene.id, this.scene.data);

    };

    LayerHeight.prototype.syncPosition = function () {
        for(var i = 0; i < this.scene.data.heightData.length; i++){
            measureUtils.syncPosition(this.container, this.scene.data.heightData[i]);
        }
    };

    return LayerHeight;
});