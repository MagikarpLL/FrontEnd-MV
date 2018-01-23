define(['THREE', 'Layer'], function (THREE, Layer) {
    function LayerIcons() {
        this.iconMapList = new Map();
    }
    LayerIcons.prototype = new Layer("LayerIcons");

    LayerIcons.prototype.load = function (stage, scene) {  //add data to group
        Layer.prototype.load.call(this, stage, scene);
        var sceneId = scene.id;
        //TODO read scene data and load existing lines
        this.sceneId = sceneId;

        if(typeof this.iconMapList.get(sceneId) === 'undefined'){
            this.iconMapList.set(sceneId,[]);
        }else{
            var tempArray = this.iconMapList.get(sceneId);
            for(var i = 0; i < tempArray.length; i++){
                this.group.add(tempArray[i]);
            }
        }

    };

    LayerIcons.prototype.addIcon = function (mouseX, mouseY, imagePath) {
        var loadmanager = new THREE.LoadingManager();
        var imageLoader = new THREE.ImageLoader(loadmanager);
        var iconTexture = this.iconTexture = new THREE.Texture();
        var iconMaterial = this.iconMaterial = new THREE.SpriteMaterial({map: iconTexture});
        imageLoader.load(imagePath, function (image) {
            iconTexture.image = image;
            iconTexture.needsUpdate = true;
            iconTexture.minFilter = THREE.LinearFilter;
            iconTexture.generateMipmaps = false;
            iconTexture.needsUpdate = true;
        });
        var tempPosition = this.container.camera.rayMouse(mouseX, mouseY).at(20);
        var icon = new THREE.Sprite(iconMaterial);
        icon.position.set(tempPosition.x, tempPosition.y, tempPosition.z);
        icon.userData.dataIndex = this.iconMapList.get(this.sceneId).length;
        icon.userData.moveType = false;
        this.container.getLayer("LayerIcons").group.add(icon);
        this.group.add(icon);
        this.iconMapList.get(this.sceneId).push(icon);
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
                    this.currentIcon = null;
                    obj.userData.moveType = false;
                }
            }
        }
    };

    LayerIcons.prototype.moveIcon = function (mouseX, mouseY) {
        if(this.currentIcon){
            var tempPosition = this.container.camera.rayMouse(mouseX, mouseY).at(20);
            this.currentIcon.position.set(tempPosition.x,tempPosition.y,tempPosition.z);
        }
    };

    LayerIcons.prototype.removeIcon = function (mouseX, mouseY) {
        var intersected = this.container.camera.raySelect(mouseX, mouseY, this.group);
        if (intersected.length > 0) {
            for (var i = 0; i < intersected.length; i++) {
                var obj = intersected[i].object;
                this.iconMapList.get(this.sceneId).splice(obj.userData.dataIndex,1);
                this.group.remove(obj);
            }
        }

        var tempList = this.iconMapList.get(this.sceneId);
        for(var i = 0; i < tempList.length; i++){
            if(i !== tempList[i].userData.dataIndex){
                tempList[i].userData.dataIndex = i;
            }
        }
    };

    LayerIcons.prototype.unload = function () {

        for (var i = this.group.children.length - 1; i >= 0; i--) {
            this.group.remove(this.group.children[i]);
        }

        this.lineList = [];
    };

    return LayerIcons;
});