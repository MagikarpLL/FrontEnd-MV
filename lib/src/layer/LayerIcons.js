define(['THREE', 'Layer', 'measureUtils'], function (THREE, Layer, measureUtils) {
    function LayerIcons() {

    }
    LayerIcons.prototype = new Layer("LayerIcons");

    LayerIcons.prototype.load = function (stage, scene) {  //add data to group
        Layer.prototype.load.call(this, stage, scene);
        //TODO read scene data and load existing lines

        if( this.scene.data && this.scene.data.iconData){
            measureUtils.changeObjToV3d(this.scene.data.iconData, 'icon');
            for(var i = 0; i < this.scene.data.iconData.length; i++){
                var data = this.scene.data.iconData[i];
                this.group.add(measureUtils.createIcon(data.imagePath, this.container, data.point ,i));
            }
        }else{
            if(this.scene.data){
            }else{
                this.scene.data = {};
            }
            this.scene.data.iconData = [];
        }
    };

    LayerIcons.prototype.addIcon = function (mouseX, mouseY, imagePath) {
        var tempPosition = this.container.camera.rayMouse(mouseX, mouseY).at(30);
        var icon = measureUtils.createIcon(imagePath, this.container, tempPosition, this.scene.data.iconData.length);
        this.group.add(icon);
        this.scene.data.iconData.push({
            imagePath:imagePath,
            point: tempPosition
        });

        measureUtils.saveDataToServer(this.scene.id, this.scene.data);

    };

    LayerIcons.prototype.update = function () {
        for(var i = 0; i < this.group.children.length; i++){
            var icon = this.group.children[i];
            var scale = this.container.camera.scaleFactor(icon) * 0.1;
            icon.scale.set(scale, scale, 0);
        }
    };
    
    LayerIcons.prototype.selectIcon = function (mouseX, mouseY) {
        var intersected = this.container.camera.raySelect(mouseX, mouseY, this.group);
        if (intersected.length > 0) {
            for (var i = 0; i < intersected.length; i++) {
                var obj = intersected[i].object;
                if(obj.userData.moveType === false){
                    this.currentIcon = obj;
                    obj.userData.moveType = true;
                }else{

                    var tempPosition = this.container.camera.rayMouse(mouseX, mouseY).at(30);

                    this.scene.data.iconData[this.currentIcon.userData.dataIndex].point = new THREE.Vector3(tempPosition.x, tempPosition.y, tempPosition.z);
                    this.currentIcon = null;
                    obj.userData.moveType = false;

                    measureUtils.saveDataToServer(this.scene.id, this.scene.data);

                }
            }
        }
    };

    LayerIcons.prototype.moveIcon = function (mouseX, mouseY) {
        if(this.currentIcon){
            var tempPosition = this.container.camera.rayMouse(mouseX, mouseY).at(30);
            this.currentIcon.position.set(tempPosition.x,tempPosition.y,tempPosition.z);
        }
    };

    LayerIcons.prototype.removeIcon = function (mouseX, mouseY) {
        var isChange = false;
        var intersected = this.container.camera.raySelect(mouseX, mouseY, this.group);
        if (intersected.length > 0) {
            for (var i = 0; i < intersected.length; i++) {
                var obj = intersected[i].object;
                this.scene.data.iconData.splice(obj.userData.dataIndex,1);
                this.group.remove(obj);
                isChange = true;
            }
        }

        if(isChange){
            var tempList = this.group.children;
            for(var i = 0; i < tempList.length; i++){
                if(i !== tempList[i].userData.dataIndex){
                    tempList[i].userData.dataIndex = i;
                }
            }
            measureUtils.saveDataToServer(this.scene.id, this.scene.data);
        }
    };

    LayerIcons.prototype.unload = function () {

        for (var i = this.group.children.length - 1; i >= 0; i--) {
            this.group.remove(this.group.children[i]);
        }
        this.currentIcon = null;

    };
    
    // this.createIcon = function (imagePath, container, mouseX, mouseY, dataIndex) {
    //     var loadmanager = new THREE.LoadingManager();
    //     var imageLoader = new THREE.ImageLoader(loadmanager);
    //     var iconTexture = new THREE.Texture();
    //     var iconMaterial = new THREE.SpriteMaterial({map: iconTexture});
    //     imageLoader.load(imagePath, function (image) {
    //         iconTexture.image = image;
    //         iconTexture.needsUpdate = true;
    //         iconTexture.minFilter = THREE.LinearFilter;
    //         iconTexture.generateMipmaps = false;
    //         iconTexture.needsUpdate = true;
    //     });
    //     var tempPosition = container.camera.rayMouse(mouseX, mouseY).at(20);
    //     var icon = new THREE.Sprite(iconMaterial);
    //     icon.position.set(tempPosition.x, tempPosition.y, tempPosition.z);
    //     icon.userData.dataIndex = dataIndex;
    //     icon.userData.moveType = false;
    //     return icon;
    // }

    return LayerIcons;
});