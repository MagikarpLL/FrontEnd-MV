//three.js
var onMouseDownMouseX = 0,
    onMouseDownMouseY = 0,
    lon = 0, //经度
    lat = 0, //纬度
    phi = 0,
    theta = 0;

//高德地图
var gaodeMap;

//network
var currentScene = 0;   //当前场景，0，1，2，3
var xmlHttp;
var userSn;
var targetSceneId;
var outdoorSceneData = [];

//edit
var isEdit = false;
var currentEditRed;         // -1表示当前没有图标可以编辑
var editType = 0;       // 0表示什么都不做，1为画线，2为橡皮擦,3为文字,4为消防车，5为消火栓，6为水源
var currentLine = 0;    // 0表示这条线绘画已经结束，1表示这条线绘画还未结束
var currentRubber = 0;      //1表示橡皮擦开始碰撞检测并删除碰撞到的所有东西
var line_color = '#000000';
var canvas, canvasCtx;      //编辑文字用的canvas
var measureType = 0;    //0表示什么都不做，1为距离，2为高度，3为面积
// var measureCanvas, measureCtx;  //测量用的canvas

//normal function
window.onload = function (ev) {

    //network data
    initNetWork();
    initCanvas();
    //ele
    $(".scrollBar").mCustomScrollbar({
        axis: "x", // horizontal scrollbar
        autoHideScrollbar: true,
        mouseWheel: {enable: false}
    });
    // $("#selectDiv").blur();

    colorPickerFunc();

}

