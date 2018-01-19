define(['Container', 'loadLayer', 'loadEditor', 'jquery', 'database'], function (Container, loadLayer, loadEditor, $, database) {
    var container;

    var init = function (dom) {
        container = new Container(dom);
        loadLayer(container);
        loadEditor(container);

        container.getLayer("LayerPano").show();
        container.getLayer("LayerSceneIcon").show();
        container.getLayer("LayerLines").show();

        container.enterEditor(container.getEditor("EditorCamera"), container.getEditor("EditorClickScene"));

        $('.switchPanoVisibilityButton').on('click', function (e) {
            var layer = container.getLayer("LayerPano");
            if (layer.isVisible()) {
                layer.hide();
            } else {
                layer.show();
            }
            e.preventDefault();
        });
        $('.enterCameraMode').on('click', function (e) {
            container.enterEditor(container.getEditor("EditorCamera"), container.getEditor("EditorClickScene"));
        });
        $('.enterDrawlineMode').on('click', function (e) {
            container.enterEditor(container.getEditor("EditorDrawLine"));
        });
        $('.enterEraseMode').on('click', function (e) {
            container.enterEditor(container.getEditor("EditorErase"));
        });
    };

    var loadStage = function (stageId, sceneId) {
        database.getStage(stageId, function (stage) {
            var map = {};
            var first = -1;
            for (var i = 0; i < stage.scenes.length; i++) {
                if (stage.scenes[i].imageUrls) {
                    map["" + stage.scenes[i].id] = stage.scenes[i];
                    if (first < 0) first = "" + stage.scenes[i].id;
                }
            }
            if (!sceneId) {
                sceneId = first;
            }
            container.loadScene(stage, map[sceneId]);
        });
    };
    var loadScenes = function (sceneIdsString, sceneId) {
        database.getScenes(sceneIdsString, function (stage) {
            var map = {};
            var first = -1;
            for (var i = 0; i < stage.scenes.length; i++) {
                if (stage.scenes[i].imageUrls) {
                    map["" + stage.scenes[i].id] = stage.scenes[i];
                    if (first < 0) first = "" + stage.scenes[i].id;
                }
            }
            if (!sceneId) {
                sceneId = first;
            }
            container.loadScene(stage, map[sceneId]);
        });
    };

    var animate = function () {
        container.animate();
    };

    return {
        init: init,
        loadStage: loadStage,
        loadScenes: loadScenes,
        animate: animate,
    }
});