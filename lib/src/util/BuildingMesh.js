define('BuildingMesh', ['THREE', 'threeUtil', 'utils'], function (THREE, threeUtil, utils) {

    var pointGeometry = new THREE.Geometry();
    pointGeometry.vertices.push(new THREE.Vector3(0, 0, 0));

    function BuildingMesh(mesh, container, stage, scene, enableEditing) {
        this.container = container;
        this.scene = scene;
        this.enableEditing = enableEditing;
        this.group = new THREE.Group();
        this.group.add(this.meshGroup = new THREE.Group());
        this.group.add(this.lineGroup = new THREE.Group());
        this.group.add(this.pointGroup = new THREE.Group());

        this.meshData = mesh || {};

        this.reloadMesh();
    }

    BuildingMesh.prototype.reloadMesh = function () {
        var self = this;
        var count = this.meshData.points.length / 2;

        this.points = [];
        self.meshData.scenePoints = self.meshData.scenePoints || {};
        self.meshData.scenePoints[self.scene.id] = self.meshData.scenePoints[self.scene.id] || {};
        var positionOverride = self.meshData.scenePoints[self.scene.id];

        for (var pi = 0; pi < count * 2; pi++) {
            var point = this.meshData.points[pi];
            var xyzPoint = utils.lnglatToXYZ(self.scene, {imageLng: point.lng, imageLat: point.lat, imageAlt: point.alt});
            if (positionOverride[pi]) {
                xyzPoint = positionOverride[pi]
            }
            self.points.push(xyzPoint);
            positionOverride[pi] = xyzPoint;
        }

        //TODO delete all textures
        threeUtil.removeAllChildren(this.meshGroup);
        threeUtil.removeAllChildren(this.lineGroup);
        threeUtil.removeAllChildren(this.pointGroup);

        //point
        this.pointList = [];


        this.points.forEach(function (xyz) {
            var pointMaterial = new THREE.PointsMaterial({color: 0x0000ff});
            var p = new THREE.Points(pointGeometry, pointMaterial);
            p.position.set(xyz.x, xyz.y, xyz.z);
            p.userData = xyz;
            self.pointGroup.add(p);
            self.pointList.push(p);
        });

        //line
        var lineGeometry = new THREE.Geometry();
        for (var li = 0; li < count; li++) {
            lineGeometry.vertices.push(this.points[li]);
            lineGeometry.vertices.push(this.points[(li + 1) % count]);
            lineGeometry.vertices.push(this.points[li + count]);
            lineGeometry.vertices.push(this.points[(li + 1) % count + count]);
            lineGeometry.vertices.push(this.points[li]);
            lineGeometry.vertices.push(this.points[li + count]);
        }
        var lineMaterial = this.lineMaterial = new THREE.LineBasicMaterial({color: 0x0000ff});
        var line = new THREE.LineSegments(lineGeometry, lineMaterial);
        this.lineGroup.add(line);

        //mesh
        this.meshList = [];
        this.meshSelected = {};
        this.faceGroups = this.meshData.faceGroups;

        if (this.enableEditing) {
            this.selected_textured = new THREE.Color(0xffff7f);
            this.unselected_textured = new THREE.Color(0x7fff7f);
            this.selected_untextured = new THREE.Color(0xffff00);
            this.unselected_untextured = new THREE.Color(0xff0000);
        } else {
            this.selected_textured = new THREE.Color(0xffffff);
            this.unselected_textured = new THREE.Color(0xffffff);
            this.selected_untextured = new THREE.Color(0xffff00);
            this.unselected_untextured = new THREE.Color(0xff0000);
        }

        this.meshData.faceGroups.forEach(function (faceGroup) {
            var mesh = self.faceGroup(faceGroup);
            self.meshList.push(mesh);
            self.meshGroup.add(mesh);
        });
    };

    BuildingMesh.prototype.setColor1 = function () {
        this.setColor(0x0000ff, 0x0000ff, 0xffff7f, 0x7fff7f, 0xffff00, 0xff0000);
    };
    BuildingMesh.prototype.setColor2 = function () {
        this.setColor(0x444444, 0x444444, 0x444444, 0x444444, 0x444444, 0x444444);
    };

    BuildingMesh.prototype.setColor = function (point, line, st, ut, su, uu) {
        this.pointList.forEach(function (p) {
            p.material.color.setHex(point);
        });
        this.lineMaterial.color.setHex(line);
        this.selected_textured.setHex(st);
        this.unselected_textured.setHex(ut);
        this.selected_untextured.setHex(su);
        this.unselected_untextured.setHex(uu);
    };

    BuildingMesh.prototype.faceGroup = function (faceGroup) {
        var pointExMap = faceGroup.points;
        var faces = faceGroup.faces;
        var textureContent = faceGroup.textureContent;
        var texture = faceGroup.texture;
        if (textureContent && !texture) {
            var image = new Image();
            image.src = textureContent;
            faceGroup.texture = texture = new THREE.Texture();
            texture.image = image;
            image.onload = function () {
                texture.anisotropy = 4;
                texture.needsUpdate = true;
            };
        }
        var self = this;
        var xyz = [];
        var uvw = [];

        faces.forEach(function (abc) {
            abc.forEach(function (i) {
                var pxyz = self.points[i];
                var ex = pointExMap[i];
                var puvw = ex ? ex : {u: 0, v: 0, w: 1};
                xyz.push(pxyz.x, pxyz.y, pxyz.z);
                uvw.push(puvw.u, puvw.v, 0, puvw.w);
            });
        });

        var geometry = new THREE.BufferGeometry();
        var positionBuffer = new Float32Array(xyz);
        var texcoordBuffer = new Float32Array(uvw);
        geometry.addAttribute('position', new THREE.BufferAttribute(positionBuffer, 3));
        geometry.addAttribute('tex4', new THREE.BufferAttribute(texcoordBuffer, 4));
        var material;
        if (this.enableEditing) {
            material = threeUtil.texture2dProjMaterial(texture ? this.unselected_textured : this.unselected_untextured, texture, texture ? 0.7 : 0.3);
        } else {
            material = threeUtil.texture2dProjMaterial(texture ? this.unselected_textured : this.unselected_untextured, texture, texture ? 1.0 : 0.3);
        }
        var mesh = new THREE.Mesh(geometry, material);
        mesh.userData = faceGroup;
        return mesh;
    };

    BuildingMesh.prototype.dragStart = function (camera, mouseX, mouseY) {
        this.draggingPoint = undefined;
        var selected = camera.raySelect(mouseX, mouseY, this.pointGroup);
        if (selected.length) {
            this.draggingPoint = selected[0].object.userData;
            return true;
        }
        return false; //click on nothing
    };
    BuildingMesh.prototype.dragMove = function (camera, mouseX, mouseY) {
        if (this.draggingPoint) {
            var length = this.draggingPoint.length();
            var point = camera.rayMouse(mouseX, mouseY).at(length);
            this.draggingPoint.set(point.x, point.y, point.z);
            this.reloadMesh();
        }
    };
    BuildingMesh.prototype.dragEnd = function (camera, mouseX, mouseY) {
        this.draggingPoint = undefined;
    };

    BuildingMesh.prototype.selectToggle = function (faceGroup) {
        var index = this.faceGroups.indexOf(faceGroup);
        if (index < 0) return;
        this.meshSelected[index] = !this.meshSelected[index];
        var textured = !!this.meshList[index].material.uniforms.map.value;
        var selected = this.meshSelected[index];
        var uniform = this.meshList[index].material.uniforms.diffuse;
        if (selected && textured) uniform.value = this.selected_textured;
        if (selected && !textured) uniform.value = this.selected_untextured;
        if (!selected && textured) uniform.value = this.unselected_textured;
        if (!selected && !textured) uniform.value = this.unselected_untextured;
    };

    BuildingMesh.prototype.update = function (deltatime, scene, camera) {
        var ratio = 0.015;
        this.pointList.forEach(function (point) {
            var position = new THREE.Vector3(point.position.x, point.position.y, point.position.z);
            point.material.size = camera.scaleFactor({position: position}) / camera.tanFov * ratio;
        });
    };

    BuildingMesh.prototype.mapTexture = function (callback) {
        var count = this.meshList.length;
        var self = this;
        self.container.getEditor('EditorBuildingMesh').group.visible = false;
        self.container.captureCanvas(function (img) {
            self.container.getEditor('EditorBuildingMesh').group.visible = true;
            var changed = false;
            for (var i = 0; i < count; i++) {
                if (self.meshSelected[i]) {
                    var faceGroup = self.meshData.faceGroups[i];

                    faceGroup.textureContent = img;
                    faceGroup.texture = undefined;

                    faceGroup.faces.forEach(function (abc) {
                        abc.forEach(function (index) {
                            faceGroup.points[index] = faceGroup.points[index] || {};
                            var uvw = faceGroup.points[index];
                            var screenPoint = self.container.camera.project3dToScreenXYZ(self.points[index]);

                            var d = self.container.camera.rayCenter().distanceToPoint(self.points[index]);
                            var c = self.container.camera.camera_threejs.position.distanceTo(self.points[index]);
                            var w = Math.sqrt(c * c - d * d);

                            var u = (1 + screenPoint.x) / 2;
                            var v = (1 - screenPoint.y) / 2;
                            uvw.u = u * w;
                            uvw.v = (1 - v) * w;
                            uvw.w = w;
                            changed = true;
                        });
                    });

                    callback();
                }
            }
            if (changed) {
                self.reloadMesh();
            }
        });
    };


    return BuildingMesh;
});