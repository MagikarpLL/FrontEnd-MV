define(['THREE', 'Layer'], function (THREE, Layer) {
    function LayerPano() {

    }
    LayerPano.prototype = new Layer("LayerPano");

    LayerPano.prototype.add = function (container) {
        Layer.prototype.add.call(this, container);

        var geometry = new THREE.SphereBufferGeometry(1000, 120, 60);
        geometry.scale(-1, 1, 1);

        this.material = new THREE.MeshBasicMaterial({depthWrite: false});

        this.mesh = new THREE.Mesh(geometry, this.material);
        this.group.add(this.mesh);
    };

    LayerPano.prototype.load = function (stage, scene) {
        var loadmanager = new THREE.LoadingManager();
        var imageLoader = new THREE.ImageLoader(loadmanager);

        var texture = new THREE.Texture();
        //TODO delete current texture
        var material = this.material;
        material.map = undefined;
        material.needsUpdate = true;

        imageLoader.load("http://www.indoorstar.com:6601/" + scene.imageUrls[0], function (image) {
            texture.image = image;
            texture.needsUpdate = true;
            texture.anisotropy = 4;
            material.needsUpdate = true;
            material.map = texture;
        });

        var yaw = 0;
        var pitch = 0;
        var roll = 0;
        if (scene.sourceType === 13) {
            var params = scene.imageUrls;
            if (params.length >= 4) {
                yaw = parseFloat(params[1]) - 180;
                pitch = parseFloat(params[2]);
                roll = parseFloat(params[3]);
            }
        }
        this.mesh.rotation.order = 'XYZ';
        this.mesh.rotation.x = -roll / 180 * Math.PI;
        this.mesh.rotation.y = -yaw / 180 * Math.PI;
        this.mesh.rotation.z = -pitch / 180 * Math.PI;

        if (scene.sourceType === 13) {
            this.container.camera.latMin = this.container.camera.LAT_MIN;
            this.container.camera.latMax = this.container.camera.LAT_MAX_GROUND;
        } else {
            this.container.camera.latMin = this.container.camera.LAT_MIN;
            this.container.camera.latMax = this.container.camera.LAT_MAX_AIR;
        }
    };

    return LayerPano;
});