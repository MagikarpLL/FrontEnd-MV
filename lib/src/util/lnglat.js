define(['THREE'], function (THREE) {

    return {
        lnglatToXYZ: function (reference, point) {
            var dlng = point.imageLng - reference.imageLng;
            var dz = (dlng * 6378137 * Math.cos(reference.imageLat * Math.PI / 180) * 2 * Math.PI / 360); //z -> east

            var dlat = point.imageLat - reference.imageLat;
            var dx = (dlat * 6378137 * 2 * Math.PI / 360); //x -> north

            var dy = point.imageAlt - reference.imageAlt;

            return new THREE.Vector3(dx, dy, dz);
        }
    }
});