define(['THREE', 'utils'], function (THREE, utils) {

    return {
        get3DPoint: function (event, container) {
            return container.camera.groundpointMouse(container.scene.imageAlt, event.clientX, event.clientY);
        },
        createLine: function (p1, p2) {
            var materialDistance = new THREE.LineBasicMaterial({
                color: 0x44A6F4,
                linewidth: 2
            });
            var geometry = new THREE.Geometry();
            geometry.vertices.push(
                new THREE.Vector3(p1.x, p1.y, p1.z),
                new THREE.Vector3(p2.x, p2.y, p2.z)
            );
            var tempLine = new THREE.Line(geometry, materialDistance);
            return tempLine;
        },
        addImageToPoint: function (divName) {
            var $h1 = $('    <div  class="pointDiv">\n' +
                '        <img src="../res/img/icon/point.png" style="width: 12px;margin-bottom: 6px;">\n' +
                '    </div>');

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
                        if((tempP !== null ) && tempP.x && tempP.y){
                            linePointList[i].img.show();
                            linePointList[i].img.css('left', tempP.x - 6 + 'px');
                            linePointList[i].img.css('top', tempP.y - 6 + 'px');
                        }else{
                            linePointList[i].img.hide();
                        }
                    }
                    if (linePointList[i].label) {
                        if( (tempP !== null ) && tempP.x && tempP.y){
                            linePointList[i].label.show();
                            linePointList[i].label.css('left', tempP.x + 15 + 'px');
                            linePointList[i].label.css('top', tempP.y + 10 + 'px');
                        }else{
                            linePointList[i].label.hide();
                        }
                    }
                }
            }
        },
        updateContent: function (container, linePointList, type) {

            if (type === 'distance') {
                var distanceArray = this.calculateDistance(linePointList, 'distance');
            } else if (type === 'height') {
                if (linePointList.length === 2) {
                    var distanceArray = this.calculateDistance(linePointList, 'height');
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
                            linePointList[tempI].label.text('终点:  ' + distanceArray[tempI]);
                            linePointList[tempI].label.append('        <img src="../res/img/icon/destroy.png"/>');
                        }
                    } else {
                        if (linePointList[i].label.text() == '') {
                            linePointList[i].label.text('长度:  ' + distanceArray[i]);
                        }
                    }
                }
            }
        },
        calculateDistance: function (linePointArray, type) {
            var result = [0];
            if (type === 'distance') {
                for (var i = 1; i < linePointArray.length; i++) {
                    result.push(utils.returnFloat(result[i - 1] + utils.twoPointsDistance(linePointArray[i - 1].point, linePointArray[i].point)));
                }
            } else if (type === 'height') {
                result.push(utils.returnFloat(Math.abs(linePointArray[1].point.y - linePointArray[0].point.y)));
            }
            return result;
        },
        clearDivLabel: function (divName) {


            $('#' + divName + '').empty();
            // $('.pointLabel').remove();

        },
        addLines: function (container, group, data, divName) {
            for (var i = 0; i < data.length; i++) {
                var tempPointList = data[i];
                $('#' + divName + '').append(tempPointList[0].img);
                $('#' + divName + '').append(tempPointList[0].label);
                for (var j = 1; j < tempPointList.length; j++) {
                    group.add(this.createLine(tempPointList[j - 1].point, tempPointList[j].point));
                    $('#' + divName + '').append(tempPointList[j].img);
                    $('#' + divName + '').append(tempPointList[j].label);
                }
                this.syncPosition(container, tempPointList);
                this.updateContent(container, tempPointList);
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
                linePointList[linePointList.length - 1].label.text('面积:  ' + areaNum);
                linePointList[linePointList.length - 1].label.append('        <img src="../res/img/icon/destroy.png"/>');
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
        addAreas: function (container, group, data) {
            for (var i = 0; i < data.length; i++) {
                var tempPointList = data[i];

                group.add(this.createArea(container, tempPointList));
                this.syncPosition(container, tempPointList, 'area');
                // this.updateContent(container, tempPointList);
                $('#areaDiv').append(tempPointList[tempPointList.length - 1].label);
            }
        }
    }

})
;