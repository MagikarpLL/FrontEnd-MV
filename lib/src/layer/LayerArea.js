define(['THREE', 'Layer', 'measureUtils'], function (THREE, Layer, measureUtils) {
    function LayerArea() {
        this.lineColor = '#0066ff';
    }
    LayerArea.prototype = new Layer("LayerArea");

    LayerArea.prototype.load = function (stage, scene) {  //add data to group
        Layer.prototype.load.call(this, stage, scene);
        if(this.scene.data && this.scene.data.areaData){
            measureUtils.changeObjToV3d(this.scene.data.areaData, 'area');
            measureUtils.addDataImgLabel(this.scene.data.areaData, 'area', this.container);
            measureUtils.addAreas(this.container, this.group,this.scene.data.areaData, this.lineColor);
        }else{
            if(this.scene.data){
            }else{
                this.scene.data = {};
            }
            this.scene.data.areaData = [];
        }
    };

    LayerArea.prototype.unload = function () {
        for (var i = this.group.children.length - 1; i >= 0; i--) {
            this.group.remove(this.group.children[i]);
        }
        measureUtils.deleteDataImgLabel(this.scene.data.areaData);
        measureUtils.clearDivLabel('areaDiv');
    };

    LayerArea.prototype.show = function () {
        this.visible = true;
        this.group.visible = true;
        $('#areaDiv').show();
    };

    LayerArea.prototype.hide = function () {
        this.visible = false;
        this.group.visible = false;
        $('#areaDiv').hide();
    };

    //TODO
    //添加数据后，立刻传输当前scene数据给服务器
    LayerArea.prototype.addArea = function (linePointList) {
        linePointList.dataIndex = this.scene.data.areaData.length;
        this.scene.data.areaData.push(linePointList);
        var tempArea = measureUtils.createArea(this.container, linePointList);
        measureUtils.createAreaLines(linePointList, this.lineColor, this.group);
        this.group.add(tempArea);
        measureUtils.syncPosition(this.container, linePointList,'area');
        measureUtils.updateAreaContent(this.container, linePointList);
        linePointList[linePointList.length - 1].label[0].children[0].setAttribute('onclick','removeArea('+ linePointList.dataIndex +')');

        measureUtils.saveDataToServer(this.scene.id, this.scene.data);

    };

    //TODO
    //修改数据后，立刻传输当前scene数据给服务器
    LayerArea.prototype.removeArea = function (dataIndex) {
        this.scene.data.areaData.splice(dataIndex,1);
        for(var i = 0; i< this.scene.data.areaData.length; i++){
            if(this.scene.data.areaData[i].dataIndex !== i){
                this.scene.data.areaData[i].dataIndex = i;
                var tempList = this.scene.data.areaData[i];
                tempList.dataIndex = i;
                tempList[tempList.length - 1].label[0].children[0].setAttribute('onclick','removeArea(' + i +')');
            }
        }
        for (var j = this.group.children.length - 1; j >= 0; j--) {
            this.group.remove(this.group.children[j]);
        }
        measureUtils.clearDivLabel('areaDiv');
        measureUtils.addAreas(this.container,this.group,this.scene.data.areaData, this.lineColor);

        measureUtils.saveDataToServer(this.scene.id, this.scene.data);

    };

    LayerArea.prototype.syncPosition = function () {
        for(var i = 0; i < this.scene.data.areaData.length; i++){
            measureUtils.syncPosition(this.container, this.scene.data.areaData[i],'area');
        }
    };

    return LayerArea;
});