define(['amap', 'Layer', 'jquery'], function (whatever, Layer, $) {
    function LayerSceneMap() {
        this.map = undefined;

        this.markers = [];

        this.completed = false;
        this.callback = undefined;
    }
    LayerSceneMap.prototype = new Layer("LayerSceneMap");

    LayerSceneMap.prototype.runOnComplete = function (c) {
        if (this.completed) {
            c();
        } else {
            this.callback = c;
        }
    };

    LayerSceneMap.prototype.show = function () {
        Layer.prototype.show.call(this);
        if (!this.map) {
            this.map = new AMap.Map('mapMarkerContainer', {
                resizeEnable: true,
                rotateEnable: true,
                pitchEnable: true,
                dragEnable: true,
                animateEnable: false,
                viewMode: '3D',//开启3D视图,默认为关闭
                // features:['road'],
                expandZoomRange: true,
                zoom: 16,
                zooms: [3, 20],
            });

            var layer = this;
            this.map.on('complete', function () {
                layer.map.setLayers([new AMap.TileLayer.Satellite(), new AMap.TileLayer.RoadNet()]);
                layer.completed = true;
                if (layer.callback) layer.callback();
            });
        }

        $('#mapMarkerContainer').css('opacity', 1);
        $('#mapMarkerContainer').css('pointer-events', 'auto');
        $('#mainDiv').css('opacity', 0);
    };

    LayerSceneMap.prototype.hide = function () {
        Layer.prototype.hide.call(this);

        $('#mapMarkerContainer').css('opacity', 0);
        $('#mapMarkerContainer').css('pointer-events', 'none');
        $('#mainDiv').css('opacity', 1);
    };


    var unselected = {
        12: 'resource/ids360Viewer/pose/sec_OUTDOOR_UAV.png',
        13: 'resource/ids360Viewer/pose/sec_OUTDOOR_THETA360.png',
    };
    var selected = {
        12: 'resource/ids360Viewer/pose/sec_OUTDOOR_UAV_on.png',
        13: 'resource/ids360Viewer/pose/sec_OUTDOOR_THETA360_on.png',
    };

    LayerSceneMap.prototype.tryLngLat = function (lng, lat) {
        if (this.map) {
            this.map.setZoom(17);
            this.map.panTo([lng, lat]);
        }
    };

    LayerSceneMap.prototype.load = function (stage, scene) {
        var layer = this;
        this.runOnComplete(function () {
            var map = layer.map;
            var lng, lat;
            if (this.stage !== stage) {
                lng = stage.updateLng;
                lat = stage.updateLat;
                if (stage.id < 0) { //sceneIds
                    if (stage.scenes) stage.scenes.forEach(function (scene) {
                        if (scene.imageLng && scene.imageLat) {
                            lng = scene.imageLng;
                            lat = scene.imageLat;
                        }
                    });
                }
                map.setZoom(17);
            }
            if (scene && scene.imageLng && scene.imageLat && scene.imageUrls) {
                lng = scene.imageLng;
                lat = scene.imageLat;
            }
            map.panTo([lng, lat]);

            var container = layer.container;
            var markers = layer.markers;
            stage.scenes.forEach(function (eachScene) {
                if (eachScene.imageUrls) {
                    if (eachScene.imageLng && eachScene.imageLat && eachScene.imageUrls) {
                        var m = eachScene === scene ? selected : unselected;
                        var image = m[eachScene.sourceType];
                        if (image) {
                            var icon = new AMap.Icon({
                                image: image,
                                //icon可缺省，缺省时为默认的蓝色水滴图标，
                                imageSize: new AMap.Size(32, 32),
                                size: new AMap.Size(32, 32),
                            });
                            var marker = new AMap.Marker({
                                icon: icon,//24px*24px
                                position: [eachScene.imageLng, eachScene.imageLat],
                                offset: new AMap.Pixel(-16, -16),
                                map: map
                            });
                            marker.on('click', function () {
                                container.loadScene(container.stage, eachScene.id);
                                setTimeout(function () {
                                    layer.hide();
                                }, 0);
                            });
                            markers.push(marker);
                        }
                    }
                }
            });
        })
    };

    LayerSceneMap.prototype.unload = function () {
        var layer = this;
        this.runOnComplete(function () {
            layer.markers.forEach(function (marker) {
                marker.setMap(undefined);
            });
        });
    };

    return LayerSceneMap;
});