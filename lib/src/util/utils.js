define(['THREE'], function (THREE) {

    return {
        lnglatToXYZ: function (reference, point) {
            var dlng = point.imageLng - reference.imageLng;
            var dz = (dlng * 6378137 * Math.cos(reference.imageLat * Math.PI / 180) * 2 * Math.PI / 360); //z -> east

            var dlat = point.imageLat - reference.imageLat;
            var dx = (dlat * 6378137 * 2 * Math.PI / 360); //x -> north

            var dy = point.imageAlt - reference.imageAlt;

            return new THREE.Vector3(dx, dy, dz);
        },
        meterForOneLng: function (lat) {
            return 6378137 * Math.cos(this.radians(lat)) * 2 * Math.PI / 360;     // 1经度对应多少米
        },
        //经纬度转换为弧度
        radians: function (angle) {
            return angle * Math.PI / 180;
        },
        //将时间戳转化为 YYYY/MM/DD MM:SS形式
        changeTimestampToFull: function (timestamp) {
            var mDate = new Date(timestamp);
            return mDate.toLocaleDateString() + " <br/> " + mDate.toTimeString().substring(0, 5);
        },
        twoPointsDistance: function (p1, p2) {  //两点间距离
            return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.z - p2.z, 2));
        },
        //保留三位小数
        returnFloat: function (value) {
            var value = Math.round(parseFloat(value) * 1000) / 1000;
            var xsd = value.toString().split(".");
            if (xsd.length == 1) {
                value = value.toString() + ".00";
                return value;
            }
            if (xsd.length > 1) {
                if (xsd[1].length < 2) {
                    value = value.toString() + "0";
                }
                return value;
            }
        },
        //计算空中点在地面点的竖直线上的投影点
        calcAirPoint: function (groundPoint, mousePoint, camera) {
            var dx1 = groundPoint.x;
            var dz1 = groundPoint.z;
            var groundLength1 = Math.sqrt(dx1 * dx1 + dz1 * dz1);
            var px = -dz1;
            var pz = dx1;
            camera.raycaster.setFromCamera(mousePoint, camera.camera_threejs);
            var dir = camera.raycaster.ray.direction;
            var projected = dir.projectOnPlane(new THREE.Vector3(px, 0, pz));

            if (groundPoint.dot(projected) > 0) { // length>0 and same direction
                projected.normalize();
                var groundLength2 = Math.sqrt(1 - projected.y * projected.y);
                var length = groundLength1 / groundLength2;
                return projected.multiplyScalar(length);
            } else {
                return null;
            }
        },
        //计算地面点数组组成的多边形（起始点不重复）的面积
        calcGroundArea: function (groundPointArray) {
            var total = 0;
            for (var i = 0; i < groundPointArray.length; i++) {
                var p1 = groundPointArray[i];
                var p2 = groundPointArray[(i + 1) % groundPointArray.length];
                total += p1.x * p2.y - p2.x * p1.y;
            }
            return Math.abs(total) / 2; //单位平方米
        },
        //判断该平面点的数组中是否有线相交
        detectArrayPointsIntersect: function (pointArray) {
            //pointArray.length >= 4
            for (var j = 2; j < pointArray.length - 1; j++) {
                if (this.detectSegmentIntersec(pointArray[0], pointArray[pointArray.length - 1], pointArray[j - 1], pointArray[j])) {
                    return true;
                }
            }
            for (var i = 1; i < pointArray.length - 2; i++) {
                if (this.detectSegmentIntersec(pointArray[pointArray.length - 2], pointArray[pointArray.length - 1], pointArray[i - 1], pointArray[i])) {
                    return true;
                }
            }
            return false;
        },
        //判断两条线段是否相交
        detectSegmentIntersec: function (P1, P2, Q1, Q2) {
            var line1, line2;
            line1 = P1.x * (Q1.y - P2.y) + P2.x * (P1.y - Q1.y) + Q1.x * (P2.y - P1.y);
            line2 = P1.x * (Q2.y - P2.y) + P2.x * (P1.y - Q2.y) + Q2.x * (P2.y - P1.y);
            if (((line1 ^ line2) >= 0) && !(line1 == 0 && line2 == 0)) {
                return false;
            }
            line1 = Q1.x * (P1.y - Q2.y) + Q2.x * (Q1.y - P1.y) + P1.x * (Q2.y - Q1.y);
            line2 = Q1.x * (P2.y - Q2.y) + Q2.x * (Q1.y - P2.y) + P2.x * (Q2.y - Q1.y);
            if (((line1 ^ line2) >= 0) && !(line1 == 0 && line2 == 0)) {
                return false;
            }
            return true;
        },
        //判断两线段是否排斥
        isRectCross: function (P1, P2, Q1, Q2) {
            return Math.min(P1.x, P2.x) <= Math.max(Q1.x, Q2.x) &&
                Math.min(Q1.x, Q2.x) <= Math.max(P1.x, P2.x) &&
                Math.min(P1.z, P2.z) <= Math.max(Q1.z, Q2.z) &&
                Math.min(Q1.z, Q2.z) <= Math.max(P1.z, P2.z);
        },
        //get point array
        getPointArray: function (linePointList) {
            var result = [];
            for (var i = 0; i < linePointList.length; i++) {
                result.push(linePointList[i].point);
            }
            return result;
        },
        //calculate distance
        calculateDistance: function (linePointArray, type) {
            var result = [0];
            if (type === 'distance') {
                for (var i = 1; i < linePointArray.length; i++) {
                    result.push(this.returnFloat(result[i - 1] + this.twoPointsDistance(linePointArray[i - 1].point, linePointArray[i].point)));
                }
            } else if (type === 'height') {
                result.push(this.returnFloat(Math.abs(linePointArray[1].point.y - linePointArray[0].point.y)));
            }
            return result;
        },
    }
});