//btn
function btnClick() {
    $("#returnImg").click(function (ev) {
        self.location = 'selectList.html?sn=' + userSn;
        ev.stopPropagation();
    });
    $("#editImg").click(function (ev) {
        isEdit = true;
        panorama.showEditGroup();
        // $('#measureCanvas').show();

        $('#showDiv').hide();
        $('#returnImg').hide();
        $('#editDiv').show();
        $('#selectDiv').hide();
        $('#superpositionImg').attr('src', '../res/img/view/superpositionShow.png');
        $('#superpositionImg').css('pointer-events', 'none');

        if (!($('#measureDiv').is(":hidden"))) {      //measureDiv show
            $('#measureImg').css('top', '505px');
            $('#measureImg').show();
            $('#measureDiv').hide();
        } else {
            $('#measureImg').css('top', '505px');       //measureDiv hide
            $('#measureImg').show();
            $('#measureDiv').hide();
        }
        panorama.clearCurrent();
        allMeausreNoSelected();
        ev.stopPropagation();
    });
    $("#backEditImg").click(function (ev) {
        isEdit = false;
        editType = 0;
        $('#showDiv').show();
        $('#returnImg').show();
        $('#editDiv').hide();
        $('#measureImg').show();
        $('#selectDiv').show();
        $('#superpositionImg').css('pointer-events', 'auto');
        $('#measureImg').css('pointer-events', 'auto');
        $('#measureImg').css('top', '140px');
        allNoSelected();
        ev.stopPropagation();
    });
    $('#measureImg').click(function (ev) {
        isEdit = true;
        panorama.showEditGroup();
        $('#superpositionImg').attr('src', '../res/img/view/superpositionShow.png');
        $('#superpositionImg').css('pointer-events', 'none');

        $('#measureImg').hide();
        $('#returnImg').hide();
        $('#selectDiv').hide();
        $('#selectImg').hide();
        $('#measureDiv').show();

        allNoSelected();

        if (!($('#editDiv').is(":hidden"))) {      //editDiv show
            $('#editDiv').hide();
            $('#editImg').show();
            $('#measureImg').hide();
            $('#measureDiv').show();
            $('#measureImg').css('top', '140px');

            $('#showDiv').show();
            // $('#editImg').show();
        } else {
            $('#measureDiv').show();       //editDiv hide
        }

        panorama.clearCurrent();
        ev.stopPropagation();
    });
    $('#backMeasureImg').click(function (ev) {
        isEdit = false;
        $('#measureImg').show();

        $('#returnImg').show();
        $('#selectDiv').show();
        $('#selectImg').show();
        $('#measureDiv').hide();
        $('#editImg').css('pointer-events', 'auto');
        $('#superpositionImg').css('pointer-events', 'auto');
        allMeausreNoSelected();
        panorama.clearCurrent();
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
        fullScreen();
        ev.stopPropagation();
    });
    $('#exitFullscreenImg').click(function (ev) {
        $('#exitFullscreenImg').hide();
        $('#fullscreenImg').show();
        exitFullScreen();
        ev.stopPropagation();
    });
    $('#mapImg').click(function (ev) {
        var temp = $("#mapContainer").is(":hidden");//是否隐藏
        if (temp === false) {
            $("#mapContainer").hide();
            $('#mapImg').attr('src', '../res/img/view/mapNoShow.png');
        } else {
            $("#mapContainer").show();
            $('#mapImg').attr('src', '../res/img/view/mapShow.png');
            syncCamera();
        }
        ev.stopPropagation();
    });
    $('#panoramaImg').click(function (ev) {
        var temp = $("#container").is(":hidden");//是否隐藏
        if (temp === false) {
            $("#container").hide();
            $('#panoramaImg').attr('src', '../res/img/view/panoramaNoShow.png');
            clearLabelDiv();
        } else {
            $("#container").show();
            $('#panoramaImg').attr('src', '../res/img/view/panoramaShow.png');
            loadLabelDiv();
        }
        ev.stopPropagation();
    });
    $('#superpositionImg').click(function (ev) {
        var temp = panorama.iconGroup.visible;//是否隐藏
        if (temp === true) {       //显示状态，所以要隐藏icon数据
            panorama.hideEditGroup();
            clearLabelDiv();
            // $('#measureCanvas').hide();
            $('#superpositionImg').attr('src', '../res/img/view/superpositionNoShow.png');
        } else {                //隐藏状态，所以要显示icon数据
            panorama.showEditGroup();
            loadLabelDiv();
            // $('#measureCanvas').show();
            $('#superpositionImg').attr('src', '../res/img/view/superpositionShow.png');
        }
        ev.stopPropagation();
    });
    $('#lineImgEdit').click(function (ev) {       //1
        if (editType === 1) {
            allNoSelected();
            editType = 0;
        } else {
            allNoSelected();
            $('#lineImgEdit').attr('src', '../res/img/view/lineSelected.png');
            editType = 1;
        }
        ev.stopPropagation();
    });
    $('#rubberImgEdit').click(function (ev) {     //2
        if (editType === 2) {
            allNoSelected();
            editType = 0;
        } else {
            allNoSelected();
            $('#rubberImgEdit').attr('src', '../res/img/view/rubberSelected.png');
            editType = 2;
        }
        ev.stopPropagation();
    });
    $('#textImgEdit').click(function (ev) {       //3
        if (editType === 3) {
            allNoSelected();
            editType = 0;
        } else {
            allNoSelected();
            $('#textImgEdit').attr('src', '../res/img/view/textSelected.png');
            editType = 3;
        }
        ev.stopPropagation();
    });
    //消防车图标的点击事件
    document.getElementById('fireEngineImgEdit').addEventListener('mousedown', function (ev) {       //4
        if (editType === 4) {
            allNoSelected();
            editType = 0;
        } else {
            allNoSelected();
            $('#fireEngineImgEdit').attr('src', '../res/img/view/fireEngineSelected.png');
            editType = 4;
        }
        ev.stopPropagation();
    });
    document.getElementById('fireHydrantImgEdit').addEventListener('mousedown', function (ev) {      //5
        if (editType === 5) {
            allNoSelected();
            editType = 0;
        } else {
            allNoSelected();
            $('#fireHydrantImgEdit').attr('src', '../res/img/view/fireHydrantSelected.png');
            editType = 5;
        }
        ev.stopPropagation();
    });
    document.getElementById('waterImgEdit').addEventListener('mousedown', function (ev) {            //6
        if (editType === 6) {
            allNoSelected();
            editType = 0;
        } else {
            allNoSelected();
            $('#waterImgEdit').attr('src', '../res/img/view/waterSelected.png');
            editType = 6;
        }
        ev.stopPropagation();
    });

    $('#distanceImg').click(function (ev) {
        if (measureType === 1) {
            allMeausreNoSelected();
        } else {
            allMeausreNoSelected();
            measureType = 1;
            $('#distanceImg').attr('src', '../res/img/view/distanceSelected.png');
        }
        panorama.clearCurrent();
        ev.stopPropagation();
    });
    $('#heightImg').click(function (ev) {
        if (measureType === 2) {
            allMeausreNoSelected();
        } else {
            allMeausreNoSelected();
            measureType = 2;
            $('#heightImg').attr('src', '../res/img/view/heightSelected.png');
        }
        panorama.clearCurrent();
        ev.stopPropagation();
    });
    $('#areaImg').click(function (ev) {
        if (measureType === 3) {
            allMeausreNoSelected();
        } else {
            allMeausreNoSelected();
            measureType = 3;
            $('#areaImg').attr('src', '../res/img/view/areaSelected.png');
        }
        panorama.clearCurrent();
        ev.stopPropagation();
    });
    $('#measureDiv').click(function (ev) {
        ev.stopPropagation();
    })


    //阻止点击事件的进一步传递
    document.getElementById('spanDiv').addEventListener('mousemove', function (ev2) {
        ev2.stopPropagation();
    });
    document.addEventListener('mousedown', onDocumentMouseDown, false);   //按下鼠标按钮
    document.addEventListener('mousemove', onDocumentMouseMove, false);   //鼠标移动
    document.addEventListener('mouseup', onDocumentMouseUp, false);       //放开鼠标按钮
    document.addEventListener('wheel', onDocumentMouseWheel, false);      //滚轮事件
    var timer = null;
    document.addEventListener('click',function (ev) {
        panorama.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        panorama.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        clearTimeout(timer);
        timer = setTimeout(function () {
            onDocumentMouseClick();
        },300)
    } , false);
    document.addEventListener('dblclick',function (ev) {
        clearTimeout(timer);
        onDocumentDbclick(ev);
    } , false);      //双击事件
    // document.addEventListener('dragenter',function (ev) { ev.preventDefault(); });
    // document.addEventListener('dragover',function (ev) {      //移动红色图标
    //
    //     ev.preventDefault();
    // });
    //
    // document.addEventListener('drop',function (ev) {      //移动红色图标
    //
    //
    //
    //     ev.preventDefault();
    // });

    window.addEventListener('resize', onWindowResize, false);

}

//初始化编辑条各个按钮的状态
function allNoSelected() {
    editType = 0;
    $('#lineImgEdit').attr('src', '../res/img/view/line.png');
    $('#rubberImgEdit').attr('src', '../res/img/view/rubber.png');
    $('#textImgEdit').attr('src', '../res/img/view/text.png');
    $('#fireEngineImgEdit').attr('src', '../res/img/view/fireEngine.png');
    $('#fireHydrantImgEdit').attr('src', '../res/img/view/fireHydrant.png');
    $('#waterImgEdit').attr('src', '../res/img/view/water.png');

    $('#tempInput').hide();
}

