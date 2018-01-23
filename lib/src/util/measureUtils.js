define(['THREE','utils'], function (THREE,utils) {

    return {
        get3DPoint: function (event, container) {

            var tempRay = container.camera.rayMouse(event.clientX, event.clientY);
            var distance = -50 / tempRay.direction.y;
            var p = tempRay.at(distance);

            // if (p.y > 0 || (Math.sqrt(Math.pow(p.x, 2) + Math.pow(p.z, 2)) > 800)) {    //该点超出边界，不显示，返回null
            //     return null;
            // }
            return p;
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
        addImageToPoint: function () {
            var $h1 = $('    <div  class="pointDiv">\n' +
                '        <img src="res/img/icon/point.png" style="width: 12px;margin-bottom: 6px;">\n' +
                '    </div>');

            $('#mainDiv').append($h1);
            return $h1;
        },
        addLabelToPoint: function () {
            var $h2 = $('    <div class="pointLabel">\n' +
                '            </div>');
            $('#mainDiv').append($h2);
            return $h2;
        },
        syncPosition: function (container, linePointList) {
            for (var i = 0; i < linePointList.length; i++) {

                if (linePointList[i].removeable === false) {

                    var temp3D = new THREE.Vector3(linePointList[i].point.x, linePointList[i].point.y, linePointList[i].point.z);
                    var tempP = container.camera.project3dToScreen(temp3D);

                    if (linePointList[i].img) {
                        linePointList[i].img.css('left', tempP.x - 6 + 'px');
                        linePointList[i].img.css('top', tempP.y - 6 + 'px');
                    }
                    if (linePointList[i].label) {
                        linePointList[i].label.css('left', tempP.x + 15 + 'px');
                        linePointList[i].label.css('top', tempP.y + 10 + 'px');
                    }
                }
            }
        },
        updateContent: function (container, linePointList) {

            var distanceArray = this.calculateDistance(linePointList);
            for (var i = 0; i < linePointList.length; i++) {
                if (linePointList[i].removeable === false) {
                    if (i === 0) {
                        linePointList[i].label.text('起点');
                    } else if (linePointList[i].type === 'end') {
                        var tempI = linePointList.length - 1;
                        linePointList[tempI].label.text('终点:  ' + distanceArray[tempI]);
                        linePointList[tempI].label.append('        <img src="res/img/icon/destroy.png"/>');
                    } else {
                        linePointList[i].label.text('长度:  ' + distanceArray[i]);
                    }
                }
            }
        },
        calculateDistance: function (linePointArray) {
            var result = [0];
            for (var i = 1; i < linePointArray.length; i++) {
                result.push(utils.returnFloat(result[i - 1] + utils.twoPointsDistance(linePointArray[i - 1].point, linePointArray[i].point)));
            }
            return result;
        },
        addListener: function (linePointList) {

        },
    }
});