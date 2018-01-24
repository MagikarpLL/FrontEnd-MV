define(['amap'], function (amap) {
    var map = new amap.Map('mapMarkerContainer', {
        layers: [new AMap.TileLayer.Satellite(), new AMap.TileLayer.RoadNet()],
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

    var completed = false;
    var callback = undefined;
    map.on('complete', function () {
        completed = true;
        if (callback) callback();
    });
    var runOnComplete = function (c) {
        if (completed) {
            c();
        } else {
            callback = c;
        }
    };

    var loadMarkers = function (lng, lat, scenes, callback) {
        runOnComplete(function () {
            moveCamera(lng, lat, 16);
            scenes.forEach(function (scene) {
                if (scene.imageUrls) {
                    addMarker(scene, callback);
                }
            });
        });
    };

    var moveCamera = function (lng, lat, zoom) {
        map.panTo([lng, lat]);
        map.setZoom(zoom);
    };

    var imageMap = {
        12: '../res/pose/sec_OUTDOOR_UAV.png',
        13: '../res/pose/sec_OUTDOOR_THETA360.png',
    };

    var addMarker = function (scene, callback) {
        if (scene.imageLng && scene.imageLat && scene.imageUrls) {
            var image = imageMap[scene.sourceType];
            if (image) {
                var icon = new AMap.Icon({
                    image: image,
                    //icon可缺省，缺省时为默认的蓝色水滴图标，
                    imageSize: new AMap.Size(32, 32),
                    size: new AMap.Size(32, 32),
                });
                var marker = new AMap.Marker({
                    icon: icon,//24px*24px
                    position: [scene.imageLng, scene.imageLat],
                    offset: new AMap.Pixel(-16, -16),
                    map: map
                });
                marker.on('click', function () {
                    callback(scene.id);
                });
            }
        }
    };

    return {
        loadMarkers: loadMarkers,
    }
});