function allMeausreNoSelected() {
    measureType = 0;
    $('#distanceImg').attr('src', '../res/img/view/distance.png');
    $('#heightImg').attr('src', '../res/img/view/height.png');
    $('#areaImg').attr('src', '../res/img/view/area.png');
}

//颜色选择条
function colorPickerFunc() {
    //colorPicker
    ColorPicker.fixIndicators(
        document.getElementById('slider-indicator'),
        document.getElementById('picker-indicator'));

    var cp = ColorPicker(
        document.getElementById('slider'),
        document.getElementById('picker'),

        function (hex, hsv, rgb, pickerCoordinate, sliderCoordinate) {

            ColorPicker.positionIndicators(
                document.getElementById('slider-indicator'),
                document.getElementById('picker-indicator'),
                sliderCoordinate, pickerCoordinate
            );

            $('#slider-indicator').css('background-color', hex);
            // console.log(hex);
            line_color = hex;
            // $('#tempInput').css('color', line_color);
        });

    cp.setRgb({r: 120, g: 205, b: 18});
}

//inputs
function initCanvas() {
    $('#tempInput').hide();
    $('#tempInput').on('keypress', enterPress);
}

// 全屏代码
function fullScreen() {
    var elem = document.body;
    if (elem.webkitRequestFullScreen) {
        elem.webkitRequestFullScreen();
    } else if (elem.mozRequestFullScreen) {
        elem.mozRequestFullScreen();
    } else if (elem.requestFullScreen) {
        elem.requestFullscreen();
    } else {
        notice.notice_show("浏览器不支持全屏API或已被禁用", null, null, null, true, true);
    }
}

function exitFullScreen() {
    var elem = document;
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
}

