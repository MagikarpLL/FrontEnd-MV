define(['THREE', 'Layer', 'amap', 'jquery', 'utils'], function (THREE, Layer, amap, $, utils) {
    function LayerAmap() {
    }

    LayerAmap.prototype = new Layer("LayerAmap");

    LayerAmap.prototype.add = function (container) {
        Layer.prototype.add.call(this, container);
        this.gaodeMap = new amap.Map('amapContainer', {
            mapStyle: 'amap://styles/6215fcfa9593b72ddd682e5b115deb96',
            resizeEnable: true,
            rotateEnable: true,
            pitchEnable: true,
            dragEnable: false,
            animateEnable: false,
            pitch: 80,
            rotation: -15,
            viewMode: '3D',//开启3D视图,默认为关闭
            buildingAnimation: true,//楼块出现是否带动画

            // features:['road'],
            expandZoomRange: true,
            zoom: 20,
            zooms: [3, 20],
            center: [121.583015, 31.19947]
        });

        var layerAmap = this;
        $('#mapImg').click(function (ev) {
            if (layerAmap.isVisible()) {
                layerAmap.hide();
            } else {
                layerAmap.show();
            }
            ev.stopPropagation();
        });
    };

    LayerAmap.prototype.load = function (stage, scene) {
        Layer.prototype.load.call(this, stage, scene);
        this.syncCamera();
    };

    LayerAmap.prototype.syncCamera = function () {
        console.log(this.container);
        var lon = this.container.camera.lng;
        var lat = this.container.camera.lat;

        lon = lon % 360;
        if (this.scene.sourceType === 13) {
            this.hide();
            return;
        }

        if (this.visible) {
            this.container.camera.raycaster.setFromCamera(new THREE.Vector2(0, 0), this.container.camera.camera_threejs);
            var distance = -50 / this.container.camera.raycaster.ray.direction.y;
            var p = this.container.camera.raycaster.ray.at(distance);
            this.scene.meterForLat = 6378137 * 2 * Math.PI / 360;
            this.scene.meterForLng = utils.meterForOneLng(this.scene.imageLat);
            var amaplng = this.scene.imageLng + p.z / this.scene.meterForLng;
            var amaplat = this.scene.imageLat + p.x / this.scene.meterForLat;

            var center = new amap.LngLat(amaplng, amaplat);
            this.gaodeMap.setRotation(-lon);
            this.gaodeMap.setPitch(lat + 90);
            this.gaodeMap.setCenter(center);

            var density = this.gaodeMap.getResolution(center); //meter per pixel
            var zoom = this.gaodeMap.getZoom();
            var fovy = 51 - zoom * 2;
            fovy = Math.max(11, fovy);
            // k * 2^(-zoom) == distance
            // distance * tan(fovy/2) / (height/2) == density
            var k = density * this.container.height / 2 / Math.pow(2, -zoom) / Math.tan(fovy / 180 * Math.PI / 2);
            var newZoom = Math.log(k / distance) / Math.log(2);

            var ratio = newZoom - 20;
            if (ratio > 0) {
                newZoom = 20;
                fovy = 2 * Math.atan(Math.tan(fovy * Math.PI / 180 / 2) * Math.pow(2, ratio)) * 180 / Math.PI;
            }

            this.container.camera.fov = fovy;
            this.gaodeMap.setZoom(newZoom);
        }
    };

    LayerAmap.prototype.show = function () {
        if (this.scene.sourceType === 13) {
            this.hide();
            return;
        }
        this.visible = true;
        $('#amapContainer').css('opacity','0.7');
        this.syncCamera();
        var baseURL = "res/img/view/";
        $('#mapImg').attr('src', baseURL + (this.visible ? 'mapShow.png' : 'mapNoShow.png'));
    };

    LayerAmap.prototype.hide = function () {
        this.visible = false;
        $('#amapContainer').css('opacity','0');

        var baseURL = "res/img/view/";
        $('#mapImg').attr('src', baseURL + (this.visible ? 'mapShow.png' : 'mapNoShow.png'));
    };

    return LayerAmap;
});