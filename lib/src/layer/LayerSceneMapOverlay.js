define('LayerSceneMapOverlay', ['Layer', 'THREE', 'threeUtil', 'BuildingMesh', 'utils'], function (Layer, THREE, threeUtil, BuildingMesh, utils) {
    function LayerSceneMapOverlay() {
    }
    LayerSceneMapOverlay.prototype = new Layer("LayerSceneMapOverlay");

    LayerSceneMapOverlay.prototype.add = function (container) {
        Layer.prototype.add.call(this, container);

        this.renderer = new THREE.WebGLRenderer({alpha: true});
        var dom = this.dom = this.container.domElements['overlayElement'];
        dom.appendChild(this.renderer.domElement);

        this.width = dom.clientWidth;
        this.height = dom.clientHeight;

        this.camera = new THREE.PerspectiveCamera(75, dom.clientWidth / dom.clientHeight, 5, 100000);

        this.renderer.setClearColor(0xffffff, 0);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(this.width, this.height);

        this.outgroup = new THREE.Scene();
        // this.outgroup.background = new THREE.Color(0xff0000);

        this.testResize = function () {
            var width = this.dom.clientWidth;
            var height = this.dom.clientHeight;
            if (width !== this.width || height !== this.height) {
                this.onResize();
            }
        };
        this.onResize = function () {
            this.width = this.dom.clientWidth;
            this.height = this.dom.clientHeight;

            this.camera.aspect = this.width / this.height;
            this.camera.updateProjectionMatrix();

            this.renderer.setSize(this.width, this.height);
        };

        this.animate = function () {
            var self = this;

            this.renderer.clear();
            requestAnimationFrame(function () {
                self.animate();
            });
            if (!dom.offsetParent || (this.isVisibleCallback && !this.isVisibleCallback())) return;
            this.testResize();

            if (!this.visible) return;
            if (this.container.stageData.getAll().length === 0) {
                threeUtil.removeAllChildren(this.outgroup);
                return;
            }

            var amapLayer = this.container.getLayer('LayerSceneMap');
            if (amapLayer.map && this.refscene) {
                var amap = amapLayer.map;
                var lnglat = amap.getCenter();
                this.syncAmap(lnglat.getLng(), lnglat.getLat(), amap.getZoom(), amap.getResolution(amap.getCenter()), amap.getPitch(), amap.getRotation());
            }

            this.renderer.render(this.outgroup, this.camera);
        };

        this.animate();
    };


    LayerSceneMapOverlay.prototype.load = function (stage, scene) {
        Layer.prototype.load.call(this, stage, scene);

        if (stage && scene) {
            this.reloadAllStageData();
        }
    };

    LayerSceneMapOverlay.prototype.reloadAllStageData = function () {
        threeUtil.removeAllChildren(this.outgroup);

        var self = this;
        this.container.stageData.getAll().forEach(function (pack) {
            self.addStageData(pack);
        });
    };
    LayerSceneMapOverlay.prototype.addStageData = function (pack) {
        if (!this.refscene) this.refscene = {id: -1, imageLng: pack.mesh.points[0].lng, imageLat: pack.mesh.points[0].lat, imageAlt: 0};
        var mesh = new BuildingMesh(pack.mesh, this.container, this.stage, this.refscene, false);
        this.outgroup.add(mesh.group);
    };
    LayerSceneMapOverlay.prototype.selectStageData = function (pack) {

    };
    LayerSceneMapOverlay.prototype.reloadStageData = function (pack) {
        this.reloadAllStageData(); //TODO
    };

    LayerSceneMapOverlay.prototype.syncAmap = function (lng, lat, zoom, scale, pitch, heading) {
        var fov = 51 - zoom * 2;

        var distance = this.height / 2 * scale / Math.tan(fov / 180 * Math.PI / 2);

        var dd = utils.lnglatToXYZ(this.refscene, {imageLng: lng, imageLat: lat, imageAlt: 0});

        pitch = Math.max(1, pitch);
        var phi = pitch / 180 * Math.PI;
        var theta = (180 - heading) / 180 * Math.PI;
        this.camera.position.x = dd.x + distance * Math.sin(phi) * Math.cos(theta);
        this.camera.position.y = distance * Math.cos(phi);
        this.camera.position.z = dd.z + distance * Math.sin(phi) * Math.sin(theta);
        this.camera.lookAt(new THREE.Vector3(dd.x, 0, dd.z));
        this.camera.fov = fov;
        this.camera.updateMatrixWorld();
        this.camera.updateProjectionMatrix();
    };

    return LayerSceneMapOverlay;
});