//高德地图
function mapInit() {
    gaodeMap = new AMap.Map('mapContainer', {
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

}

//click
function onWindowResize() {

    panorama.camera.aspect = window.innerWidth / window.innerHeight;
    panorama.camera.updateProjectionMatrix();
    panorama.renderer.setSize(window.innerWidth, window.innerHeight);

}

function onDocumentMouseDown(event) {

    // console.log('mouse down');

    panorama.isUserInteracting = true;
    if (event.clientX != 0 || event.clientY != 0) {
        onMouseDownMouseX = event.clientX;  //鼠标指针相对于当前浏览器页面的水平坐标
        onMouseDownMouseY = event.clientY;  //鼠标指针相对于当前浏览器页面的竖直坐标
    }
    // onMouseDownLon = lon;
    // onMouseDownLat = lat;

    if (editType === 1) {
        console.log('add line');

        var temp = panorama.addLine(outdoorSceneData[currentScene].lineData.length, line_color);
        console.log(temp);
        outdoorSceneData[currentScene].lineData.push(temp);
        currentLine = 1;
    } else if (editType === 2) {

        console.log('rubber');

        currentRubber = 1;
    }


    event.preventDefault();
}

function syncCamera() {
    updateDivXY();

    lon = lon % 360;
    if (outdoorSceneData[currentScene].type !== 13) {
        lat = Math.max(-85, Math.min(-10, lat));
    } else {
        if (!$("#mapContainer").is(":hidden")) {
            $("#mapContainer").hide();
            $('#mapImg').attr('src', '../res/img/view/mapNoShow.png');
        }
    }

    if (!$("#mapContainer").is(":hidden")) {
        panorama.raycaster.setFromCamera(new THREE.Vector2(0, 0), panorama.camera);
        var distance = -50 / panorama.raycaster.ray.direction.y;
        var p = panorama.raycaster.ray.at(distance);
        var scene = outdoorSceneData[currentScene];
        var amaplng = scene.imageLng + p.z / scene.meterForLng;
        var amaplat = scene.imageLat + p.x / scene.meterForLat;
        var center = new AMap.LngLat(amaplng, amaplat);
        gaodeMap.setRotation(-lon);
        gaodeMap.setPitch(lat + 90);
        gaodeMap.setCenter(center);
        // console.log("set amap param (" + amaplng + ", " + amaplat + "), rotation " + ~~(-lon) + ", pitch " + ~~(lat + 90 ));
        var zoom = setDistance(distance, center);
        // console.log("get amap param (" + density + ", " + zoom + ")");
        panorama.updateIconScale();
    }
}

function rubberIconStart() {

    panorama.raycaster.setFromCamera(panorama.mouse, panorama.camera);

    if (panorama.iconGroup.children.length > 0) {         //检测图标
        var intersects = panorama.raycaster.intersectObjects(panorama.iconGroup.children);
        if (intersects.length > 0) {
            for (var i = 0; i < intersects.length; i++) {
                var dataIndex_i = intersects[i].object.dataIndex;
                panorama.iconGroup.remove(intersects[i].object);
                outdoorSceneData[currentScene].iconSprite.splice(dataIndex_i, 1);
            }

            //更新dataIndex
            for (var i1 = 0; i1 < outdoorSceneData[currentScene].iconSprite.length; i1++) {
                if (outdoorSceneData[currentScene].iconSprite[i1].dataIndex != i1) {
                    outdoorSceneData[currentScene].iconSprite[i1].dataIndex = i1;
                }
            }
            console.log('rubber');
        } else {
            console.log(' no rubber');
        }
    }
}

function rubberLineStart() {
    panorama.raycaster.setFromCamera(panorama.mouse, panorama.camera);
    if (panorama.lineGroup.children.length > 0) {         //检测线段
        var intersects = panorama.raycaster.intersectObjects(panorama.lineGroup.children);
        if (intersects.length > 0) {
            for (var i = 0; i < intersects.length; i++) {
                if (intersects[i].distance > 50) {
                    var dataIndex_i = intersects[i].object.dataIndex;
                    panorama.lineGroup.remove(intersects[i].object);
                    outdoorSceneData[currentScene].lineData.splice(dataIndex_i, 1);
                }

            }

            //更新dataIndex
            for (var i1 = 0; i1 < outdoorSceneData[currentScene].lineData.length; i1++) {
                if (outdoorSceneData[currentScene].lineData[i1].dataIndex != i1) {
                    outdoorSceneData[currentScene].lineData[i1].dataIndex = i1;
                }
            }
            console.log('rubber');
        } else {
            console.log(' no rubber');
        }
    }
}

function onDocumentMouseMove(event) {
    var dx = (onMouseDownMouseX - event.clientX);
    var dy = (event.clientY - onMouseDownMouseY);
    onMouseDownMouseX = event.clientX;
    onMouseDownMouseY = event.clientY;
    panorama.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    panorama.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    if (editType === 2 && currentRubber === 1) {
        rubberIconStart();
        rubberLineStart();
    }

    if (editType === 1 && outdoorSceneData[currentScene].lineData.length > 0 && currentLine === 1 && isEdit === true) {     //画线
        panorama.raycaster.setFromCamera(panorama.mouse, panorama.camera);
        var p = panorama.raycaster.ray.at(100);
        var lineObj = outdoorSceneData[currentScene].lineData[outdoorSceneData[currentScene].lineData.length - 1];
        console.log(lineObj.linecount);

        lineObj.linecount++;
        if (lineObj.linecount === lineObj.capability) {
            lineObj.capability *= 2;
            var old = lineObj.linePosition;
            lineObj.linePosition = new Float32Array(lineObj.capability * 3);
            for (var i = 0; i < old.length; i++) {
                lineObj.linePosition[i] = old[i];
            }
            lineObj.lineGeometry.addAttribute('position', new THREE.BufferAttribute(lineObj.linePosition, 3));
        }
        lineObj.linePosition[lineObj.linecount * 3 - 3] = p.x;
        lineObj.linePosition[lineObj.linecount * 3 - 2] = p.y;
        lineObj.linePosition[lineObj.linecount * 3 - 1] = p.z;
        lineObj.lineGeometry.setDrawRange(0, lineObj.linecount);
        lineObj.lineGeometry.attributes.position.needsUpdate = true;
    }

    //measure
    if (measureType === 1) {    //distance
        panorama.clickDistance('move');
    } else if (measureType === 2) {    //height
        panorama.clickHeight('move');
    } else if (measureType === 3) {    //arae
        panorama.clickArea('move');
    }

    //移动相机
    if (panorama.isUserInteracting === true && isEdit === false) {
        lon += dx * 0.1;
        lat += dy * 0.1;
        syncCamera();
        panorama.updateIconScale();
    } else if (isEdit === true) {      //如果处于编辑状态
        if (currentEditRed >= 0) {
            var coord = panorama.getSpriteXYZ();
            outdoorSceneData[currentScene].iconSprite[currentEditRed].position.set(coord.x, coord.y, coord.z);
        }
    }

}   //鼠标移动事件

function onDocumentMouseClick(event) {

    console.log('click');
    //raycaster 检测是否点击跳转图标,只有当非编辑状态下，才检测是否点击跳转图标
    if (isEdit === false) {
        panorama.raycaster.setFromCamera(panorama.mouse, panorama.camera);
        var intersects = panorama.raycaster.intersectObjects(panorama.group.children);
        if (intersects.length > 0) {
            for (var i = 0; i < intersects.length; i++) {
                if (intersects[i].point.x !== 0 && intersects[i].point.z !== 0) {
                    selectDivClick(intersects[i].object.dataIndex);
                }
            }
        } else {
            // console.log('none click');
        }
    } else {      //编辑状态下，检测是否点击到了消防车等图标
        if (measureType === 0) {      //当不为测量状态的时候，才会触发点击事件的检测
            panorama.raycaster.setFromCamera(panorama.mouse, panorama.camera);
            var intersects = panorama.raycaster.intersectObjects(panorama.iconGroup.children);
            if (intersects.length > 0) {
                for (var i = 0; i < intersects.length; i++) {
                    if (intersects[i].object.editType === true) {
                        currentEditRed = -1;
                        intersects[i].object.editType = false;
                        console.log('move over');
                    } else {
                        console.log('start move');
                        intersects[i].object.editType = true;
                        currentEditRed = intersects[i].object.dataIndex;
                    }
                }
            } else {
                console.log('none edit click');
            }
        } else if (measureType === 1) {    //distance
            if (panorama.clickDistance('click') === null) {
                window.alert('该点不位于地面，请重新选择!');
            }
        } else if (measureType === 2) {    //height
            var result = panorama.clickHeight('click');
            if (result === null) {
                window.alert('该点不位于地面，请重新选择!');
            }
        } else if (measureType === 3) {    //area
            var tempArea = panorama.clickArea('click');
            if (tempArea === null) {
                window.alert('该点不位于地面，请重新选择!');
            }else if(tempArea === 'intersect'){
                window.alert('请顺时针或逆时针标点!');
            }
        }
    }
}       //单击事件

function setDistance(distance, center) {
    var density = gaodeMap.getResolution(center); //meter per pixel
    var zoom = gaodeMap.getZoom();
    var fovy = 51 - zoom * 2;
    fovy = Math.max(11, fovy);
    // k * 2^(-zoom) == distance
    // distance * tan(fovy/2) / (height/2) == density
    var k = density * window.innerHeight / 2 / Math.pow(2, -zoom) / Math.tan(fovy / 180 * Math.PI / 2);
    var newZoom = Math.log(k / distance) / Math.log(2);

    var targetZoom = newZoom;
    var ratio = newZoom - 20;
    if (ratio > 0) {
        newZoom = 20;
        fovy = 2 * Math.atan(Math.tan(fovy * Math.PI / 180 / 2) * Math.pow(2, ratio)) * 180 / Math.PI;
    }

    panorama.camera.fov = fovy;
    panorama.camera.updateProjectionMatrix();
    gaodeMap.setZoom(newZoom);
    return targetZoom;
}

function onDocumentMouseUp(event) {
    panorama.isUserInteracting = false;
    currentLine = 0;
    currentRubber = 0;
}

function onDocumentMouseWheel(event) {
    var fov = panorama.camera.fov + event.deltaY * 0.05;
    panorama.camera.fov = THREE.Math.clamp(fov, 10, 75);

    panorama.updateIconScale();
    updateDivXY();

    panorama.camera.updateProjectionMatrix();
}

function onDocumentDbclick(event) {

    console.log('dbclick');
    panorama.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    panorama.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    if (editType === 3) {

        $('#tempInput').val('');
        $('#tempInput').css('left', event.clientX + 'px');
        $('#tempInput').css('top', event.clientY + 'px');
        $('#tempInput').show();
        document.getElementById('tempInput').focus();

        outdoorSceneData[currentScene].textData.push({
            p3d: panorama.mousePointTo3D(1000),
            dataResult: '',
            dataType: 'text',
            dataIndex: outdoorSceneData[currentScene].textData.length
        });

    } else if (editType === 4) {
        var tempSprite = panorama.addRedIcon(outdoorSceneData[currentScene].iconSprite.length, "../res/img/icon/fireEngine-red.png");
        outdoorSceneData[currentScene].iconSprite.push(tempSprite);
    } else if (editType === 5) {
        var tempSprite = panorama.addRedIcon(outdoorSceneData[currentScene].iconSprite.length, "../res/img/icon/fireHydrant-red.png");
        outdoorSceneData[currentScene].iconSprite.push(tempSprite);
    } else if (editType === 6) {
        var tempSprite = panorama.addRedIcon(outdoorSceneData[currentScene].iconSprite.length, "../res/img/icon/water-red.png");
        outdoorSceneData[currentScene].iconSprite.push(tempSprite);
    }

    if (measureType === 1) {  //确定distance线段点
        var tempDistance = panorama.clickDistance('dbclick', outdoorSceneData[currentScene].measureData.distanceData.length);
        if (tempDistance === null) {
            window.alert('该点不位于地面，请重新选择!');
            return;
        }
        outdoorSceneData[currentScene].measureData.distanceData.push(tempDistance);
        panorama.currentDistance = null;
        //添加div和绑定事件getListenerFunc
        addLabelDiv(outdoorSceneData[currentScene].measureData.distanceData, tempDistance.dataIndex);
        updateDivXY();
    } else if (measureType === 2) {    //点击height
        var tempHeight = panorama.clickHeight('dbclick', outdoorSceneData[currentScene].measureData.heightData.length)
        if (tempHeight === null) {
            window.alert('该点不位于地面，请重新选择!');
            return;
        } else if (tempHeight === 'start') {
            //do nothing
        } else if (typeof tempHeight === 'object') {
            outdoorSceneData[currentScene].measureData.heightData.push(tempHeight);
            panorama.currentHeight = null;
            addLabelDiv(outdoorSceneData[currentScene].measureData.heightData, tempHeight.dataIndex);
            updateDivXY();
        }
    } else if (measureType === 3) {
        var tempArea = panorama.clickArea('dbclick', outdoorSceneData[currentScene].measureData.areaData.length);
        if(tempArea === 'intersect'){
            window.alert('请顺时针或逆时针标点!');
            return;
        }else if(tempArea === null) {
            window.alert('该点不位于地面，请重新选择!');
        }
        outdoorSceneData[currentScene].measureData.areaData.push(tempArea);
        panorama.currentArea = null;
        panorama.areaArray = [];
        addLabelDiv(outdoorSceneData[currentScene].measureData.areaData, tempArea.dataIndex);
        updateDivXY();
    }

}       //双击事件

function enterPress(event) {
    if (event.keyCode === 13) {
        console.log('enter');

        var text = $('#tempInput').val().trim();

        if(text === ''){
            outdoorSceneData[currentScene].textData.pop();
        }else{
            var tempText = outdoorSceneData[currentScene].textData[outdoorSceneData[currentScene].textData.length - 1];
            tempText.dataResult = text;
            addLabelDiv(outdoorSceneData[currentScene].textData,tempText.dataIndex);
            updateDivXY();
        }

        $('#tempInput').hide();
    }
}

//network
function initNetWork() {
    createXmlHttp();
    var param = getRequest();
    userSn = param.userSn;
    targetSceneId = param.sceneId ? param.sceneId : -1;
    var url;
    if (param.stageId) {
        url = 'http://secpano.indoorstar.com:6628/sec/pano/getStage?stageId=' + param.stageId + '&userSn=' + param.userSn + '&secUserSn=' + param.userSn + '&appToken=2CC772253C0F8F35744437A03897564F';
    } else if (param.sceneIds) {
        url = 'http://secpano.indoorstar.com:6628/sec/pano/getScenes?sceneIds=' + param.sceneIds + '&userSn=' + param.userSn + '&secUserSn=' + param.userSn + '&appToken=2CC772253C0F8F35744437A03897564F';
    }
    sendRequest('get', url);
}

function createXmlHttp() {
    if (window.XMLHttpRequest) {
        xmlHttp = new XMLHttpRequest();
    } else {
        xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
}

function sendRequest(method, url, data) {
    if (xmlHttp != null) {
        // window.alert('加载数据中...');
        xmlHttp.open(method, url, true);
        xmlHttp.send(data);
        xmlHttp.onreadystatechange = doResult;
    }
}

function doResult() {
    if (xmlHttp.readyState == 4) {
        if (xmlHttp.status == 200) {
            var tempData = JSON.parse(xmlHttp.responseText);
            if (tempData.s === 0) {   //获取成功
                // window.alert('成功获取数据!');
                var data = JSON.parse(tempData.d);
                data.scenes.sort(sortData);
                for (var i = 0; i < data.scenes.length; i++) {
                    if ((data.scenes[i].sourceType == 12 || data.scenes[i].sourceType == 13) && typeof(data.scenes[i].imageUrls) != 'undefined') {         //如果是室外全景图,plane
                        if (data.scenes[i].id == targetSceneId) {
                            currentScene = outdoorSceneData.length;
                        }

                        var yaw = 0;
                        var pitch = 0;
                        var roll = 0;
                        if (data.scenes[i].sourceType == 13) {
                            var params = data.scenes[i].imageUrls;
                            if (params.length >= 4) {
                                yaw = parseFloat(params[1]) - 180;
                                pitch = parseFloat(params[2]);
                                roll = parseFloat(params[3]);
                            }
                        }

                        outdoorSceneData.push({
                            imageLng: data.scenes[i].imageLng,
                            imageLat: data.scenes[i].imageLat,
                            imageUrl: 'http://www.indoorstar.com:6601/' + data.scenes[i].imageUrls[0],
                            thumbUrl: 'http://www.indoorstar.com:6601/' + data.scenes[i].thumbUrl,
                            imageUpdateTime: changeTimestampToFull(data.scenes[i].imageUpdateTime),
                            yaw: yaw,
                            pitch: pitch,
                            roll: roll,
                            planeX: 0,
                            planeY: data.scenes[i].imageAlt,
                            planeZ: 0,
                            meterForLat: 6378137 * 2 * Math.PI / 360,
                            meterForLng: meterForOneLng(data.scenes[i].imageLat),
                            mapPlane: panorama.textureLoader.load(data.scenes[i].sourceType == 12 ? '../res/img/icon/plane.png' : '../res/img/icon/mobile.png'),
                            iconSprite: [],
                            lineData: [],
                            measureData: {
                                distanceData: [],
                                heightData: [],
                                areaData: []
                            },
                            textData: [],
                            type: data.scenes[i].sourceType
                        })
                    }
                }
                //select Div
                addUrlToSelect(outdoorSceneData);
                //three.js
                panorama.init();
                panorama.currentScene = currentScene;
                panorama.outdoorSceneData = outdoorSceneData;
                panorama.animate();
                //高德地图
                mapInit();
                //btn Click
                btnClick();
                selectDivClick(currentScene);
            } else {      //获取失败,重新登录
                window.alert('无法获取数据，请检查网络并重新登录!');
                self.location = 'login.html';
            }
        }
    }
}

function getRequest() {
    var url = location.search; //获取url中"?"符后的字串
    var theRequest = new Object();
    if (url.indexOf("?") != -1) {
        var str = url.substr(1);
        var strs = str.split("&");
        for (var i = 0; i < strs.length; i++) {
            theRequest[strs[i].split("=")[0]] = (strs[i].split("=")[1]);
        }
    }
    return theRequest;
}

//select div
function addUrlToSelect(tempData) {
    for (var i = 0; i < tempData.length; i++) {
        $('#mCSB_1_container').append('<div style="background-image: url(' + outdoorSceneData[i].thumbUrl + ')" class="listDetailDiv" onclick="selectDivClick(' + i + ')"><span class="timeSpan">' + outdoorSceneData[i].imageUpdateTime + '</span></div>');
    }
}

function selectDivClick(i) {

    console.log('ddd');

    var index = parseInt(i);
    var old = currentScene + 1;
    var ne = index + 1;
    currentScene = index;
    $('#mCSB_1_container div:nth-child(' + old + ')').css('border-color', '#ffffff');
    $('#mCSB_1_container div:nth-child(' + ne + ')').css('border-color', '#fff000');
    //更换icon,line等数据
    panorama.clearEditGroup();
    panorama.loadEditData(outdoorSceneData[currentScene].iconSprite, getLineData(outdoorSceneData[currentScene].lineData), outdoorSceneData[currentScene].measureData);
    clearLabelDiv();
    loadLabelDiv();
    panorama.currentScene = currentScene;
    if ((typeof panorama.scene) != 'undefined') {
        panorama.scene.remove(panorama.group);
        panorama.addIcon(currentScene, outdoorSceneData);
    }
    panorama.updateIconScale();
    console.log(outdoorSceneData);

    //更换全景图的图片
    panorama.mesh.eulerOrder = 'XYZ';
    panorama.mesh.rotation.x = -outdoorSceneData[index].roll / 180 * Math.PI;
    panorama.mesh.rotation.y = -outdoorSceneData[index].yaw / 180 * Math.PI;
    panorama.mesh.rotation.z = -outdoorSceneData[index].pitch / 180 * Math.PI;
    panorama.material.map = panorama.textureLoader.load(outdoorSceneData[index].imageUrl);
    panorama.material.map.anisotropy = 4;
    panorama.material.map.needsUpdate = true;

    syncCamera();
}

function getLineData(lineObj) {
    var result = [];
    for (var i = 0; i < lineObj.length; i++) {
        result.push(lineObj[i].line);
    }
    return result;
}

//浮动div
//添加浮动显示测量结果的div
function loadLabelDiv() {
    for (var k = 0; k < outdoorSceneData[currentScene].measureData.distanceData.length; k++) {
        addLabelDiv(outdoorSceneData[currentScene].measureData.distanceData, k);
    }
    for (var k1 = 0; k1 < outdoorSceneData[currentScene].measureData.heightData.length; k1++) {
        addLabelDiv(outdoorSceneData[currentScene].measureData.heightData, k1);
    }
    for (var k2 = 0; k2 < outdoorSceneData[currentScene].measureData.areaData.length; k2++) {
        addLabelDiv(outdoorSceneData[currentScene].measureData.areaData, k2);
    }
    for (var k3 = 0; k3 < outdoorSceneData[currentScene].textData.length; k3++) {
        addLabelDiv(outdoorSceneData[currentScene].textData, k3);
    }
    updateDivXY();
}

function clearLabelDiv() {
    var tempArray = $('.amap-ranging-label');
    for (var i = 0; i < tempArray.length; i++) {
        tempArray[i].parentNode.removeChild(tempArray[i]);
    }
    var tempText = $('.arrow_box');
    for (var j = 0; j < tempText.length; j++) {
        tempText[j].parentNode.removeChild(tempText[j]);
    }
}

function addLabelDiv(dataArray, dataIndex) {
    if(dataArray[dataIndex].dataType === 'text'){
        $('#mainDiv').append('    <div id="' + dataArray[dataIndex].dataType + dataIndex + '" class="arrow_box">\n' +
            '            <span>' + dataArray[dataIndex].dataResult + '</span>\n' +
            '            <span><img class="text_delimg" src="../res/img/icon/text_delete.png"></span>\n' +
            '            </div>');
        $('#' + dataArray[dataIndex].dataType + dataIndex + ' .text_delimg').click(function (ev) {
            imgListenerFunc(dataArray[dataIndex].dataType, dataIndex);
            ev.stopPropagation();
        });
    }else{
        $('#mainDiv').append(' <div id="' + dataArray[dataIndex].dataType + dataIndex + '" class="amap-ranging-label">\n' +
            '        <span>' + dataArray[dataIndex].dataResult + '</span>\n' +
            '        <span><img class="delimg" src="../res/img/icon/destroy.png"></span>\n' +
            '    </div>');
        $('#' + dataArray[dataIndex].dataType + dataIndex + ' .delimg').click(function (ev) {
            imgListenerFunc(dataArray[dataIndex].dataType, dataIndex);
            ev.stopPropagation();
        });
    }

    $('#' + dataArray[dataIndex].dataType + dataIndex + '').click(function (ev) {
        ev.stopPropagation();
    });
}

//浮动img的监听函数
function imgListenerFunc(dataType, dataIndex) {
    if (dataType === 'distance') {
        var tempDistance = outdoorSceneData[currentScene].measureData.distanceData[dataIndex];
        outdoorSceneData[currentScene].measureData.distanceData.splice(dataIndex, 1);
        panorama.measureGroup.remove(tempDistance);
        $('#' + tempDistance.dataType + tempDistance.dataIndex + '').remove();

        //更新dataIndex
        for (var i1 = 0; i1 < outdoorSceneData[currentScene].measureData.distanceData.length; i1++) {
            if (outdoorSceneData[currentScene].measureData.distanceData[i1].dataIndex != i1) {
                $('#' + outdoorSceneData[currentScene].measureData.distanceData[i1].dataType + outdoorSceneData[currentScene].measureData.distanceData[i1].dataIndex + '').remove();
                outdoorSceneData[currentScene].measureData.distanceData[i1].dataIndex = i1;
                //添加一个div
                addLabelDiv(outdoorSceneData[currentScene].measureData.distanceData, i1);
                updateDivXY();
            }
        }
    } else if (dataType === 'height') {
        var tempHeight = outdoorSceneData[currentScene].measureData.heightData[dataIndex];
        outdoorSceneData[currentScene].measureData.heightData.splice(dataIndex, 1);
        panorama.measureGroup.remove(tempHeight);
        $('#' + tempHeight.dataType + tempHeight.dataIndex + '').remove();

        //更新dataIndex
        for (var i2 = 0; i2 < outdoorSceneData[currentScene].measureData.heightData.length; i2++) {
            if (outdoorSceneData[currentScene].measureData.heightData[i2].dataIndex != i2) {
                $('#' + outdoorSceneData[currentScene].measureData.heightData[i2].dataType + outdoorSceneData[currentScene].measureData.heightData[i2].dataIndex + '').remove();
                outdoorSceneData[currentScene].measureData.heightData[i2].dataIndex = i2;
                //添加一个div
                addLabelDiv(outdoorSceneData[currentScene].measureData.heightData, i2);
                updateDivXY();
            }
        }
    } else if (dataType === 'area') {
        var tempArea = outdoorSceneData[currentScene].measureData.areaData[dataIndex];
        outdoorSceneData[currentScene].measureData.areaData.splice(dataIndex, 1);
        panorama.measureGroup.remove(tempArea);
        $('#' + tempArea.dataType + tempArea.dataIndex + '').remove();

        //更新dataIndex
        for (var i3 = 0; i3 < outdoorSceneData[currentScene].measureData.areaData.length; i3++) {
            if (outdoorSceneData[currentScene].measureData.areaData[i3].dataIndex != i3) {
                $('#' + outdoorSceneData[currentScene].measureData.areaData[i3].dataType + outdoorSceneData[currentScene].measureData.areaData[i3].dataIndex + '').remove();
                outdoorSceneData[currentScene].measureData.areaData[i3].dataIndex = i3;
                //添加一个div
                addLabelDiv(outdoorSceneData[currentScene].measureData.areaData, i3);
                updateDivXY();
            }
        }
    }else if(dataType === 'text'){
        var tempText = outdoorSceneData[currentScene].textData[dataIndex];
        outdoorSceneData[currentScene].textData.splice(dataIndex, 1);
        $('#' + tempText.dataType + tempText.dataIndex + '').remove();

        //更新dataIndex
        for (var i4 = 0; i4 < outdoorSceneData[currentScene].textData.length; i4++) {
            if (outdoorSceneData[currentScene].textData[i4].dataIndex != i4) {
                $('#' + outdoorSceneData[currentScene].textData[i4].dataType + outdoorSceneData[currentScene].textData[i4].dataIndex + '').remove();
                outdoorSceneData[currentScene].textData[i4].dataIndex = i4;
                //添加一个div
                addLabelDiv(outdoorSceneData[currentScene].textData, i4);
                updateDivXY();
            }
        }
    }
}

//更新浮动div的坐标
function updateDivXY() {
    for (var i = 0; i < outdoorSceneData[currentScene].measureData.distanceData.length; i++) {
        console.log('loop?');
        var tempDistance = outdoorSceneData[currentScene].measureData.distanceData[i];
        var p2d = P3dToP2dCoord(new THREE.Vector3(tempDistance.geometry.vertices[0].x, tempDistance.geometry.vertices[0].y, tempDistance.geometry.vertices[0].z));
        if (p2d.z > 0 && p2d.z < 1) {
            $('#' + tempDistance.dataType + tempDistance.dataIndex + '').show();
            $('#' + tempDistance.dataType + tempDistance.dataIndex + '').css('left', p2d.x + 'px');
            $('#' + tempDistance.dataType + tempDistance.dataIndex + '').css('top', p2d.y + 10 + 'px');
        } else {
            $('#' + tempDistance.dataType + tempDistance.dataIndex + '').hide();
        }
    }
    for (var i2 = 0; i2 < outdoorSceneData[currentScene].measureData.heightData.length; i2++) {
        var tempHeight = outdoorSceneData[currentScene].measureData.heightData[i2];
        var p2d_2 = P3dToP2dCoord(new THREE.Vector3(tempHeight.geometry.vertices[0].x, tempHeight.geometry.vertices[0].y, tempHeight.geometry.vertices[0].z));
        if (p2d_2.z > 0 && p2d_2.z < 1) {
            $('#' + tempHeight.dataType + tempHeight.dataIndex + '').show();
            $('#' + tempHeight.dataType + tempHeight.dataIndex + '').css('left', p2d_2.x + 'px');
            $('#' + tempHeight.dataType + tempHeight.dataIndex + '').css('top', p2d_2.y + 10 + 'px');
        } else {
            $('#' + tempHeight.dataType + tempHeight.dataIndex + '').hide();
        }
    }
    for (var i3 = 0; i3 < outdoorSceneData[currentScene].measureData.areaData.length; i3++) {
        var tempArea = outdoorSceneData[currentScene].measureData.areaData[i3];
        var p2d_3 = P3dToP2dCoord(new THREE.Vector3(tempArea.geometry.vertices[0].x, -panorama.outdoorSceneData[panorama.currentScene].planeY, tempArea.geometry.vertices[0].y));
        if (p2d_3.z > 0 && p2d_3.z < 1) {
            $('#' + tempArea.dataType + tempArea.dataIndex + '').show();
            $('#' + tempArea.dataType + tempArea.dataIndex + '').css('left', p2d_3.x + 'px');
            $('#' + tempArea.dataType + tempArea.dataIndex + '').css('top', p2d_3.y + 10 + 'px');
        } else {
            $('#' + tempArea.dataType + tempArea.dataIndex + '').hide();
        }
    }
    for (var i4 = 0; i4 < outdoorSceneData[currentScene].textData.length; i4++) {
        var tempText = outdoorSceneData[currentScene].textData[i4];
        var tempText_dom =  $('#' + tempText.dataType + tempText.dataIndex + '');
        var p2d_4 = P3dToP2dCoord(new THREE.Vector3(tempText.p3d.x, tempText.p3d.y,tempText.p3d.z));
        if (p2d_4.z > 0 && p2d_4.z < 1) {
            $('#' + tempText.dataType + tempText.dataIndex + '').show();
            $('#' + tempText.dataType + tempText.dataIndex + '').css('left', p2d_4.x  - tempText_dom.width()/2 - 10 + 'px');
            $('#' + tempText.dataType + tempText.dataIndex + '').css('top', p2d_4.y - 20 - tempText_dom.height() + 'px');
        } else {
            $('#' + tempText.dataType + tempText.dataIndex + '').hide();
        }
    }
}

