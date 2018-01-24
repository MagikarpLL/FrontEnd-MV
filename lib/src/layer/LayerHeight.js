define(['THREE', 'Layer', 'measureUtils'], function (THREE, Layer, measureUtils) {
    function LayerHeight() {

    }
    LayerHeight.prototype = new Layer("LayerHeight");

    LayerHeight.prototype.load = function (stage, scene) {  //add data to group
        //TODO read scene data and load existing lines
        Layer.prototype.load.call(this, stage, scene);

        if(typeof this.scene.heightData === 'undefined'){
            this.scene.heightData = [];
        }else{
            measureUtils.addLines(this.container, this.group,this.scene.heightData,'heightDiv');
        }

    };

    LayerHeight.prototype.unload = function () {

        for (var i = this.group.children.length - 1; i >= 0; i--) {
            this.group.remove(this.group.children[i]);
        }

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
        linePointList.dataIndex = this.scene.heightData.length;
        this.scene.heightData.push(linePointList);
        for(var i = 1; i < linePointList.length; i++ ){
            this.group.add(measureUtils.createLine(linePointList[i-1].point, linePointList[i].point));
        }
        measureUtils.syncPosition(this.container, linePointList);
        measureUtils.updateContent(this.container, linePointList, 'height');
        linePointList[linePointList.length - 1].label[0].children[0].setAttribute('onclick','removeHeight('+ linePointList.dataIndex +')');

    }




    LayerHeight.prototype.removeLine = function (dataIndex) {

        this.scene.heightData.splice(dataIndex,1);
        for(var i = 0; i< this.scene.heightData.length; i++){
            if(this.scene.heightData[i].dataIndex !== i){
                this.scene.heightData[i].dataIndex = i;
                var tempList = this.scene.heightData[i];
                tempList.dataIndex = i;
                tempList[tempList.length - 1].label[0].children[0].setAttribute('onclick','removeHeight(' + i +')');
            }
        }
        for (var j = this.group.children.length - 1; j >= 0; j--) {
            this.group.remove(this.group.children[j]);
        }
        measureUtils.clearDivLabel('heightDiv');
        measureUtils.addLines(this.container,this.group,this.scene.heightData, 'heightDiv');

    }

    LayerHeight.prototype.syncPosition = function () {
        for(var i = 0; i < this.scene.heightData.length; i++){
            measureUtils.syncPosition(this.container, this.scene.heightData[i]);
        }
    }

    return LayerHeight;
});