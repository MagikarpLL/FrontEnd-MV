define(['amap', 'Layer', 'jquery', 'threeUtil'], function (whatever, Layer, $, threeUtil) {
    function LayerSceneMap() {
        this.map = undefined;

        this.markers = [];

        this.packs = [];
        this.polygons = [];
        this.editors = [];

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

    LayerSceneMap.prototype.loadAmap = function () {
        if (!this.map) {
            this.map = new AMap.Map('mapMarkerContainer', {
                resizeEnable: true,
                dragEnable: true,
                animateEnable: false,
                viewMode: '3D',
                expandZoomRange: true,
                zoom: 16,
                zooms: [3, 20],
            });

            var pluginReady = false;
            var mapReady = false;

            AMap.plugin('AMap.PolyEditor', function () {
                pluginReady = true;
                if (pluginReady && mapReady) {
                    layer.completed = true;
                    if (layer.callback) layer.callback();
                }
            });

            var layer = this;
            this.map.on('complete', function () {
                layer.map.setLayers([new AMap.TileLayer.Satellite(), new AMap.TileLayer.RoadNet()]);
                mapReady = true;
                if (pluginReady && mapReady) {
                    layer.completed = true;
                    if (layer.callback) layer.callback();
                }
            });
        }
    };

    LayerSceneMap.prototype.show = function () {
        Layer.prototype.show.call(this);
        Layer.prototype.show.call(this.container.getLayer("LayerSceneMapOverlay"));

        $('#mapMarkerContainer').css('opacity', 1);
        $('#mapMarkerContainer').css('pointer-events', 'auto');
        $('#mapMarkerOverlay').css('opacity', 1);
        $('#mapMarkerOverlay').css('pointer-events', 'none');
        $('#mainDiv').css('opacity', 0);
    };

    LayerSceneMap.prototype.hide = function () {
        Layer.prototype.hide.call(this);
        Layer.prototype.hide.call(this.container.getLayer("LayerSceneMapOverlay"));

        $('#mapMarkerContainer').css('opacity', 0);
        $('#mapMarkerContainer').css('pointer-events', 'none');
        $('#mapMarkerOverlay').css('opacity', 0);
        $('#mapMarkerOverlay').css('pointer-events', 'none');
        $('#mainDiv').css('opacity', 1);
    };


    var unselected = {
        12: 'resource/ids360Viewer/pose/sec_OUTDOOR_UAV.png',
        13: 'resource/ids360Viewer/pose/sec_OUTDOOR_THETA360.png',
        22: 'resource/ids360Viewer/pose/sec_OUTDOOR_THETA360.png',
    };
    var selected = {
        12: 'resource/ids360Viewer/pose/sec_OUTDOOR_UAV_on.png',
        13: 'resource/ids360Viewer/pose/sec_OUTDOOR_THETA360_on.png',
        22: 'resource/ids360Viewer/pose/sec_OUTDOOR_THETA360_on.png',
    };

    LayerSceneMap.prototype.tryLngLat = function (lng, lat) {
        if (this.map) {
            this.map.setZoom(17);
            this.map.panTo([lng, lat]);
        }
    };

    LayerSceneMap.prototype.load = function (stage, scene) {
        this.stage = stage;
        this.scene = scene;
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
                                container.modeControl.setMode(container.modeControl.lastMode || 'panoView');
                            });
                            markers.push(marker);
                        }
                    }
                }
            });
        })
    };


    LayerSceneMap.prototype.reloadAllStageData = function () {
        this.polygons.forEach(function (polygon) {
            polygon.setMap(undefined);
        });
        this.editors.forEach(function (editor) {
            editor.close();
        });

        this.packs = [];
        this.polygons = [];
        this.editors = [];

        var self = this;
        this.container.stageData.getAll().forEach(function (pack) {
            self.addStageData(pack);
        });
    };

    LayerSceneMap.prototype.addStageData = function (pack) {
        var self = this;
        var list = [];
        pack.shape.points.forEach(function (point) {
            list.push([point[0], point[1]]);
        });
        var polygon = new AMap.Polygon({
            map: self.map,
            path: list,
            strokeColor: "#0000ff",
            strokeOpacity: 1,
            strokeWeight: 3,
            fillColor: "#7f7fff",
            fillOpacity: 0.4
        });
        var editor = new AMap.PolyEditor(self.map, polygon);
        editor.open();
        polygon.on('change', function () {
            pack.shape.points = [];
            list.forEach(function (point) {
                pack.shape.points.push([point.getLng(), point.getLat()]);
            });
            pack.mesh = threeUtil.pointListToMeshData(pack.shape.points, pack.low, pack.high);
            self.container.stageData.reloadStageData(pack, self);
        });

        this.packs.push(pack);
        this.polygons.push(polygon);
        this.editors.push(editor);
    };

    LayerSceneMap.prototype.selectStageData = function () {
    };
    LayerSceneMap.prototype.reloadStageData = function () {
        this.reloadAllStageData();
    };

    LayerSceneMap.prototype.update = function (deltatime) {
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