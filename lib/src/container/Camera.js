define(['THREE'], function (THREE) {
    function Camera(dom) {
        this.camera_threejs = new THREE.PerspectiveCamera(75, dom.clientWidth / dom.clientHeight, 1, 10000);
        this.raycaster = new THREE.Raycaster();
        this.raycaster.linePrecision = 3;

        this.lng = 0;
        this.lat = 0;
        this.fov = 75;

        this.LAT_MIN = -85;
        this.LAT_MAX_AIR = -10;
        this.LAT_MAX_GROUND = 85;
        this.latMin = this.LAT_MIN;
        this.latMax = this.LAT_MAX_AIR;

        this.FOV_MIN = 10;
        this.FOV_MAX = 75;
        this.fovMin = this.FOV_MIN;
        this.fovMax = this.FOV_MAX;

        this.resize = function (width, height) {
            this.camera_threejs.aspect = width / height;
            this.camera_threejs.updateProjectionMatrix();
        };

        this.project3dToScreen = function (p3d) {
            var p2d = p3d.clone().project(this.camera_threejs);
            if (0 < p2d.z && p2d.z < 1) {
                var x = (1 + p2d.x) / 2 * dom.clientWidth;
                var y = (1 - p2d.y) / 2 * dom.clientHeight;
                return new THREE.Vector2(x, y);
            } else {
                return null;
            }
        };
        this.raySelect = function (mouseX, mouseY, group) {
            var x = (mouseX / dom.clientWidth) * 2 - 1;
            var y = -(mouseY / dom.clientHeight) * 2 + 1;
            this.raycaster.setFromCamera(new THREE.Vector2(x, y), this.camera_threejs);
            return this.raycaster.intersectObject(group, true);
        };
        this.rayMouse = function (mouseX, mouseY) {
            var x = (mouseX / dom.clientWidth) * 2 - 1;
            var y = -(mouseY / dom.clientHeight) * 2 + 1;
            this.raycaster.setFromCamera(new THREE.Vector2(x, y), this.camera_threejs);
            return this.raycaster.ray;
        };
        this.rayCenter = function () {
            this.raycaster.setFromCamera(new THREE.Vector2(0, 0), this.camera_threejs);
            return this.raycaster.ray;
        };
        this.groundpointMouse = function (height, mouseX, mouseY) {
            var ray = this.rayMouse(mouseX, mouseY);
            var distance = -height / ray.direction.y;
            return ray.at(distance);
        };
        this.airpointMouse = function (distance, mouseX, mouseY) {
            var ray = this.rayMouse(mouseX, mouseY);
            return ray.at(distance);
        };

        this.scaleFactor = function (mesh) {
            var ray = this.rayCenter();
            var a = ray.distanceToPoint(mesh.position); // distance to ray
            var c = this.camera_threejs.position.distanceTo(mesh.position); // distance
            var b = Math.sqrt(c * c - a * a); // distance in camera direction
            return this.tanFov * b;
        };

        this.update = function () {
            this.lng = this.lng % 360;
            this.lat = Math.max(this.latMin, Math.min(this.latMax, this.lat));
            this.fov = Math.max(this.fovMin, Math.min(this.fovMax, this.fov));

            this.tanFov = Math.tan(this.fov / 2 * Math.PI / 180);

            var phi = THREE.Math.degToRad(90 - this.lat);  //纬度转弧度，控制上下
            var theta = THREE.Math.degToRad(this.lng);
            var target = new THREE.Vector3(0, 0, 0);//经度转弧度，控制左右
            target.x = this.camera_threejs.position.x + 500 * Math.sin(phi) * Math.cos(theta);
            target.y = this.camera_threejs.position.y + 500 * Math.cos(phi);
            target.z = this.camera_threejs.position.z + 500 * Math.sin(phi) * Math.sin(theta);
            this.camera_threejs.lookAt(target);
            this.camera_threejs.fov = this.fov;
            this.camera_threejs.updateProjectionMatrix();
            return this.camera_threejs;
        };
    }

    return Camera;
});