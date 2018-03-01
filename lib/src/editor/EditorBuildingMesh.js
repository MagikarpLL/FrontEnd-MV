define('EditorBuildingMesh', ['THREE', 'Editor', 'utils', 'threeUtil', 'BuildingShape', 'BuildingMesh', 'jquery'], function (THREE, Editor, utils, threeUtil, BuildingShape, BuildingMesh, $) {

    function EditorBuildingMesh() {
        var self = this;
        $('#modelingMapImg').on('click', function () {
            if (self.selectedMesh) {
                self.selectedMesh.mapTexture(function() {
                    self.container.stageData.reloadStageData(self.container.stageData.selected, self);
                });
            }
        });

        this.packs = [];
        this.meshes = [];
    }
    EditorBuildingMesh.prototype = new Editor("EditorBuildingMesh");

    EditorBuildingMesh.prototype.enter = function (stage, scene) {
        Editor.prototype.enter.call(this, stage, scene);
        this.stage = stage;
        this.scene = scene;

        this.reloadAllStageData();
    };

    EditorBuildingMesh.prototype.update = function (deltatime) {
        var self = this;
        this.meshes.forEach(function (mesh) {
            mesh.update(deltatime, self.scene, self.container.camera);
        });
    };

    EditorBuildingMesh.prototype.reloadAllStageData = function () {
        this.packs = [];
        this.meshes = [];
        threeUtil.removeAllChildren(this.group);

        var self = this;
        this.container.stageData.getAll().forEach(function (pack) {
            self.addStageData(pack);
        });
        this.selectStageData(this.container.stageData.selected);
    };

    EditorBuildingMesh.prototype.addStageData = function (pack) {
        var mesh = new BuildingMesh(pack.mesh, this.container, this.stage, this.scene, true);
        this.group.add(mesh.group);
        this.packs.push(pack);
        this.meshes.push(mesh);
    };

    EditorBuildingMesh.prototype.selectStageData = function (pack) {
        if (!pack) {
            this.selectedMesh = null;
        } else {
            var index = this.packs.indexOf(pack);
            if (index >= 0) {
                this.selectedMesh = this.meshes[index];
            }
        }

        var selected = this.selectedMesh;
        this.meshes.forEach(function (mesh) {
            if (mesh === selected) {
                mesh.setColor1();
            } else {
                mesh.setColor2();
            }
        });
    };

    EditorBuildingMesh.prototype.reloadStageData = function (pack) {
        this.reloadAllStageData(); //TODO
    };

    EditorBuildingMesh.prototype.onMouseDown = function (event) {
        this.down = true;
        this.move = false;
        this.x = event.offsetX;
        this.y = event.offsetY;
        this.draggingPoint = false;

        if (this.selectedMesh) {
            this.draggingPoint = this.selectedMesh.dragStart(this.container.camera, this.x, this.y);
            if (this.draggingPoint) event.editorConsumed = true;
        }
    };
    EditorBuildingMesh.prototype.onMouseMove = function (event) {
        if (this.down) {
            if (this.x !== event.offsetX && this.y !== event.offsetY) {
                this.move = true;
            }
            if (this.move) {
                if (this.draggingPoint) {
                    this.selectedMesh.dragMove(this.container.camera, event.offsetX, event.offsetY);
                }
            }
        }
    };
    EditorBuildingMesh.prototype.onMouseUp = function (event) {
        if (!this.move) {
            if (this.draggingPoint) {
                this.selectedMesh.dragEnd(this.container.camera, event.offsetX, event.offsetY);
                this.draggingPoint = undefined;
            } else if (this.selectedMesh) {
                var selected = this.container.camera.raySelect(event.offsetX, event.offsetY, this.group);
                if (selected.length) {
                    var selectedFaceGroup = undefined;
                    for (var i = 0; i < selected.length; i++) {
                        var obj = selected[i].object;
                        if (obj.userData.faces) {
                            selectedFaceGroup = obj.userData;
                            break;
                        }
                    }
                    if (selectedFaceGroup) {
                        this.selectedMesh.selectToggle(selectedFaceGroup);
                    }
                }
            }
        }
        this.down = false;
        this.move = false;
    };

    return EditorBuildingMesh;
});