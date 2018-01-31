define(['Container', 'loadLayer', 'loadEditor', 'jquery', 'database', 'colorPicker', 'mCustomScrollBar', 'utils'], function (Container, loadLayer, loadEditor, $, database, colorPicker, mCustomScrollBar, utils) {
    var container;
    var baseURL = "resource/ids360Viewer/img/view/";
    var redIconURL = "resource/ids360Viewer/img/icon/";
    var resURL = 'http://www.indoorstar.com:6601/';

    var mapElement;
    var panoElement;

    var externalData = {};

    var scrollIsDown = false;
    var scrollIsUp = false;
    var scrollDownX = 0;
    var scrollUpX = 0;

    var init = function (dom) {
        mapElement = dom.getElementById('mapMarkerContainer');
        panoElement = dom.getElementById('mainDiv');

        container = new Container(dom.getElementById('threeJsContainer'));
        container.getExternalData = function () {
            return externalData;
        };
        loadLayer(container);
        loadEditor(container);

        container.getLayer("LayerPano").show();     //全景图层
        container.getLayer("LayerSceneIcon").show();
        container.getLayer("LayerLines").show();
        container.getLayer("LayerAmap").hide();
        container.getLayer("LayerSceneMap").hide();

        container.enterEditor(container.getEditor("EditorCamera"), container.getEditor("EditorClickScene"), container.getEditor("EditorExternalClickable"));

        showMap();

        $("#returnImg").click(function (ev) {
            self.location = 'selectList.html?sn=' + database.getUserSn();
            ev.stopPropagation();
        });
        $("#switchLayer").click(function (ev) {
            if (container.getLayer('LayerSceneMap').isVisible()) { //curr mode map -> show pano
                showScene();
            } else { //curr mode pano -> show map
                showMap();
            }
            ev.stopPropagation();
        });
        $("#editImg").click(function (ev) {

            $('#editImg').hide();
            $('#selectImg').hide();
            $('#returnImg').hide();
            $('#switchLayer').hide();
            $('#selectDiv').hide();

            $('#editDiv').show();
            $('#superpositionImg').attr('src', baseURL + 'superpositionShow.png');
            $('#superpositionImg').css('pointer-events', 'none');

            if (!($('#measureDiv').is(":hidden"))) {      //measureDiv show
                $('#measureImg').css('top', '575px');
                $('#measureImg').show();
                $('#measureDiv').hide();
            } else {
                $('#measureImg').css('top', '575px');       //measureDiv hide
                $('#measureImg').show();
                $('#measureDiv').hide();
            }

            container.enterEditor();    //不传任何editor进去，清空当前editor

            allMeausreNoSelected();
            ev.stopPropagation();
        });
        $("#backEditImg").click(function (ev) {
            $('#editImg').show();
            $('#selectImg').show();
            $('#returnImg').show();
            $('#switchLayer').show();
            $('#measureImg').show();
            $('#selectDiv').show();
            $('#superpositionImg').css('pointer-events', 'auto');
            $('#measureImg').css('pointer-events', 'auto');
            $('#measureImg').css('top', '153px');

            $('#editDiv').hide();
            $('#textInput').hide();

            container.enterEditor(container.getEditor("EditorCamera"), container.getEditor("EditorClickScene"), container.getEditor("EditorExternalClickable"));
            allEditNoSelected();
            ev.stopPropagation();
        });
        $('#measureImg').click(function (ev) {
            $('#superpositionImg').attr('src', baseURL + 'superpositionShow.png');
            $('#superpositionImg').css('pointer-events', 'none');

            $('#measureImg').hide();
            $('#returnImg').hide();
            $('#switchLayer').hide();
            $('#selectDiv').hide();
            $('#selectImg').hide();
            $('#measureDiv').show();

            allEditNoSelected();

            if (!($('#editDiv').is(":hidden"))) {      //editDiv show
                $('#editDiv').hide();
                $('#measureImg').hide();

                $('#editImg').show();
                $('#measureDiv').show();
                $('#measureImg').css('top', '153px');

                $('#showDiv').show();
            } else {
                $('#measureDiv').show();       //editDiv hide
            }

            container.enterEditor();    //不传任何editor进去，清空当前editor
            ev.stopPropagation();
        });
        $('#backMeasureImg').click(function (ev) {
            $('#measureImg').show();
            $('#returnImg').show();
            $('#switchLayer').show();
            $('#selectDiv').show();
            $('#selectImg').show();

            $('#measureDiv').hide();
            $('#editImg').css('pointer-events', 'auto');
            $('#superpositionImg').css('pointer-events', 'auto');

            container.enterEditor(container.getEditor("EditorCamera"), container.getEditor("EditorClickScene"), container.getEditor("EditorExternalClickable"));
            allMeausreNoSelected();
            ev.stopPropagation();
        });
        $('#selectImg').click(function (ev) {
            var temp = $("#selectDiv").is(":hidden");//是否隐藏
            if (temp === false) {
                $("#selectDiv").hide();
            } else {
                $("#selectDiv").show();
            }
            ev.stopPropagation();
        });
        $('#fullscreenImg').click(function (ev) {
            $('#fullscreenImg').hide();
            $('#exitFullscreenImg').show();
            fullScreen(dom);
            ev.stopPropagation();
        });
        $('#exitFullscreenImg').click(function (ev) {
            $('#exitFullscreenImg').hide();
            $('#fullscreenImg').show();
            exitFullScreen(dom);
            ev.stopPropagation();
        });
        $('#measureDiv').click(function (ev) {
            ev.stopPropagation();
        });
        $('#spanDiv').click(function (ev) {
            ev.stopPropagation();
        });

        $('#panoramaImg').click(function (ev) {
            var layerPano = container.getLayer("LayerPano");
            if (layerPano.isVisible()) {
                layerPano.hide();
                $('#panoramaImg').attr('src', baseURL + 'panoramaNoShow.png');
            } else {
                layerPano.show();
                $('#panoramaImg').attr('src', baseURL + 'panoramaShow.png');
            }
            ev.stopPropagation();
        });
        $('#superpositionImg').click(function (ev) {

            if ($('#superpositionImg').attr('src') === (baseURL + 'superpositionNoShow.png')) {     //show data
                showSuperPosition();
                $('#superpositionImg').attr('src', baseURL + 'superpositionShow.png');
            } else {
                hideSuperPosition();
                $('#superpositionImg').attr('src', baseURL + 'superpositionNoShow.png');
            }
            ev.stopPropagation();
        });

        $('#lineImg').click(function (ev) {
            if (container.getCurrentEditor("EditorDrawLine")) {
                container.enterEditor();
                allEditNoSelected();
            } else {
                container.enterEditor(container.getEditor("EditorDrawLine"));
                allEditNoSelected();
                $('#lineImg').attr('src', baseURL + 'lineSelected.png');
            }
            ev.stopPropagation();
        });
        $('#rubberImg').click(function (ev) {     //2
            if (container.getCurrentEditor("EditorErase")) {
                container.enterEditor();
                allEditNoSelected();
            } else {
                container.enterEditor(container.getEditor("EditorErase"));
                allEditNoSelected();
                $('#rubberImg').attr('src', baseURL + 'rubberSelected.png');
            }
            ev.stopPropagation();
        });
        $('#textImg').click(function (ev) {       //3
            if (container.getCurrentEditor("EditorText")) {
                container.enterEditor();
                allEditNoSelected();
            } else {
                container.enterEditor(container.getEditor("EditorText"));
                allEditNoSelected();
                $('#textImg').attr('src', baseURL + 'textSelected.png');
            }
            ev.stopPropagation();
        });
        $('#fireEngineImg').click(function (ev) {
            if ($('#fireEngineImg').attr('src') === (baseURL + 'fireEngine.png')) {
                container.getEditor("EditorIcon").setImage(redIconURL + "fireEngine-red.png");
                container.enterEditor(container.getEditor('EditorIcon'));
                allEditNoSelected();
                $('#fireEngineImg').attr('src', baseURL + 'fireEngineSelected.png');
            } else {
                container.enterEditor();
                allEditNoSelected();
            }
            ev.stopPropagation();
        });
        $('#fireHydrantImg').click(function (ev) {
            if ($('#fireHydrantImg').attr('src') === (baseURL + 'fireHydrant.png')) {
                container.getEditor("EditorIcon").setImage(redIconURL + "fireHydrant-red.png");
                container.enterEditor(container.getEditor('EditorIcon'));
                allEditNoSelected();
                $('#fireHydrantImg').attr('src', baseURL + 'fireHydrantSelected.png');
            } else {
                container.enterEditor();
                allEditNoSelected();
            }
            ev.stopPropagation();
        });
        $('#waterImg').click(function (ev) {
            if ($('#waterImg').attr('src') === (baseURL + 'water.png')) {
                container.getEditor("EditorIcon").setImage(redIconURL + "water-red.png");
                container.enterEditor(container.getEditor('EditorIcon'));
                allEditNoSelected();
                $('#waterImg').attr('src', baseURL + 'waterSelected.png');
            } else {
                container.enterEditor();
                allEditNoSelected();
            }
            ev.stopPropagation();
        });

        $('#distanceImg').click(function (ev) {
            if (container.getCurrentEditor("EditorDistance")) {
                container.enterEditor();
                allMeausreNoSelected();
            } else {
                container.enterEditor(container.getEditor("EditorDistance"));
                allMeausreNoSelected();
                $('#mainDiv').css('cursor', 'pointer');
                $('#distanceImg').attr('src', baseURL + 'distanceSelected.png');
            }
            ev.stopPropagation();
        });
        $('#heightImg').click(function (ev) {
            if (container.getCurrentEditor("EditorHeight")) {
                container.enterEditor();
                allMeausreNoSelected();
            } else {
                container.enterEditor(container.getEditor("EditorHeight"));
                allMeausreNoSelected();
                $('#mainDiv').css('cursor', 'pointer');
                $('#heightImg').attr('src', baseURL + 'heightSelected.png');
            }
            ev.stopPropagation();
        });
        $('#areaImg').click(function (ev) {
            if (container.getCurrentEditor("EditorArea")) {
                container.enterEditor();
                allMeausreNoSelected();
            } else {
                container.enterEditor(container.getEditor("EditorArea"));
                allMeausreNoSelected();
                $('#mainDiv').css('cursor', 'pointer');
                $('#areaImg').attr('src', baseURL + 'areaSelected.png');
            }
            ev.stopPropagation();
        });

        colorPickerInit();
        scrollBarFun();

    };

    //scrollBar drag
    var scrollBarFun = function () {

        //scroll bar 拖拽滑动
        $('#selectDiv').on('mousedown', function (ev) {
            scrollIsDown = true;
            scrollDownX = ev.clientX;
            ev.stopPropagation();
        });
        $('#selectDiv').on('mouseup', function (ev) {
            scrollIsUp = true;
            scrollUpX = ev.clientX;
            if (scrollIsDown && scrollIsUp) {
                var symbol = scrollDownX > scrollUpX ? '-' : '+';
                var num = symbol + '=' + Math.abs(scrollDownX - scrollUpX) * 2;
                $('#selectDiv').mCustomScrollbar('scrollTo', num);
            } else {
                scrollIsDown = false;
                scrollIsUp = false;
                scrollDownX = 0;
                scrollUpX = 0;
            }
            ev.stopPropagation();
        });

    };

    var setExternalData = function (type, list) {
        externalData = externalData || {};
        externalData[type] = {dirty: true, list: list};
    };

    //superposition
    var hideSuperPosition = function () {
        container.getLayer('LayerArea').hide();
        container.getLayer('LayerDistance').hide();
        container.getLayer('LayerHeight').hide();
        container.getLayer('LayerLines').hide();
        container.getLayer('LayerIcons').hide();
        container.getLayer('LayerText').hide();
    };

    var showSuperPosition = function () {
        container.getLayer('LayerArea').show();
        container.getLayer('LayerDistance').show();
        container.getLayer('LayerHeight').show();
        container.getLayer('LayerLines').show();
        container.getLayer('LayerIcons').show();
        container.getLayer('LayerText').show();
    }

    //colorPickerInit
    var colorPickerInit = function () {

        colorPicker.fixIndicators(
            document.getElementById('slider-indicator'),
            document.getElementById('picker-indicator'));

        var cp = colorPicker(
            document.getElementById('slider'),
            document.getElementById('picker'),

            function (hex, hsv, rgb, pickerCoordinate, sliderCoordinate) {

                colorPicker.positionIndicators(
                    document.getElementById('slider-indicator'),
                    document.getElementById('picker-indicator'),
                    sliderCoordinate, pickerCoordinate
                );

                $('#slider-indicator').css('background-color', hex);

                container.getEditor('EditorDrawLine').setColor(hex);
                container.getEditor('EditorText').setColor(hex);

            });

        cp.setRgb({r: 120, g: 205, b: 18});
    };

    //初始化编辑条各个按钮的状态
    var allEditNoSelected = function () {
        $('#lineImg').attr('src', baseURL + 'line.png');
        $('#rubberImg').attr('src', baseURL + 'rubber.png');
        $('#textImg').attr('src', baseURL + 'text.png');
        $('#fireEngineImg').attr('src', baseURL + 'fireEngine.png');
        $('#fireHydrantImg').attr('src', baseURL + 'fireHydrant.png');
        $('#waterImg').attr('src', baseURL + 'water.png');

        $('#textInput').hide();
    };

    var allMeausreNoSelected = function () {
        $('#distanceImg').attr('src', baseURL + 'distance.png');
        $('#heightImg').attr('src', baseURL + 'height.png');
        $('#areaImg').attr('src', baseURL + 'area.png');

        $('#mainDiv').css('cursor', 'default');
    };

    // 全屏代码
    var fullScreen = function (dom) {
        var elem = dom.body;
        if (elem.webkitRequestFullScreen) {
            elem.webkitRequestFullScreen();
        } else if (elem.mozRequestFullScreen) {
            elem.mozRequestFullScreen();
        } else if (elem.requestFullScreen) {
            elem.requestFullscreen();
        } else {
            notice.notice_show("浏览器不支持全屏API或已被禁用", null, null, null, true, true);
        }
    };

    var exitFullScreen = function (dom) {
        var elem = dom;
        if (elem.webkitCancelFullScreen) {
            elem.webkitCancelFullScreen();
        } else if (elem.mozCancelFullScreen) {
            elem.mozCancelFullScreen();
        } else if (elem.cancelFullScreen) {
            elem.cancelFullScreen();
        } else if (elem.exitFullscreen) {
            elem.exitFullscreen();
        } else {
            notice.notice_show("浏览器不支持全屏API或已被禁用", null, null, null, true, true);
        }
    };

    this.loadSceneById = function (id) {
        container.loadScene(container.stage, id);
        if (id > 0) {
            showScene();
        } else {
            showMap();
        }
    };

    var load = function (stage, sceneId, lng, lat) {
        var valid = false;
        if (stage.scenes) stage.scenes.forEach(function (scene) {
            if (scene.imageUrls && scene.imageLng && scene.imageLat) {
                if(scene.data){
                    scene.data = JSON.parse(scene.data);
                }

                if (stage.id < 0) { //sceneIds
                    stage.updateLng = scene.imageLng;
                    stage.updateLat = scene.imageLat;
                }
                valid = true;
            }
        });
        if (lng && lat) {
            stage.updateLng = lng;
            stage.updateLat = lat;
        }
        container.stage = stage;
        if (valid) {
            loadSceneById(sceneId);
        } else {
            container.unloadScene();
            container.getLayer("LayerSceneMap").tryLngLat(stage.updateLng, stage.updateLat);
            showMap();
        }
    };

    var loadStage = function (stageId, sceneId, lng, lat) {
        database.getStage(stageId, function (stage) {
            if (stage) {
                load(stage, sceneId, lng, lat);
            }
        });
    };

    var loadScenes = function (sceneIdsString, sceneId, lng, lat) {
        database.getScenes(sceneIdsString, function (stage) {
            if (stage) {
                load(stage, sceneId, lng, lat);
            }
        });
    };

    var unload = function () {
        if (container) {
            container.unloadScene();
        }
    };

    var showMap = function () {
        container.getLayer('LayerSceneMap').show();
    };
    var showScene = function () {
        container.getLayer('LayerSceneMap').hide();
    };

    var animate = function () {
        container.animate();
    };

    this.removeLine = function (dataIndex) {
        container.getLayer('LayerDistance').removeLine(dataIndex);
    };

    this.removeHeight = function (dataIndex) {
        container.getLayer('LayerHeight').removeLine(dataIndex);
    };

    this.removeArea = function (dataIndex) {
        container.getLayer('LayerArea').removeArea(dataIndex);
    };

    this.removeText = function (dataIndex) {
        container.getLayer('LayerText').removeText(dataIndex);
    };

    this.enterPress = function (event) {
        container.getEditor('EditorText').enterPress(event);
    };

    this.removeText = function (event) {
        container.getLayer('LayerText').removeText(event);
    };

    return {
        database: database,
        init: init,
        loadStage: loadStage,
        loadScenes: loadScenes,
        unload: unload,
        animate: animate,
        setExternalData: setExternalData,
    }
});