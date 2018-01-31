define(['THREE', 'Layer', 'utils'], function (THREE, Layer, utils) {
    function LayerExternalData() {
        this.loadmanager = new THREE.LoadingManager();
        this.imageLoader = new THREE.ImageLoader(this.loadmanager);
    }
    LayerExternalData.prototype = new Layer("LayerExternalData");

    var arraySync = function (arrayNew, arrayOld, funcAdd, funcRemove) {
        var add = arrayNew.filter(function (i) {
            return arrayOld.indexOf(i) < 0;
        });
        var remove = arrayOld.filter(function (i) {
            return arrayNew.indexOf(i) < 0;
        });
        if (funcRemove) remove.forEach(funcRemove);
        if (funcAdd) add.forEach(funcAdd);
    };

    //obj <- funcAdd(item, group, stage, scene)
    //funcRemove(obj, group)
    //funcUpdate(obj, deltatime)
    //funcLoadScene(item, obj, stage, scene)
    function DataType(type, container, group, funcAdd, funcRemove, funcLoadScene, funcUpdate) {
        this.name = type;
        this.array = [];
        var g = this.g = new THREE.Group();
        group.add(this.g);
        var map = this.map = {};
        this.load = function (stage, scene) {
            this.array.forEach(function (item) {
                funcLoadScene(item, map[item.id], stage, scene);
            });
        };
        this.update = function (deltatime) {
            var data = container.getExternalData();
            if (data && data[type] && data[type].dirty && data[type].list) {
                arraySync(data[type].list, this.array, function (item) {
                    map[item.id] = funcAdd(item, g, container.stage, container.scene);
                    // console.log('add ' + item.id);
                }, function (item) {
                    var obj = map[item.id];
                    funcRemove(obj, g);
                    delete map[item.id];
                    // console.log('remove ' + item.id);
                });
                this.array = data[type].list.slice();
            }

            this.array.forEach(function (item) {
                funcUpdate(map[item.id], deltatime);
            });
        };
        return this;
    }

    LayerExternalData.prototype.dataTypes = [];
    LayerExternalData.prototype.dataTypeMap = {};
    LayerExternalData.prototype.addDataType = function (dataType) {
        this.dataTypes.push(dataType);
        this.dataTypeMap[dataType.name] = dataType;
    };
    LayerExternalData.prototype.getDataType = function (name) {
        return this.dataTypeMap[name];
    };

    LayerExternalData.prototype.add = function (container) {
        Layer.prototype.add.call(this, container);
        var imageLoader = this.imageLoader;

        LayerExternalData.prototype.addDataType.call(this, new DataType("outdoor_sprite", this.container, this.group, function funcAdd(item, group, stage, scene) {
            var diff = utils.lnglatToXYZ(scene, {imageLng: item.lng, imageLat: item.lat, imageAlt: item.alt});
            var texture = new THREE.Texture();
            var material = new THREE.SpriteMaterial({map: texture});
            imageLoader.load(item.image, function (image) {
                texture.image = image;
                texture.needsUpdate = true;
                material.needsUpdate = true;
            });
            var sprite = new THREE.Sprite(material);
            sprite.userData = item;
            sprite.position.set(diff.x, diff.y, diff.z);
            sprite.scale.set(item.scale, item.scale, 0);
            group.add(sprite);
            sprite.visible = sprite.userData.visible;
            return sprite;
        }, function funcRemove(obj, group) {
            group.remove(obj);
        }, function funcLoadScene(item, obj, stage, scene) {
            var diff = utils.lnglatToXYZ(scene, {imageLng: item.lng, imageLat: item.lat, imageAlt: item.alt});
            obj.position.set(diff.x, diff.y, diff.z);
        }, function funcUpdate(obj, deltatime) {
            // min: 1x scale <> 500 meters
            // linear
            // max: 2.5x scale <> 100 meters
            var length = obj.position.length();
            length = Math.min(500, Math.max(100, length));
            length = (length - 100) / (500 - 100);
            var externalFactor = 0.25 - length * 0.15;
            var scale = container.camera.scaleFactor(obj) * externalFactor * obj.userData.scale;
            obj.scale.set(scale, scale, 0);
            obj.visible = obj.userData.visible;
        }));

        LayerExternalData.prototype.addDataType.call(this, new DataType("outdoor_clickable", this.container, this.group, function funcAdd(item, group, stage, scene) {
            var diff;
            if (item.type === 'shape') {
                item.alt = item.base;
                var ref = {imageLng: item.lng, imageLat: item.lat, imageAlt: item.alt};
                diff = utils.lnglatToXYZ(scene, ref);

                var shape = new THREE.Shape();
                var c = 0;
                for (var index = 0; index < item.op.length; index++) {
                    var b = item.op[index];
                    if (b === '\0' || b == 0) {
                        diff = utils.lnglatToXYZ(ref, {imageLng: item.shape[c], imageLat: item.shape[c + 1], imageAlt: item.alt});
                        shape.moveTo(diff.x, diff.z);
                        c += 2;
                    } else if (b === '\1' || b == 1) {
                        diff = utils.lnglatToXYZ(ref, {imageLng: item.shape[c], imageLat: item.shape[c + 1], imageAlt: item.alt});
                        shape.lineTo(diff.x, diff.z);
                        c += 2;
                    } else if (b === '\2' || b == 2) {
                        var diff1 = utils.lnglatToXYZ(ref, {imageLng: item.shape[c], imageLat: item.shape[c + 1], imageAlt: item.alt});
                        var diff2 = utils.lnglatToXYZ(ref, {imageLng: item.shape[c + 2], imageLat: item.shape[c + 3], imageAlt: item.alt});
                        var diff3 = utils.lnglatToXYZ(ref, {imageLng: item.shape[c + 4], imageLat: item.shape[c + 5], imageAlt: item.alt});
                        shape.bezierCurveTo(diff1.x, diff1.z, diff2.x, diff2.z, diff3.x, diff3.z);
                        c += 6;
                    } else if (b === '\4' || b == 4) {
                    }
                }
                var geometry = new THREE.ShapeBufferGeometry(shape);
                var material = new THREE.MeshBasicMaterial({depthWrite: false, depthTest: false, transparent: true, opacity: 0.1, color: 0xB0B0B0, side: THREE.DoubleSide});
                var mesh = new THREE.Mesh(geometry, material);
                mesh.position.set(diff.x, diff.y, diff.z);
                item.position3d = new THREE.Vector3(diff.x, diff.y, diff.z);
                mesh.rotateX(Math.PI / 2);
                group.add(mesh);
                mesh.userData = item;
                return mesh;

            } else if (item.type === 'sphere') {
                item.alt = item.base + item.height;
                //{type, id, base(y), lng, lat, radius, height(center)}
                diff = utils.lnglatToXYZ(scene, {imageLng: item.lng, imageLat: item.lat, imageAlt: item.alt});
                var geometry = new THREE.SphereBufferGeometry(item.radius, 32, 16);
                var material = new THREE.MeshBasicMaterial({depthWrite: false, depthTest: false, transparent: true, opacity: 0.1, color: 0xB0B0B0, side: THREE.DoubleSide});
                var sphere = new THREE.Mesh(geometry, material);
                sphere.position.set(diff.x, diff.y, diff.z);
                item.position3d = new THREE.Vector3(diff.x, diff.y, diff.z);
                group.add(sphere);
                sphere.userData = item;
                return sphere;

            } else if (item.type === 'cylinder') {
                item.alt = item.base + item.height / 4;
                //{type, id, base(y), lng, lat, radius, height(top)}
                diff = utils.lnglatToXYZ(scene, {imageLng: item.lng, imageLat: item.lat, imageAlt: item.alt});
                var geometry = new THREE.CylinderBufferGeometry(item.radius, item.radius, item.height / 2, 32);
                var material = new THREE.MeshBasicMaterial({depthWrite: false, depthTest: false, transparent: true, opacity: 0.1, color: 0xB0B0B0, side: THREE.DoubleSide});
                var cylinder = new THREE.Mesh(geometry, material);
                cylinder.position.set(diff.x, diff.y, diff.z);
                item.position3d = new THREE.Vector3(diff.x, diff.y, diff.z);
                group.add(cylinder);
                cylinder.userData = item;
                return cylinder;

            }

        }, function funcRemove(obj, group) {
            group.remove(obj);
        }, function funcLoadScene(item, obj, stage, scene) {
            var diff = utils.lnglatToXYZ(scene, {imageLng: item.lng, imageLat: item.lat, imageAlt: item.alt});
            obj.position.set(diff.x, diff.y, diff.z);
            item.position3d = new THREE.Vector3(diff.x, diff.y, diff.z);
        }, function funcUpdate(obj, deltatime) {
            // min: 1x scale <> 500 meters
            // linear
            // max: 2.5x scale <> 100 meters
            // var length = obj.position.length();
            // length = Math.min(500, Math.max(100, length));
            // length = (length - 100) / (500 - 100);
            // var externalFactor = 0.25 - length * 0.15;
            // var scale = container.camera.scaleFactor(obj) * externalFactor * obj.userData.scale;
            // obj.scale.set(scale, scale, 0);
            obj.visible = obj.userData.visible;
        }));
    };

    LayerExternalData.prototype.load = function (stage, scene) {
        var layer = this;
        layer.dataTypes.forEach(function (datatype) {
            datatype.load(stage, scene);
        });
    };

    LayerExternalData.prototype.update = function (deltatime) {
        var layer = this;
        layer.dataTypes.forEach(function (datatype) {
            datatype.update(deltatime);
        });
    };

    return LayerExternalData;
});