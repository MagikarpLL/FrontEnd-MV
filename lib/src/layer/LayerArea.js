define(['THREE', 'Layer', 'measureUtils'], function (THREE, Layer, measureUtils) {
    function LayerArea() {

    }
    LayerArea.prototype = new Layer("LayerArea");

    LayerArea.prototype.load = function (stage, scene) {  //add data to group
        //TODO read scene data and load existing lines
        Layer.prototype.load.call(this, stage, scene);

        if(typeof this.scene.areaData === 'undefined'){
            this.scene.areaData = [];
        }else{
            measureUtils.addAreas(this.container, this.group,this.scene.areaData);
        }

    };

    LayerArea.prototype.unload = function () {

        for (var i = this.group.children.length - 1; i >= 0; i--) {
            this.group.remove(this.group.children[i]);
        }

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

    LayerArea.prototype.addArea = function (linePointList) {
        linePointList.dataIndex = this.scene.areaData.length;
        this.scene.areaData.push(linePointList);
        var materialArea = new THREE.MeshBasicMaterial({
            color: 0x44A6F4,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.4
        });
        var planeShape = measureUtils.getAreaPlaneShape(linePointList);
        var geometry = new THREE.ShapeGeometry(planeShape);
        this.currentArea = new THREE.Mesh(geometry, materialArea);
        this.currentArea.position.set(0, -this.container.scene.imageAlt, 0);
        this.currentArea.rotateX(-Math.PI / 2);
        this.currentArea.scale.set(1, -1, 1);
        this.group.add(this.currentArea);

        measureUtils.syncPosition(this.container, linePointList,'area');
        measureUtils.updateAreaContent(this.container, linePointList);
        linePointList[linePointList.length - 1].label[0].children[0].setAttribute('onclick','removeArea('+ linePointList.dataIndex +')');
    }




    LayerArea.prototype.removeArea = function (dataIndex) {
        this.scene.areaData.splice(dataIndex,1);
        for(var i = 0; i< this.scene.areaData.length; i++){
            if(this.scene.areaData[i].dataIndex !== i){
                this.scene.areaData[i].dataIndex = i;
                var tempList = this.scene.areaData[i];
                tempList.dataIndex = i;
                tempList[tempList.length - 1].label[0].children[0].setAttribute('onclick','removeArea(' + i +')');
            }
        }
        for (var j = this.group.children.length - 1; j >= 0; j--) {
            this.group.remove(this.group.children[j]);
        }
        measureUtils.clearDivLabel('areaDiv');
        measureUtils.addAreas(this.container,this.group,this.scene.areaData);

    }

    LayerArea.prototype.syncPosition = function () {
        for(var i = 0; i < this.scene.areaData.length; i++){
            measureUtils.syncPosition(this.container, this.scene.areaData[i],'area');
        }
    }

    return LayerArea;
});