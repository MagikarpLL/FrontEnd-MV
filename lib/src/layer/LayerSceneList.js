define(['Layer', 'jquery', 'mCustomScrollBar', 'utils'], function (Layer, $, mCustomScrollBar, utils) {
    function LayerSceneList() {
        $(".scrollBar").mCustomScrollbar({
            axis: "x", // horizontal scrollbar
            autoHideScrollbar: true,
            mouseWheel: {enable: true}
        });

        this.stage = undefined;
        this.scene = undefined;
    }
    LayerSceneList.prototype = new Layer("LayerSceneList");

    LayerSceneList.prototype.load = function (stage, scene) {
        if (this.stage !== stage) {
            $('#mCSB_1_container').empty();
            for (var i = 0; i < stage.scenes.length; i++) {
                var eachScene = stage.scenes[i];
                if (eachScene.imageUrls) {
                    var resURL = 'http://www.indoorstar.com:6601/';
                    $('#mCSB_1_container').append('<div style="background-image: url(' + resURL + eachScene.thumbUrl + ')" ' +
                        'class="listDetailDiv" onclick="loadSceneById(' + eachScene.id + ')"><span class="timeSpan">' + utils.changeTimestampToFull(eachScene.imageUpdateTime) + '</span></div>');
                }
            }
            this.stage = stage;
        }

        $('.listDetailDiv').each(function (index, ele) {
            ele.style.borderColor = '#ffffff';
            if (ele.getAttribute("onclick") === ('loadSceneById(' + scene.id + ')')) {
                ele.style.borderColor = '#fff000';
            }
        });
        this.scene = scene;

        // Layer.prototype.load.call(this, stage, scene);
    };

    LayerSceneList.prototype.unload = function (stage, scene) {
        this.stage = undefined;
        $('#mCSB_1_container').empty();
    };

    return LayerSceneList;
});