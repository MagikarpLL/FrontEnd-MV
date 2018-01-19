//utils
//3D点坐标转2D
function P3dToP2dCoord(p3d) {
    var result = p3d.project(panorama.camera);
    result.x = (result.x + 1) / 2 * window.innerWidth;
    result.y = -(result.y - 1) / 2 * window.innerHeight;
    return result;
}

//将时间戳转化为 YYYY/MM/DD MM:SS形式
function changeTimestampToFull(timestamp) {
    var mDate = new Date(timestamp);
    return mDate.toLocaleDateString() + " <br/> " + mDate.toTimeString().substring(0, 5);
}

//按照时间顺序排序
function sortData(obj1, obj2) {

    var val1 = obj1.imageUpdateTime;
    var val2 = obj2.imageUpdateTime;
    if (val1 < val2) {
        return 1;
    } else if (val1 > val2) {
        return -1;
    } else {
        return 0;
    }


}

//将经纬度转换为XY坐标
function lnglatToXY(center, point) {

    var dlng = point.imageLng - center.imageLng;
    var dz = (dlng * center.meterForLng); //z -> east

    var dlat = point.imageLat - center.imageLat;
    var dx = (dlat * center.meterForLat); //x -> north

    point.planeX = dx;
    point.planeZ = dz;
}

//每精度多少米，每纬度多少米
function meterForOneLng(lat) {
    return 6378137 * Math.cos(radians(lat)) * 2 * Math.PI / 360;     // 1经度对应多少米
    // var meterForLat = 6378137 * 2 * Math.PI / 360;      //  1纬度对应多少米
}

//经纬度转换为弧度
function radians(angle) {
    return angle * Math.PI / 180;
}

//计算字符串一共占多少格，汉字两格，字母或者数字一格
function len(s) { //获取输入文本长度，字符占一位，汉字两位
    var l = 0;
    var a = s.split("");
    for (var i = 0; i < a.length; i++) {
        if (a[i].charCodeAt(0) < 299) {
            l++;
        } else {
            l += 2;
        }
    }
    return l;
}

//计算空中点在地面点的竖直线上的投影点
function calcAirPoint(groundPoint, mousePoint) {
    var dx1 = groundPoint.x;
    var dz1 = groundPoint.z;
    var groundLength1 = Math.sqrt(dx1 * dx1 + dz1 * dz1);
    var px = -dz1;
    var pz = dx1;
    panorama.raycaster.setFromCamera(mousePoint, panorama.camera);
    var dir = panorama.raycaster.ray.direction;
    var projected = dir.projectOnPlane(new THREE.Vector3(px, 0, pz));

    if (groundPoint.dot(projected) > 0) { // length>0 and save direction
        projected.normalize();
        var groundLength2 = Math.sqrt(1 - projected.y * projected.y);
        var length = groundLength1 / groundLength2;
        return projected.multiplyScalar(length);
    } else {
        return null;
    }
}

//计算地面点数组组成的多边形（起始点不重复）的面积
function calcGroundArea(groundPointArray) {
    var total = 0;
    for (var i = 0; i < groundPointArray.length; i++) {
        var p1 = groundPointArray[i];
        var p2 = groundPointArray[(i + 1) % groundPointArray.length];
        total += p1.x * p2.y - p2.x * p1.y;
    }
    return Math.abs(total) / 2; //单位平方米
}

//保留三位小数
function returnFloat(value) {
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
}

//两点间距离
function twoPointsDistance(p1, p2) {
    return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.z - p2.z, 2));
}

//计算该数组中点的距离之和
function calculateDistance(distanceArray) {
    var result = 0;
    for (var i = 1; i < distanceArray.length; i++) {
        console.log('calculate');
        result = result + twoPointsDistance(distanceArray[i - 1], distanceArray[i]);
    }
    return result;
}

//判断该平面点的数组中是否有线相交
function detectArrayPointsIntersect(pointArray) {

    //pointArray.length >= 4

    for (var j = 2; j < pointArray.length - 1; j++) {
        if(detectSegmentIntersec(pointArray[0], pointArray[pointArray.length - 1], pointArray[j - 1], pointArray[j])){
            return true;
        }
    }
    for (var i = 1; i < pointArray.length - 2; i++) {
        if(detectSegmentIntersec(pointArray[pointArray.length - 2], pointArray[pointArray.length - 1], pointArray[i - 1], pointArray[i])){
            return true;
        }
    }
    return false;

}

//判断两条线段是否相交
function detectSegmentIntersec(P1, P2, Q1, Q2) {

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
}

//判断两线段是否排斥
function isRectCross(P1, P2, Q1, Q2) {
    return Math.min(P1.x, P2.x) <= Math.max(Q1.x, Q2.x) &&
        Math.min(Q1.x, Q2.x) <= Math.max(P1.x, P2.x) &&
        Math.min(P1.z, P2.z) <= Math.max(Q1.z, Q2.z) &&
        Math.min(Q1.z, Q2.z) <= Math.max(P1.z, P2.z);
}

//判断两线段是否跨立
function isLineSegmentCross(P1, P2, Q1, Q2) {


}