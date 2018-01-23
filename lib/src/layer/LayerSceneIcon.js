define(['THREE', 'Layer', 'utils'], function (THREE, Layer, utils) {
    function LayerSceneIcon() {
        this.icons = [];
        this.frame = 0;
        this.animationLength = 2;
        this.imageCount = 23;
        this.interval = 1 / this.imageCount;
    }
    LayerSceneIcon.prototype = new Layer("LayerSceneIcon");

    LayerSceneIcon.prototype.add = function (container) {
        Layer.prototype.add.call(this, container);

        //TODO global loader
        var loadmanager = new THREE.LoadingManager();
        var imageLoader = new THREE.ImageLoader(loadmanager);

        var planeTexture = this.planeTexture = new THREE.Texture();
        var mobileTexture = this.mobileTexture = new THREE.Texture();
        var planeMaterial = this.planeMaterial = new THREE.SpriteMaterial({map: planeTexture});
        var mobileMaterial = this.mobileMaterial = new THREE.SpriteMaterial({map: mobileTexture});

        var repeatY = this.interval;
        imageLoader.load("res/plane.png", function (image) {
            planeTexture.image = image;
            planeTexture.needsUpdate = true;
            planeTexture.offset.x = 0;
            planeTexture.offset.y = 0;
            planeTexture.repeat.x = 1;
            planeTexture.repeat.y = repeatY;
            planeTexture.minFilter = THREE.LinearFilter;
            planeTexture.generateMipmaps = false;
            planeMaterial.needsUpdate = true;
        });
        imageLoader.load("res/mobile.png", function (image) {
            mobileTexture.image = image;
            mobileTexture.needsUpdate = true;
            mobileTexture.offset.x = 0;
            mobileTexture.offset.y = 0;
            mobileTexture.repeat.x = 1;
            mobileTexture.repeat.y = repeatY;
            mobileTexture.minFilter = THREE.LinearFilter;
            mobileTexture.generateMipmaps = false;
            mobileMaterial.needsUpdate = true;
        });
    };

    LayerSceneIcon.prototype.load = function (stage, scene) {
        this.icons = [];

        var layer = this;
        stage.scenes.forEach(function (eachScene) {
            if (eachScene.id !== scene.id && eachScene.imageUrls) {
                var diff = utils.lnglatToXYZ(scene, eachScene);

                var sprite = null;
                if (eachScene.sourceType === 12) {
                    sprite = new THREE.Sprite(layer.planeMaterial);
                    layer.planeMaterial.needsUpdate = true;
                } else if (eachScene.sourceType === 13) {
                    sprite = new THREE.Sprite(layer.mobileMaterial);
                    layer.mobileMaterial.needsUpdate = true;
                }
                if (sprite) {
                    sprite.userData = eachScene;
                    layer.icons.push(sprite);
                    sprite.position.set(diff.x, diff.y, diff.z);
                    sprite.scale.set(1, 1, 0);
                    layer.group.add(sprite);
                }
            }
        });
    };


    LayerSceneIcon.prototype.update = function (deltatime) {
        this.frame += this.imageCount * deltatime / this.animationLength;
        this.frame = this.frame % this.imageCount;
        var frameIndex = (~~this.frame);
        this.planeTexture.offset.y = frameIndex * this.interval;
        this.mobileTexture.offset.y = frameIndex * this.interval;

        var layer = this;
        this.icons.forEach(function (icon) {
            var length = icon.position.length();
            // min: 1x scale <> 500 meters
            // linear
            // max: 2.5x scale <> 100 meters
            length = Math.min(500, Math.max(100, length));
            length = (length - 100) / (500 - 100);
            var externalFactor = 0.25 - length * 0.15;
            var scale = layer.container.camera.scaleFactor(icon) * externalFactor;
            icon.scale.set(scale, scale, 0);
        });
    };

    LayerSceneIcon.prototype.unload = function () {
        for (var i = this.group.children.length - 1; i >= 0; i--) {
            this.group.remove(this.group.children[i]);
        }
        this.icons = [];
    };

    return LayerSceneIcon;
});