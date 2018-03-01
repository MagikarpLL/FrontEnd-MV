define(['THREE', 'Camera', 'StageData'], function (THREE, Camera, StageData) {
    function Container(dom) {
        this.renderer = new THREE.WebGLRenderer({preserveDrawingBuffer: true, alpha: true});
        this.group = new THREE.Scene();
        this.group.background = new THREE.Color(0x000000);
        this.camera = new Camera(dom);
        this.stageData = new StageData(this);

        this.width = dom.clientWidth;
        this.height = dom.clientHeight;

        this.groupOrtho = new THREE.Scene();
        this.cameraOrtho = new THREE.OrthographicCamera(-this.width / 2, this.width / 2, this.height / 2, -this.height / 2, 1, 10);
        this.cameraOrtho.position.setZ(10);

        this.renderer.setClearColor(0x000000, 0);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(this.width, this.height);
        this.renderer.autoClear = false;

        this.dom = dom;
        dom.appendChild(this.renderer.domElement);

        var container = this;
        var timer = null;
        window.addEventListener('resize', function (event) {
            container.onResize(event);
        }, false);
        dom.addEventListener('mousedown', function (event) {
            container.onMouseDown(event);
        }, false);
        dom.addEventListener('mousemove', function (event) {
            container.onMouseMove(event);
        }, false);
        dom.addEventListener('mouseup', function (event) {
            container.onMouseUp(event);
        }, false);
        dom.addEventListener('wheel', function (ev) {
            container.onMouseWheel(ev);
        }, false);      //滚轮事件
        dom.addEventListener('click', function (ev) {
            clearTimeout(timer);
            timer = setTimeout(function () {
                container.onMouseClick(ev);
            }, 200)
        }, false);
        dom.addEventListener('dblclick', function (ev) {
            clearTimeout(timer);
            container.onMouseDbClick(ev);
        }, false);      //双击事件


        this.layers = [];
        this.editors = [];
        this.layerMap = {};
        this.editorMap = {};
        this.currentEditor = [];
        this.clock = new THREE.Clock(true);

        this.captureCallback = undefined;
        this.captureCanvas = function (callback) {
            this.captureCallback = callback;
        };

        this.addLayer = function (layer) {
            this.layers.push(layer);
            this.layerMap[layer.name] = layer;
            layer.add(this);
        };
        this.addEditor = function (editor) {
            this.editors.push(editor);
            this.editorMap[editor.name] = editor;
            editor.add(this);
        };

        this.getLayer = function (name) {
            return this.layerMap[name];
        };
        this.getLayers = function () {
            return this.layerMap;
        };
        this.getEditor = function (name) {
            return this.editorMap[name];
        };
        this.getEditors = function () {
            return this.editorMap;
        };
        this.getCurrentEditor = function (name) {
            var result = null;
            this.currentEditor.forEach(function (editor) {
                if (editor.name === name) {
                    result = editor;
                }
            });
            return result;
        };

        this.unloadScene = function () {
            if (this.scene) {
                this.currentEditor.forEach(function (editor) {
                    editor.exit();
                });
                this.layers.forEach(function (layer) {
                    layer.unload();
                });
                // console.log(this.scene);
                // database.updateSceneData(this.scene.id, JSON.stringify(this.scene.data), null);
            }
        };

        this.loadScene = function (stage, sceneId) {
            if (this.scene) this.unloadScene();

            this.stage = stage;
            var map = {};
            var first = -1;
            for (var i = 0; i < stage.scenes.length; i++) {
                if (stage.scenes[i].imageUrls) {
                    map["" + stage.scenes[i].id] = stage.scenes[i];
                    if (first < 0) first = "" + stage.scenes[i].id;
                }
            }
            if (!sceneId || !map[sceneId]) {
                sceneId = first;
            }
            var scene = map[sceneId];
            this.scene = scene;

            this.stageData.setStage(stage);

            if (this.scene) {
                this.layers.forEach(function (layer) {
                    layer.load(stage, scene);
                });
                this.currentEditor.forEach(function (editor) {
                    editor.enter(stage, scene);
                });

                this.getEditor("EditorCamera").updateLayers();
            }

            return sceneId;
        };

        this.enterEditor = function (/*editors*/) {
            var container = this;
            this.currentEditor.forEach(function (editor) {
                editor.exit();
            });
            this.currentEditor = [];
            if (arguments.length) {
                for (var i = 0; i < arguments.length; i++) {
                    var editor = arguments[i];
                    if (editor) {
                        if (typeof editor === 'string') editor = this.getEditor(editor);
                        this.currentEditor.push(editor);
                        editor.enter(container.stage, container.scene);
                    }
                }
            }
        };

        this.animate = function () {
            var captureCallback = this.captureCallback;

            var container = this;
            if (!dom.offsetParent || (this.isVisibleCallback && !this.isVisibleCallback())) {
                requestAnimationFrame(function () {
                    container.animate();
                });
                return;
            }

            this.testResize();
            if (this.scene) {
                var deltatime = this.clock.getDelta();

                if (this.stage && this.scene) {
                    this.camera.update();

                    this.currentEditor.forEach(function (editor) {
                        editor.update(deltatime);
                    });
                    this.layers.forEach(function (layer) {
                        layer.update(deltatime);
                    });
                }

                this.camera.update();

                this.renderer.clear();
                this.renderer.render(this.group, this.camera.camera_threejs);
                this.renderer.render(this.groupOrtho, this.cameraOrtho);
            }

            if (captureCallback) {
                var strMime = "image/jpeg";
                captureCallback(this.renderer.domElement.toDataURL(strMime));
                this.captureCallback = undefined;
            }

            requestAnimationFrame(function () {
                container.animate();
            });
        };

        this.testResize = function () {
            var width = this.dom.clientWidth;
            var height = this.dom.clientHeight;
            if (width !== this.width || height !== this.height) {
                this.onResize();
            }
        };
        this.onResize = function () {
            this.width = this.dom.clientWidth;
            this.height = this.dom.clientHeight;
            this.camera.resize(this.width, this.height);
            this.cameraOrtho.left = -this.width / 2;
            this.cameraOrtho.right = this.width / 2;
            this.cameraOrtho.top = this.height / 2;
            this.cameraOrtho.bottom = -this.height / 2;
            this.cameraOrtho.updateProjectionMatrix();
            this.renderer.setSize(this.width, this.height);
            if (this.scene) this.layers.forEach(function (layer) {
                if (layer.syncPosition) {
                    layer.syncPosition();
                }
            })
        };
        this.onMouseDown = function (event) {
            if (this.scene) this.currentEditor.forEach(function (editor) {
                if (!event.editorConsumed) editor.onMouseDown(event);
            })
        };
        this.onMouseMove = function (event) {
            if (this.scene) this.currentEditor.forEach(function (editor) {
                if (!event.editorConsumed) editor.onMouseMove(event);
            })
        };
        this.onMouseUp = function (event) {
            if (this.scene) this.currentEditor.forEach(function (editor) {
                if (!event.editorConsumed) editor.onMouseUp(event);
            })
        };
        this.onMouseWheel = function (event) {
            if (this.scene) this.currentEditor.forEach(function (editor) {
                if (!event.editorConsumed) editor.onMouseWheel(event);
            })
        };
        this.onMouseClick = function (event) {
            if (this.scene) this.currentEditor.forEach(function (editor) {
                if (!event.editorConsumed) editor.onMouseClick(event);
            })
        };
        this.onMouseDbClick = function (event) {
            if (this.scene) this.currentEditor.forEach(function (editor) {
                if (!event.editorConsumed) editor.onMouseDbClick(event);
            })
        }
    }

    return Container;
});