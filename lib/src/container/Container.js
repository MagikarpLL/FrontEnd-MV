define(['THREE', 'Camera'], function (THREE, Camera) {
    function Container(dom) {
        this.renderer = new THREE.WebGLRenderer({alpha: true});
        this.group = new THREE.Scene();
        this.camera = new Camera(dom);
        this.group.background = new THREE.Color(0x000000);

        this.width = dom.clientWidth;
        this.height = dom.clientHeight;

        this.renderer.setClearColor(0x000000, 0);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);

        this.dom = dom;
        dom.appendChild(this.renderer.domElement);
        //TODO 放ui组件的div可以在这儿加，也可以直接传进来，如果考虑ui在高德之上的话就传进来吧

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
            },300)
        } , false);
        dom.addEventListener('dblclick', function (ev) {
            clearTimeout(timer);
            container.onMouseDbClick(ev);
        } , false);      //双击事件


        this.layers = [];
        this.editors = [];
        this.layerMap = {};
        this.editorMap = {};
        this.currentEditor = [];
        this.clock = new THREE.Clock(true);

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
            var result = false;
            this.currentEditor.forEach(function (editor) {
                if(editor.name === name){
                    console.log(editor.name);
                    result= true;
                }
            });
            return result;
        };


        this.loadScene = function (stage, sceneId) {
            this.currentEditor.forEach(function (editor) {
                editor.exit();
            });
            this.layers.forEach(function (layer) {
                layer.unload();
            });

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

            this.layers.forEach(function (layer) {
                layer.load(stage, scene);
            });
            this.currentEditor.forEach(function (editor) {
                editor.enter(stage, scene);
            });

            return sceneId;
        };

        this.enterEditor = function (/*editors*/) {
            //TODO only exit/enter different editors
            var container = this;
            this.currentEditor.forEach(function (editor) {
                editor.exit();
            });
            this.currentEditor = [];
            if (arguments.length) {
                for (var i = 0; i < arguments.length; i++) {
                    var editor = arguments[i];
                    if (editor) {
                        this.currentEditor.push(editor);
                        editor.enter(container.stage, container.scene);
                    }
                }
            }
        };

        this.animate = function () {
            if (this.scene) {
                var deltatime = this.clock.getDelta();

                this.camera.update();

                this.currentEditor.forEach(function (editor) {
                    editor.update(deltatime);
                });
                this.layers.forEach(function (layer) {
                    layer.update(deltatime);
                });

                this.camera.update();

                this.renderer.render(this.group, this.camera.camera_threejs);
            }

            var container = this;
            requestAnimationFrame(function () {
                container.animate();
            });
        };

        this.onResize = function () {
            this.width = this.dom.clientWidth;
            this.height = this.dom.clientHeight;
            this.camera.resize(this.width, this.height);
            this.renderer.setSize(this.width, this.height);
        };
        this.onMouseDown = function (event) {
            if (this.scene) this.currentEditor.forEach(function (editor) {
                editor.onMouseDown(event);
            })
        };
        this.onMouseMove = function (event) {
            if (this.scene) this.currentEditor.forEach(function (editor) {
                editor.onMouseMove(event);
            })
        };
        this.onMouseUp = function (event) {
            if (this.scene) this.currentEditor.forEach(function (editor) {
                editor.onMouseUp(event);
            })
        };
        this.onMouseWheel = function(event){
            if (this.scene) this.currentEditor.forEach(function (editor) {
                editor.onMouseWheel(event);
            })
        };
        this.onMouseClick = function (event) {
            if (this.scene) this.currentEditor.forEach(function (editor) {
                editor.onMouseClick(event);
            })
        };
        this.onMouseDbClick = function (event) {
            if (this.scene) this.currentEditor.forEach(function (editor) {
                editor.onMouseDbClick(event);
            })
        }
    }

    return Container;
});