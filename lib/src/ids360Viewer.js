define(['Container', 'loadLayer', 'loadEditor', 'jquery', 'database', 'colorPicker', 'ModeControl', 'uiBinding'], function (Container, loadLayer, loadEditor, $, database, colorPicker, ModeControl, uiBinding) {
    var baseURL = "resource/ids360Viewer/img/view/";

    var rootElement;
    var mapElement;
    var overlayElement;
    var panoElement;
    var containerElement;

    var container;
    var modeControl;

    var externalData = {};

    var scrollIsDown = false;
    var scrollIsUp = false;
    var scrollDownX = 0;
    var scrollUpX = 0;

    var setElements = function (rootElement_in, mapElement_in, overlayElement_in, panoElement_in, containerElement_in) {
        rootElement = rootElement_in;
        mapElement = mapElement_in;
        overlayElement = overlayElement_in;
        panoElement = panoElement_in;
        containerElement = containerElement_in;
    };

    var init = function (dom, isVisibleCallback) {
        container = new Container(containerElement);
        container.domElements = {
            'rootElement': rootElement,
            'mapElement': mapElement,
            'overlayElement': overlayElement,
            'panoElement': panoElement,
            'containerElement': containerElement,
        };

        this.container = container;
        container.isVisibleCallback = function () {
            if (isVisibleCallback && !isVisibleCallback()) {
                if (rootElement) rootElement.style.pointerEvents = 'none';
                return false;
            } else {
                if (rootElement) rootElement.style.pointerEvents = 'auto';
                return true;
            }
        };
        container.getExternalData = function () {
            return externalData;
        };
        loadLayer(container);
        loadEditor(container);

        container.getLayer("LayerPano").show();     //全景图层
        container.getLayer("LayerSceneIcon").hide();
        container.getLayer("LayerLines").show();
        container.getLayer("LayerAmap").hide();
        container.getLayer("LayerSceneMap").hide();

        modeControl = new ModeControl(container);
        uiBinding(modeControl, container);

        modeControl.setMode('outdoor');

        $("#returnImg").click(function (ev) {
            self.location = 'selectList.html?sn=' + database.getUserSn();
            ev.stopPropagation();
        });
        $('#sceneSelectIcon').click(function (ev) {
            var temp = $("#selectDiv").is(":hidden");//是否隐藏
            if (temp === false) {
                $("#selectDiv").hide();
                container.getLayer("LayerSceneIcon").hide();
            } else {
                $("#selectDiv").show();
                container.getLayer("LayerSceneIcon").show();
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
        $('#measurePanel').click(function (ev) {
            ev.stopPropagation();
        });

        $('#panoLayerIcon').click(function (ev) {
            var layerPano = container.getLayer("LayerPano");
            if (layerPano.isVisible()) {
                layerPano.hide();
                $('#panoLayerIcon').attr('src', baseURL + 'layer_panoramaNoShow.png');
            } else {
                layerPano.show();
                $('#panoLayerIcon').attr('src', baseURL + 'layer_panoramaShow.png');
            }
            ev.stopPropagation();
        });
        $('#compositionLayerIcon').click(function (ev) {
            if ($('#compositionLayerIcon').attr('src') === (baseURL + 'layer_superpositionNoShow.png')) {     //show data
                showSuperPosition();
                $('#compositionLayerIcon').attr('src', baseURL + 'layer_superpositionShow.png');
            } else {
                hideSuperPosition();
                $('#compositionLayerIcon').attr('src', baseURL + 'layer_superpositionNoShow.png');
            }
            ev.stopPropagation();
        });

        colorPickerInit();
        scrollBarFun();

    };

    var loadAmap = function () {
        container.getLayer("LayerAmap").loadAmap();
        container.getLayer("LayerSceneMap").loadAmap();
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
    };

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
            modeControl.setMode("panoView");
        } else {
            modeControl.setMode("outdoor");
        }
    };

    this.selectModelingListItem = function (index) {
        container.stageData.selectStageData(index);
    };
    this.removeModelingListItem = function (index) {
        container.stageData.removeStageData(index);
    };

    var load = function (stage, sceneId, lng, lat) {
        var valid = false;
        if (stage.scenes) stage.scenes.forEach(function (scene) {
            if (scene.imageUrls && scene.imageLng && scene.imageLat) {
                if (scene.data && typeof scene.data === 'string') {
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
            modeControl.setMode("outdoor");
        }
    };

    var lastLoadStageId = undefined;
    var lastLoadSceneIds = undefined;
    var lastLoadedStage = undefined;

    var loadStage = function (stageId, sceneId, lng, lat) {
        if (stageId === lastLoadStageId && lastLoadedStage) {
            load(lastLoadedStage, sceneId, lng, lat);
        } else {
            database.getStage(stageId, function (stage) {
                if (stage) {
                    lastLoadStageId = stageId;
                    lastLoadSceneIds = undefined;
                    lastLoadedStage = stage;
                    load(stage, sceneId, lng, lat);
                }
            });
        }
    };

    var loadScenes = function (sceneIdsString, sceneId, lng, lat) {
        if (sceneIdsString === lastLoadSceneIds && lastLoadedStage) {
            load(lastLoadedStage, sceneId, lng, lat);
        } else {
            database.getScenes(sceneIdsString, function (stage) {
                if (stage) {
                    lastLoadStageId = undefined;
                    lastLoadSceneIds = sceneIdsString;
                    lastLoadedStage = stage;
                    load(stage, sceneId, lng, lat);
                }
            });
        }
    };

    var unload = function () {
        if (container) {
            container.unloadScene();
        }
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

    this.enterPress = function (event) {
        container.getEditor('EditorText').enterPress(event);
    };

    this.removeText = function (event) {
        container.getLayer('LayerText').removeText(event);
    };

    return {
        database: database,
        setElements: setElements,
        init: init,
        loadStage: loadStage,
        loadScenes: loadScenes,
        unload: unload,
        animate: animate,
        loadAmap: loadAmap,
        setExternalData: setExternalData,
    }
});