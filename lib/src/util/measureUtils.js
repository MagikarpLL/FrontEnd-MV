define(['THREE', 'utils', 'jquery', 'database', 'Meshline'], function (THREE, utils, $, database, Meshline) {

    return {
        //calculate
        get3dGroundPoint: function (event, container) {
            return container.camera.groundpointMouse(container.scene.imageAlt, event.offsetX, event.offsetY);
        },

        //other
        detectPointGround: function (container, event, name) {
            var temp = this.get3dGroundPoint(event, container);
            var dy = container.camera.rayMouse(event.offsetX, event.offsetY).direction.y;
            if (dy > 0 || (Math.sqrt(Math.pow(temp.x, 2) + Math.pow(temp.z, 2)) > 800)) {    //该点超出边界，不显示，返回null
                $('#' + name + '').text('该点不位于地面，请重新选择');
                $('#' + name + '').css('color', 'red');
                return null;
            } else {
                $('#' + name + '').text('单击继续，双击结束');
                $('#' + name + '').css('color', 'black');
                return temp;
            }
        },
        hintArrayPointIntersect: function (linePointList) {
            if (utils.detectArrayPointsIntersect(utils.getPointArray(linePointList))) {     //有线相交
                $('#moveSetStart').text('图形线段交叉，请顺/逆时针选择点');
                $('#moveSetStart').css('color', 'red');
                return true;
            } else {
                $('#moveSetStart').text('单击继续，双击结束');
                $('#moveSetStart').css('color', 'black');
                return false;
            }
        },
        hintMove: function (start, event, text) {
            if (start === false) {
                if ($('#clickSetStart')[0]) {
                    $('#clickSetStart').css('top', event.offsetY + 30);
                    $('#clickSetStart').css('left', event.offsetX + 30);
                } else {
                    $('#mainDiv').append('<div id="clickSetStart" class="clickSetStart">单击以确定起点</div>');
                }
                $('#moveSetStart').remove();
                return false;
            } else {
                if ($('#moveSetStart')[0]) {
                    $('#moveSetStart').css('top', event.offsetY + 30);
                    $('#moveSetStart').css('left', event.offsetX + 30);
                } else {
                    $('#mainDiv').append('<div id="moveSetStart" class="clickSetStart">' + text + '</div>');
                }
                $('#clickSetStart').remove();
                return true;
            }
        },

        //html div
        addImageToPoint: function (divName) {
            if (divName === 'heightDiv') {
                var $h1 = $('    <div  class="pointDiv">\n' +
                    '        <img src="resource/ids360Viewer/img/icon/heightPoint.png" style="width: 12px;margin-bottom: 6px;">\n' +
                    '    </div>');
            } else if (divName === 'distanceDiv') {
                var $h1 = $('    <div  class="pointDiv">\n' +
                    '        <img src="resource/ids360Viewer/img/icon/distancePoint.png" style="width: 12px;margin-bottom: 6px;">\n' +
                    '    </div>');
            }
            $('#' + divName + '').append($h1);
            return $h1;
        },
        addLabelToPoint: function (divName) {
            var $h2 = $('    <div class="pointLabel">\n' +
                '            </div>');
            $('#' + divName + '').append($h2);
            $h2.text('');
            return $h2;
        },
        syncPosition: function (container, linePointList, type) {
            for (var i = 0; i < linePointList.length; i++) {
                if (linePointList[i].removeable === false) {
                    if (type === 'area') {
                        var temp3D = new THREE.Vector3(linePointList[i].point.x, -container.scene.imageAlt, linePointList[i].point.y);
                    } else {
                        var temp3D = new THREE.Vector3(linePointList[i].point.x, linePointList[i].point.y, linePointList[i].point.z);
                    }
                    var tempP = container.camera.project3dToScreen(temp3D);
                    if (linePointList[i].img) {
                        if ((tempP !== null) && tempP.x && tempP.y) {
                            linePointList[i].img.show();
                            linePointList[i].img.css('left', tempP.x - 6 + 'px');
                            linePointList[i].img.css('top', tempP.y - 6 + 'px');
                        } else {
                            linePointList[i].img.hide();
                        }
                    }
                    if (linePointList[i].label) {
                        if ((tempP !== null) && tempP.x && tempP.y) {
                            linePointList[i].label.show();
                            linePointList[i].label.css('left', tempP.x + 15 + 'px');
                            linePointList[i].label.css('top', tempP.y + 10 + 'px');
                        } else {
                            linePointList[i].label.hide();
                        }
                    }
                }
            }
        },
        updateContent: function (container, linePointList, type) {
            if (type === 'distance') {
                var distanceArray = utils.calculateDistance(linePointList, 'distance');
            } else if (type === 'height') {
                if (linePointList.length === 2) {
                    var distanceArray = utils.calculateDistance(linePointList, 'height');
                }
            }
            for (var i = 0; i < linePointList.length; i++) {
                if (linePointList[i].removeable === false) {
                    if (i === 0) {
                        if (linePointList[i].label.text() == '') {
                            linePointList[i].label.text('起点');
                        }
                    } else if (linePointList[i].type === 'end') {
                        var tempI = linePointList.length - 1;
                        if (linePointList[i].label.text() == '') {
                            linePointList[tempI].label.text('共:  ' + distanceArray[tempI] + '米');
                            linePointList[tempI].label.append('        <img class="destroyImg" src="resource/ids360Viewer/img/icon/destroy.png"/>');
                        }
                    } else {
                        if (linePointList[i].label.text() == '') {
                            linePointList[i].label.text(distanceArray[i] + '米');
                        }
                    }
                }
            }
        },
        clearDivLabel: function (divName) {
            $('#' + divName + '').empty();
        },
        deleteDataImgLabel: function (data) {
            for (var i = 0; i < data.length; i++) {
                for (var j = 0; j < data[i].length; j++) {
                    if (data[i][j].img) {
                        data[i][j].img = null;
                    }
                    if (data[i][j].label) {
                        data[i][j].label = null;
                    }
                }
            }
        },
        addDataImgLabel: function (data, type, container) {
            if (type === 'area') {
                for (var i = 0; i < data.length; i++) {
                    for (var j = 0; j < data[i].length; j++) {
                        if (data[i][j].label === null) {
                            data[i][j].label = this.addLabelToPoint('areaDiv');
                            this.updateAreaContent(container, data[i]);
                        }
                    }
                    var linePointList1 = data[i];
                    if (typeof linePointList1.dataIndex === 'undefined') linePointList1.dataIndex = i;
                    linePointList1[linePointList1.length - 1].label[0].children[0].setAttribute('onclick', 'removeArea(' + linePointList1.dataIndex + ')');
                }
            } else if (type === 'distance') {
                for (var i2 = 0; i2 < data.length; i2++) {
                    for (var j2 = 0; j2 < data[i2].length; j2++) {
                        if (data[i2][j2].img === null) {
                            data[i2][j2].img = this.addImageToPoint('distanceDiv');
                        }
                        if (data[i2][j2].label === null) {
                            data[i2][j2].label = this.addLabelToPoint('distanceDiv');
                        }
                    }
                    this.updateContent(container, data[i2], 'distance');
                    var linePointList2 = data[i2];
                    if (typeof linePointList2.dataIndex === 'undefined') linePointList2.dataIndex = i2;
                    linePointList2[linePointList2.length - 1].label[0].children[0].setAttribute('onclick', 'removeLine(' + linePointList2.dataIndex + ')');
                }
            } else if (type === 'height') {
                for (var i3 = 0; i3 < data.length; i3++) {
                    for (var j3 = 0; j3 < data[i3].length; j3++) {
                        if (data[i3][j3].img === null) {
                            data[i3][j3].img = this.addImageToPoint('heightDiv');
                        }
                        if (data[i3][j3].label === null) {
                            data[i3][j3].label = this.addLabelToPoint('heightDiv');
                        }
                    }
                    this.updateContent(container, data[i3], 'height');
                    var linePointList3 = data[i3];
                    if (typeof linePointList3.dataIndex === 'undefined') linePointList3.dataIndex = i3;
                    linePointList3[linePointList3.length - 1].label[0].children[0].setAttribute('onclick', 'removeHeight(' + linePointList3.dataIndex + ')');
                }
            } else if (type === 'text') {
                for (var i4 = 0; i4 < data.length; i4++) {
                    if (data[i4].label === null) {
                        if (typeof data[i4].dataIndex === 'undefined') data[i4].dataIndex = i4;
                        var $h1 = $('    <div class="arrow_box">\n' +
                            '            <span>' + data[i4].text + '</span>\n' +
                            '            <span><img class="text_delimg" src="resource/ids360Viewer/img/icon/text_delete.png" onclick="removeText(' + data[i4].dataIndex + ')"></span>\n' +
                            '            </div>');
                        $('#textDiv').append($h1);
                        $h1.css('color', '#' + data[i4].color);
                        data[i4].label = $h1;
                    }
                }
            }
        },

        //line
        createLine: function (p1, p2, color) {
            var n1 = new THREE.Vector3(p1.x, p1.y, p1.z).setLength(100);
            var n2 = new THREE.Vector3(p2.x, p2.y, p2.z).setLength(100);
            var tempLine = new Meshline([n1, n2], 1, color);
            return tempLine;
        },
        addLines: function (container, group, data, divName, color) {
            for (var i = 0; i < data.length; i++) {
                var tempPointList = data[i];
                $('#' + divName + '').append(tempPointList[0].img);
                $('#' + divName + '').append(tempPointList[0].label);
                for (var j = 1; j < tempPointList.length; j++) {
                    group.add(this.createLine(tempPointList[j - 1].point, tempPointList[j].point, color));
                    $('#' + divName + '').append(tempPointList[j].img);
                    $('#' + divName + '').append(tempPointList[j].label);
                }
                this.syncPosition(container, tempPointList);
                this.updateContent(container, tempPointList);
            }
        },

        //area
        removeAndCreateAreaLines: function (linePointList, color, group) {
            for (var j = group.children.length - 1; j >= 0; j--) {
                group.remove(group.children[j]);
            }
            for (var i = 0; i < linePointList.length; i++) {
                var second = (i + 1) % linePointList.length;
                var tempLine = this.createLine(linePointList[i].pointLine, linePointList[second].pointLine, color);
                group.add(tempLine);
            }
        },
        createAreaLines: function (linePointList, color, group) {
            for (var i = 0; i < linePointList.length; i++) {
                var second = (i + 1) % linePointList.length;
                var tempLine = this.createLine(linePointList[i].pointLine, linePointList[second].pointLine, color);
                group.add(tempLine);
            }
        },
        getAreaPlaneShape: function (linePointList) {
            var result = [];
            for (var i = 0; i < linePointList.length; i++) {
                result.push(linePointList[i].point);
            }
            var planeShape = new THREE.Shape();
            planeShape.moveTo(result[0].x, result[0].y);
            for (var i = 1; i < result.length; i++) {
                planeShape.lineTo(result[i].x, result[i].y);
            }
            return planeShape;
        },
        updateAreaContent: function (container, linePointList) {
            var result = [];
            for (var i = 0; i < linePointList.length; i++) {
                result.push(linePointList[i].point);
            }
            var areaNum = utils.returnFloat(Math.abs(utils.calcGroundArea(result)));
            if (linePointList[linePointList.length - 1].label.text() == '') {
                linePointList[linePointList.length - 1].label.text(areaNum + '平方米');
                linePointList[linePointList.length - 1].label.append('        <img class="destroyImg" src="resource/ids360Viewer/img/icon/destroy.png"/>');
            }
        },
        createArea: function (container, linePointList) {
            var materialArea = new THREE.MeshBasicMaterial({
                color: 0x44A6F4,
                side: THREE.DoubleSide,
                transparent: true,
                opacity: 0.4
            });
            var planeShape = this.getAreaPlaneShape(linePointList);
            var geometry = new THREE.ShapeGeometry(planeShape);
            var currentArea = new THREE.Mesh(geometry, materialArea);
            currentArea.position.set(0, -container.scene.imageAlt, 0);
            currentArea.rotateX(-Math.PI / 2);
            currentArea.scale.set(1, -1, 1);
            return currentArea;
        },
        addAreas: function (container, group, data, lineColor) {
            for (var i = 0; i < data.length; i++) {
                var tempPointList = data[i];
                this.createAreaLines(tempPointList, lineColor, group);
                group.add(this.createArea(container, tempPointList));
                this.syncPosition(container, tempPointList, 'area');
                // this.updateContent(container, tempPointList);
                $('#areaDiv').append(tempPointList[tempPointList.length - 1].label);
            }
        },

        //icon
        createIcon: function (imagePath, container, tempPosition, dataIndex) {
            var loadmanager = new THREE.LoadingManager();
            var imageLoader = new THREE.ImageLoader(loadmanager);
            var iconTexture = new THREE.Texture();
            var iconMaterial = new THREE.SpriteMaterial({map: iconTexture});
            imageLoader.load(imagePath, function (image) {
                iconTexture.image = image;
                iconTexture.needsUpdate = true;
                iconTexture.minFilter = THREE.LinearFilter;
                iconTexture.generateMipmaps = false;
                iconTexture.needsUpdate = true;
            });
            var icon = new THREE.Sprite(iconMaterial);
            icon.position.set(tempPosition.x, tempPosition.y, tempPosition.z);
            icon.userData.dataIndex = dataIndex;
            icon.userData.moveType = false;
            return icon;
        },

        //detect point is Vector3d or not
        changeObjToV3d: function (data, type) {
            switch (type) {
                case 'area':
                    data.forEach(function (pointList1) {
                        pointList1.forEach(function (pointObj1) {
                            if (pointObj1.point.constructor.name === 'Vector2') {
                                return;
                            } else {
                                pointObj1.point = new THREE.Vector2(pointObj1.point.x, pointObj1.point.y);
                            }
                            pointObj1.pointLine = new THREE.Vector3(pointObj1.pointLine.x, pointObj1.pointLine.y, pointObj1.pointLine.z);
                        })
                    });
                    break;
                case 'distance':
                case 'height':
                    data.forEach(function (pointList2) {
                        pointList2.forEach(function (pointObj2) {
                            if (pointObj2.point.constructor.name === 'Vector3') {
                                return;
                            } else {
                                pointObj2.point = new THREE.Vector3(pointObj2.point.x, pointObj2.point.y, pointObj2.point.z);
                            }
                        })
                    });
                    break;
                case 'icon':
                    data.forEach(function (pointObj3) {
                        if (pointObj3.point.constructor.name === 'Vector3') {
                            return;
                        } else {
                            pointObj3.point = new THREE.Vector3(pointObj3.point.x, pointObj3.point.y, pointObj3.point.z);
                        }
                    });
                    break;
                case 'line':
                    data.forEach(function (pointList4) {
                        for (var i = 0; i < pointList4.points.length; i++) {
                            if (pointList4.points[i].constructor.name === 'Vector3') {
                                return;
                            } else {
                                pointList4.points[i] = new THREE.Vector3(pointList4.points[i].x, pointList4.points[i].y, pointList4.points[i].z);
                            }
                        }
                    });
                    break;
                case 'text':
                    data.forEach(function (pointObj5) {
                        if (pointObj5.point3d.constructor.name === 'Vector3') {
                            return;
                        } else {
                            pointObj5.point3d = new THREE.Vector3(pointObj5.point3d.x, pointObj5.point3d.y, pointObj5.point3d.z);
                        }
                    });
                    break;
            }
        },

        //save data to server
        saveDataToServer: function (sceneId,sceneData) {
            var result = {};
            result.iconData = sceneData.iconData;
            result.lineList = sceneData.lineList;
            result.areaData = this.cloneAreaData(sceneData.areaData);
            result.distanceData = this.cloneDistanceHeightData(sceneData.distanceData);
            result.heightData = this.cloneDistanceHeightData(sceneData.heightData);
            result.textData = this.cloneTextData(sceneData.textData);
            database.updateSceneData(sceneId, result, null);
        },
        cloneAreaData: function (areaData) {
            var result = [];
            areaData.forEach(function (area) {
                var tempArea = [];
                area.forEach(function (point, index) {
                    var tempPoint = {};
                    if (index === area.length - 1) {
                        tempPoint.label = null;
                        tempPoint.point = point.point;
                        tempPoint.pointLine = point.pointLine;
                        tempPoint.removeable = point.removeable;
                        tempPoint.type = point.type;
                    } else {
                        tempPoint = point;
                    }
                    tempArea.push(tempPoint);
                });
                tempArea.dataIndex = area.dataIndex;
                result.push(tempArea);
            });
            return result;
        },
        cloneDistanceHeightData: function (distanceData) {
            var result = [];
            distanceData.forEach(function (distance) {
                var tempDistance = [];
                distance.forEach(function (point) {
                    var tempPoint = {};
                    tempPoint.label = null;
                    tempPoint.img = null;
                    tempPoint.point = point.point;
                    tempPoint.removeable = point.removeable;
                    tempPoint.type = point.type;
                    tempDistance.push(tempPoint);
                });
                tempDistance.dataIndex = distance.dataIndex;
                result.push(tempDistance);
            });
            return result;
        },
        cloneTextData: function (textData) {
            var result = [];
            textData.forEach(function (text) {
                var tempText = {};
                tempText.color = text.color;
                tempText.dataIndex = text.dataIndex;
                tempText.label = null;
                tempText.point3d = text.point3d;
                tempText.text = text.text;
                result.push(tempText);
            });
            return result;
        },
    }
});