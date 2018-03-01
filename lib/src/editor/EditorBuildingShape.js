define('EditorBuildingShape', ['THREE', 'Editor', 'utils', 'threeUtil', 'BuildingShape', 'BuildingMesh', 'Meshline'], function (THREE, Editor, utils, threeUtil, BuildingShape, BuildingMesh, Meshline) {

    function EditorBuildingShape() {
        EditorBuildingShape.prototype.reset.call(this, 0);
    }
    EditorBuildingShape.prototype = new Editor("EditorBuildingShape");

    var modeFirstGround = {};
    var modeFirstAir = {};
    var modeEditShape = {};

    EditorBuildingShape.prototype.reset = function () {
        this.mode = modeFirstGround;
        this.groundPoint = undefined;
        this.airPoint = undefined;

        this.packs = [];
        this.shapes = [];
    };

    EditorBuildingShape.prototype.enter = function (stage, scene) {
        Editor.prototype.enter.call(this, stage, scene);

        if (!stage || !scene) return;

        this.stage = stage;
        this.scene = scene;
        this.group.add(this.lineGroup = new THREE.Group());
        this.group.add(this.shapeGroup = new THREE.Group());

        this.reloadAllStageData();
    };

    EditorBuildingShape.prototype.onMouseDown = function (event) {
        if (this.mode === modeFirstGround) {

        } else if (this.mode === modeFirstAir) {

        } else if (this.mode === modeEditShape) {
            if (this.selectedShape) {
                if (this.selectedShape.mouseDown(event.offsetX, event.offsetY)) {
                    event.editorConsumed = true;
                }
            }
        }
    };
    EditorBuildingShape.prototype.onMouseMove = function (event) {
        if (this.mode === modeFirstGround) {

        } else if (this.mode === modeFirstAir) {
            var currAirPoint = EditorBuildingShape.prototype.getAirPoint.call(this, event.offsetX, event.offsetY);
            threeUtil.removeAllChildren(this.lineGroup);
            if (currAirPoint) {
                this.lineGroup.add(new Meshline([this.groundPoint, currAirPoint], 1, 0xff0000));
            }
        } else if (this.mode === modeEditShape) {
            if (this.selectedShape) {
                if (this.selectedShape.mouseMove(event.offsetX, event.offsetY)) {
                    event.editorConsumed = true;
                }
            }
        }
    };
    EditorBuildingShape.prototype.onMouseUp = function (event) {
        if (this.mode === modeFirstGround) {

        } else if (this.mode === modeFirstAir) {

        } else if (this.mode === modeEditShape) {
            if (this.selectedShape) {
                if (this.selectedShape.mouseUp(event.offsetX, event.offsetY)) {
                    event.editorConsumed = true;
                }
            }
        }
    };
    EditorBuildingShape.prototype.getAirPoint = function (mouseX, mouseY) {
        var ray = this.container.camera.rayMouse(mouseX, mouseY);
        var dir = ray.direction;
        var px = -this.groundPoint.z;
        var pz = this.groundPoint.x;
        var groundLength1 = Math.sqrt(px * px + pz * pz);
        var projected = dir.projectOnPlane(new THREE.Vector3(px, 0, pz));

        if (this.groundPoint.dot(projected) > 0) { // length>0 and same direction
            projected.normalize();
            var groundLength2 = Math.sqrt(1 - projected.y * projected.y);
            var length = groundLength1 / groundLength2;
            return projected.multiplyScalar(length);
        } else {
            return null;
        }
    };

    EditorBuildingShape.prototype.onMouseClick = function (event) {
        var scene = this.container.scene;

        if (this.mode === modeFirstGround) {
            var selected = this.container.stageData.selected;
            var baseHeight = selected ? selected.high : 0;
            this.groundPoint = this.container.camera.groundpointMouse(scene.imageAlt - baseHeight, event.offsetX, event.offsetY);
            this.mode = modeFirstAir;
        } else if (this.mode === modeFirstAir) {
            this.airPoint = EditorBuildingShape.prototype.getAirPoint.call(this, event.offsetX, event.offsetY);
            if (this.airPoint) {
                threeUtil.removeAllChildren(this.lineGroup);

                var low = this.groundPoint.y + scene.imageAlt;
                var high = this.airPoint.y + scene.imageAlt;

                var meterForLat = 6378137 * 2 * Math.PI / 360;
                var meterForLng = utils.meterForOneLng(scene.imageLat);
                var lng = scene.imageLng + this.airPoint.z / meterForLng;
                var lat = scene.imageLat + this.airPoint.x / meterForLat;

                this.container.stageData.addStageData(low, high, lng, lat);

                this.mode = modeEditShape;
                this.container.modeControl.setMode('modelingShape');
            }
        } else if (this.mode === modeEditShape) {

        }
    };

    EditorBuildingShape.prototype.update = function (deltatime) {
        var camera = this.container.camera;
        this.shapes.forEach(function (shape) {
            shape.updatePointSize(camera);
        });
    };

    EditorBuildingShape.prototype.reloadAllStageData = function () {
        this.groundPoint = undefined;
        this.airPoint = undefined;
        threeUtil.removeAllChildren(this.lineGroup);
        threeUtil.removeAllChildren(this.shapeGroup);

        this.shapes = [];
        var self = this;
        this.container.stageData.getAll().forEach(function (pack) {
            self.addStageData(pack);
        });
        this.selectStageData(this.container.stageData.selected);
    };

    EditorBuildingShape.prototype.addStageData = function (pack) {
        var scene = this.scene;
        var list = [];
        pack.shape.points.forEach(function (point) {
            list.push(utils.lnglatToXYZ(scene, {imageLng: point[0], imageLat: point[1], imageAlt: pack.high + scene.imageAlt}));
        });
        var buildingShape;
        var self = this;
        buildingShape = new BuildingShape(this.container, list, this.shapeGroup, pack.low, pack.high, function afterChange() {
            self.updateStageDataForOthers(pack, buildingShape);
        });
        this.packs.push(pack);
        this.shapes.push(buildingShape);
    };

    EditorBuildingShape.prototype.selectStageData = function (pack) {
        if (!pack) {
            this.selectedShape = null;
        } else {
            var index = this.packs.indexOf(pack);
            if (index >= 0) {
                this.selectedShape = this.shapes[index];
            }
        }

        var selected = this.selectedShape;
        this.shapes.forEach(function (shape) {
            if (shape === selected) {
                shape.setColor1();
            } else {
                shape.setColor2();
            }
        });
    };

    EditorBuildingShape.prototype.reloadStageData = function (pack) {
        this.reloadAllStageData(); //TODO only reload that BuildingShape.
    };

    EditorBuildingShape.prototype.updateStageDataForOthers = function (pack, buildingShape) {
        var lnglatList = buildingShape.pointsToLngLat();
        pack.shape.points = lnglatList;
        pack.mesh = threeUtil.pointListToMeshData(lnglatList, pack.low, pack.high);

        this.container.stageData.reloadStageData(pack, this);
    };

    return EditorBuildingShape;
});