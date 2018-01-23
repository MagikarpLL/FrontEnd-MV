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
    }
});