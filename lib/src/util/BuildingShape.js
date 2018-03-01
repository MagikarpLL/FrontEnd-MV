define('BuildingShape', ['THREE', 'utils', 'threeUtil'], function (THREE, utils, threeUtil) {

    var pointGeometry = new THREE.Geometry();
    pointGeometry.vertices.push(new THREE.Vector3(0, 0, 0));
    var pointObject = function (low, high, xyz, addGroundLine, pointColor, lineMaterial) {
        var pointMaterial = new THREE.PointsMaterial({color: pointColor});
        var point = new THREE.Points(pointGeometry, pointMaterial);
        point.position.set(xyz.x, xyz.y, xyz.z);

        if (addGroundLine) {
            var lineGeometry = new THREE.Geometry();
            lineGeometry.vertices.push(
                new THREE.Vector3(0, 0, 0),
                new THREE.Vector3(0, -(high - low), 0),
                new THREE.Vector3(-1, -(high - low), -1),
                new THREE.Vector3(1, -(high - low), 1),
                new THREE.Vector3(-1, -(high - low), 1),
                new THREE.Vector3(1, -(high - low), -1)
            );
            var line = new THREE.LineSegments(lineGeometry, lineMaterial);
            point.add(line);
        }

        return point;
    };

    function BuildingShape(container, points, group, low, high, afterChange) {
        this.container = container;
        this.scene = container.scene;
        this.points = points;
        this.low = low;
        this.high = high;
        this.afterChange = afterChange;

        this.currGroup = new THREE.Group();
        this.addGroup = new THREE.Group();
        this.shapeGroup = new THREE.Group();

        this.currGroup.position.y = -this.scene.imageAlt;
        this.addGroup.position.y = -this.scene.imageAlt;
        this.shapeGroup.position.y = -this.scene.imageAlt;

        group.add(this.currGroup);
        group.add(this.addGroup);
        group.add(this.shapeGroup);

        this.pointColor = 0x0000ff;
        this.lineColor = 0x0000ff;
        this.addColor = 0x7f7fff;
        this.shapeColor = 0x44A6F4;

        this.lineMaterial = new THREE.LineBasicMaterial({color: this.lineColor});
        this.shapeMaterial = new THREE.MeshBasicMaterial({
            color: this.shapeColor,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.4
        });

        this.refresh(true, true, true);
    }
    BuildingShape.prototype.refresh = function (curr, add, shape) {
        if (curr) {
            threeUtil.removeAllChildren(this.currGroup);
            for (var i = 0; i < this.points.length; i++) {
                var p = this.points[i];
                var currPoint = pointObject(this.low, this.high, p, true, this.pointColor, this.lineMaterial);
                currPoint.userData = {index: i, xyz: p, mesh: currPoint};
                this.currGroup.add(currPoint);
            }
        }
        if (add) {
            threeUtil.removeAllChildren(this.addGroup);
            for (var j = 0; j < this.points.length; j++) {
                var p1 = this.points[j];
                var p2 = this.points[(j + 1) % this.points.length];
                var x = (p1.x + p2.x) / 2;
                var y = (p1.y + p2.y) / 2;
                var z = (p1.z + p2.z) / 2;
                var p = new THREE.Vector3(x, y, z);
                var addPoint = pointObject(this.low, this.high, p, false, this.addColor, this.lineMaterial);
                addPoint.userData = {index: j, xyz: p, mesh: addPoint};
                this.addGroup.add(addPoint);
            }
        }
        if (shape) {
            threeUtil.removeAllChildren(this.shapeGroup);
            this.shape = threeUtil.pointListToShape(this.points, this.high, this.shapeMaterial);
            this.shapeGroup.add(this.shape);
        }
    };

    BuildingShape.prototype.setColor1 = function() {
        this.setColor(0x0000ff, 0x0000ff, 0x7f7fff, 0x44A6F4);
    };
    BuildingShape.prototype.setColor2 = function() {
        this.setColor(0x444444, 0x444444, 0x444444, 0x444444);
    };

    BuildingShape.prototype.setColor = function (pointColor, lineColor, addColor, shapeColor) {
        this.pointColor = pointColor;
        this.lineColor = lineColor;
        this.addColor = addColor;
        this.shapeColor = shapeColor;
        this.lineMaterial.color.setHex(lineColor);
        this.shapeMaterial.color.setHex(shapeColor);

        this.currGroup.children.forEach(function (point) {
            point.material.color.setHex(pointColor);
        });
        this.addGroup.children.forEach(function (point) {
            point.material.color.setHex(addColor);
        });
    };

    BuildingShape.prototype.move = function (point, mesh, mouseX, mouseY) {
        var v = this.container.camera.groundpointMouse(this.scene.imageAlt - point.y, mouseX, mouseY);
        point.x = v.x;
        point.z = v.z;
        mesh.position.x = point.x;
        mesh.position.z = point.z;
        this.refresh(false, true, true);
    };
    BuildingShape.prototype.add = function (pointPack, mouseX, mouseY) {
        var v = this.container.camera.groundpointMouse(this.scene.imageAlt - pointPack.xyz.y, mouseX, mouseY);
        pointPack.xyz.x = v.x;
        pointPack.xyz.z = v.z;
        pointPack.mesh.position.x = v.x;
        pointPack.mesh.position.z = v.z;
        this.points.splice(pointPack.index + 1, 0, pointPack.xyz);
        this.refresh(true, true, true);
    };
    BuildingShape.prototype.remove = function (index) {
        this.points.splice(index, 1);
        this.refresh(true, true, true);
    };

    BuildingShape.prototype.mouseDown = function (mouseX, mouseY) {
        var addSelected = this.container.camera.raySelect(mouseX, mouseY, this.addGroup);
        var currSelected = this.container.camera.raySelect(mouseX, mouseY, this.currGroup);

        var self = this;
        this.addSelected = null;
        this.currSelected = null;
        if (addSelected.length) {
            for (var ai = 0; ai < addSelected.length; ai++) {
                var addItem = addSelected[ai];
                if (addItem.object.userData.xyz) {
                    self.addSelected = addItem.object.userData;
                    break;
                }
            }
        }
        if (currSelected.length) {
            for (var ci = 0; ci < currSelected.length; ci++) {
                var currItem = currSelected[ci];
                if (currItem.object.userData.xyz) {
                    self.currSelected = currItem.object.userData;
                    break;
                }
            }
        }

        this.down = true;
        this.move = false;
        this.x = mouseX;
        this.y = mouseY;

        return this.addSelected || this.currSelected;
    };
    BuildingShape.prototype.mouseMove = function (mouseX, mouseY) {
        if (this.down) {
            if (this.x !== mouseX && this.y !== mouseY) {
                this.move = true;
            }
            if (this.currSelected) {
                var mesh = this.currSelected.mesh;
                var xyz = this.currSelected.xyz;
                BuildingShape.prototype.move.call(this, xyz, mesh, mouseX, mouseY);
                this.move = true;
                return true;
            }
            if (this.addSelected) {
                var index = this.addSelected.index;
                BuildingShape.prototype.add.call(this, this.addSelected, mouseX, mouseY);
                this.currSelected = this.currGroup.children[index + 1].userData;
                this.addSelected = undefined;
                this.move = true;
                return true;
            }
        }
        return false;
    };
    BuildingShape.prototype.mouseUp = function (mouseX, mouseY) {
        var removed = false;
        if (!this.move) {
            //click
            if (this.points.length > 3) {
                var currSelected = this.container.camera.raySelect(mouseX, mouseY, this.currGroup);
                var s = null;
                if (currSelected.length) {
                    for (var ci = 0; ci < currSelected.length; ci++) {
                        var currItem = currSelected[ci];
                        if (currItem.object.userData.xyz) {
                            s = currItem.object.userData;
                            break;
                        }
                    }
                }
                if (s) {
                    var index = s.index;
                    BuildingShape.prototype.remove.call(this, index);
                    removed = true;
                }
            }
        }
        this.down = false;

        if (this.addSelected || this.currSelected || removed) {
            if (this.afterChange) {
                this.afterChange();
            }
        }

        return false;
    };

    BuildingShape.prototype.updatePointSize = function (camera) {
        var ratio = 0.015;
        var scene = this.scene;
        this.currGroup.children.forEach(function (point) {
            var position = new THREE.Vector3(point.position.x, point.position.y - scene.imageAlt, point.position.z);
            point.material.size = camera.scaleFactor({position: position}) / camera.tanFov * ratio;
        });
        this.addGroup.children.forEach(function (point) {
            var position = new THREE.Vector3(point.position.x, point.position.y - scene.imageAlt, point.position.z);
            point.material.size = camera.scaleFactor({position: position}) / camera.tanFov * ratio;
        });
    };

    BuildingShape.prototype.pointsToLngLat = function () {
        var meterForLat = 6378137 * 2 * Math.PI / 360;
        var meterForLng = utils.meterForOneLng(this.scene.imageLat);
        var scene = this.scene;
        var r = [];
        this.points.forEach(function (point) {
            var lng = scene.imageLng + point.z / meterForLng;
            var lat = scene.imageLat + point.x / meterForLat;
            r.push([lng, lat]);
        });
        return r;
    };

    return BuildingShape;
});