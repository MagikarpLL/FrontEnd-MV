//threeJS
var panorama = (function () {

    var camera, scene, renderer, material, mesh;
    var textureLoader = new THREE.TextureLoader();

    var isUserInteracting = false;

    //plane and mobile
    var group;
    var iconGroup = new THREE.Group();

    // intersection
    var raycaster = new THREE.Raycaster();
    var clock = new THREE.Clock(true);
    var timePass = 0, count = 1, changeTime = 2 / 23, mouse = new THREE.Vector2();
    raycaster.linePrecision = 1;

    var SCALE_CONSTANT = 2;

    //edit line
    var lineGroup = new THREE.Group();
    var lineGeometry, linePosition, line, lineMaterial;

    var currentScene;
    var outdoorSceneData;

    //measure data
    var currentDistance = null, currentHeight = null, currentArea = null;
    var measureGroup = new THREE.Group();
    var areaArray = [];


    //three.js function
    function init() {

        var container, mesh;
        container = document.getElementById('container');

        panorama.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1100);
        panorama.camera.target = new THREE.Vector3(0, 0, 0);
        panorama.scene = new THREE.Scene();
        panorama.renderer = new THREE.WebGLRenderer({alpha: true});

        //panorama
        var geometry = new THREE.SphereBufferGeometry(1000, 120, 60);
        // invert the geometry on the x-axis so that all of the faces point inwards
        geometry.scale(-1, 1, 1);
        panorama.material = new THREE.MeshBasicMaterial({
            map: panorama.textureLoader.load('../res/img/exampleImg3.jpg'),
            opacity: 1,
            transparent: false
        });
        panorama.mesh = new THREE.Mesh(geometry, panorama.material);
        // panorama.mesh = mesh;
        panorama.material.map.anisotropy = 4;

        panorama.iconGroup.visible = false;
        panorama.scene.add(panorama.mesh);
        panorama.scene.add(panorama.iconGroup);

        panorama.lineGroup.visible = false;
        panorama.scene.add(panorama.lineGroup);

        panorama.measureGroup.visible = false;
        panorama.scene.add(panorama.measureGroup);

        panorama.renderer.setClearColor(0x000000, 0);
        panorama.renderer.setPixelRatio(window.devicePixelRatio);
        panorama.renderer.setSize(window.innerWidth, window.innerHeight);
        container.appendChild(panorama.renderer.domElement);
    }

    //跳转图标
    function addIcon(curScene, outdoorSceneData) {
        panorama.group = new THREE.Group();
        var baseY = -outdoorSceneData[curScene].planeY;
        //calculate each point's coordinate, then add point to group
        for (var i = 0; i < outdoorSceneData.length; i++) {
            if (i != curScene) {
                lnglatToXY(outdoorSceneData[curScene], outdoorSceneData[i]);
                // outdoorSceneData[i].mapPlane.
                outdoorSceneData[i].minFilter = THREE.LinearFilter;
                outdoorSceneData[i].mapPlane.repeat.x = 1;
                outdoorSceneData[i].mapPlane.repeat.y = 128 / 2944;
                outdoorSceneData[i].mapPlane.offset.x = 0;
                outdoorSceneData[i].mapPlane.offset.y = outdoorSceneData[i].mapPlane.repeat.y * 1;
                var spritePlane = new THREE.Sprite(new THREE.SpriteMaterial({map: outdoorSceneData[i].mapPlane}));
                spritePlane.scale.set(1, 1, 1);
                spritePlane.position.set(outdoorSceneData[i].planeX, baseY + outdoorSceneData[i].planeY, outdoorSceneData[i].planeZ);
                spritePlane.position.setLength(10 * Math.pow(Math.log(spritePlane.position.length()) / Math.log(100), 2));
                spritePlane.dataIndex = i;
                panorama.group.add(spritePlane);
            }
        }
        //scene
        panorama.scene.add(panorama.group);
    }

    //消防车等红色图标
    function addRedIcon(i, imagePath) {
        panorama.raycaster.setFromCamera(panorama.mouse, panorama.camera);
        var p = raycaster.ray.at(20);
        var spriteMap = new THREE.TextureLoader().load(imagePath);
        var spriteMaterial = new THREE.SpriteMaterial({
            map: spriteMap,
        });
        var sprite = new THREE.Sprite(spriteMaterial);
        sprite.position.set(p.x, p.y, p.z);
        sprite.iconType = 'icon';
        sprite.dataIndex = i;
        sprite.editType = false;
        panorama.iconGroup.add(sprite);
        return sprite;
    }

    //画直线
    function addLine(i, color) {
        this.linecount = 0;
        this.capability = 100;
        this.lineGeometry = new THREE.BufferGeometry();
        this.linePosition = new Float32Array(this.capability * 3); // 3 vertices per point
        this.lineGeometry.addAttribute('position', new THREE.BufferAttribute(this.linePosition, 3));
        this.lineGeometry.setDrawRange(0, this.linecount);
        this.lineMaterial = new THREE.LineBasicMaterial({color: color, linewidth: 3});
        this.line = new THREE.Line(this.lineGeometry, this.lineMaterial);
        this.line.frustumCulled = false;
        this.line.dataIndex = i;
        panorama.lineGroup.add(this.line);
        return {
            line: this.line,
            lineGeometry: this.lineGeometry,
            linecount: this.linecount,
            capability: this.capability,
            linePosition: this.linePosition
        }
    }

    //measure
    //distance
    function clickDistance(clickType, dataIndex) {
        panorama.raycaster.setFromCamera(new THREE.Vector2(panorama.mouse.x, panorama.mouse.y), panorama.camera);
        var distance = -panorama.outdoorSceneData[panorama.currentScene].planeY / panorama.raycaster.ray.direction.y;
        var p = panorama.raycaster.ray.at(distance);

        if (p.y > 0 || (Math.sqrt(Math.pow(p.x, 2) + Math.pow(p.z, 2)) > 800)) {    //该点超出边界，不显示，返回null
            return null;
        }

        var materialDistance = new THREE.LineBasicMaterial({
            color: 0x44A6F4,
            linewidth: 20
        });
        var geometry = new THREE.Geometry();

        if (clickType === 'click' && panorama.currentDistance === null) {              //单击，中间点或者起点;该点在边界内部，显示，返回distanceObj
            geometry.vertices.push(
                new THREE.Vector3(p.x, p.y, p.z),
                new THREE.Vector3(p.x, p.y, p.z)
            );
            panorama.currentDistance = new THREE.Line(geometry, materialDistance);
            panorama.scene.add(panorama.currentDistance);
        } else if (clickType === 'click' && panorama.currentDistance != null) {
            geometry.vertices = panorama.currentDistance.geometry.vertices.slice(0);
            geometry.vertices.pop();
            panorama.scene.remove(panorama.currentDistance);
            geometry.vertices.push(
                new THREE.Vector3(p.x, p.y, p.z),
                new THREE.Vector3(p.x, p.y, p.z)
            );
            panorama.currentDistance = new THREE.Line(geometry, materialDistance);
            panorama.scene.add(panorama.currentDistance);
        } else if (clickType === 'dbclick') {      //双击，结束该distance
            geometry.vertices = panorama.currentDistance.geometry.vertices.slice(0);
            // geometry.vertices.pop();
            panorama.scene.remove(panorama.currentDistance);
            geometry.vertices.push(
                new THREE.Vector3(p.x, p.y, p.z)
            );
            panorama.currentDistance = new THREE.Line(geometry, materialDistance);
            panorama.currentDistance.dataIndex = dataIndex;
            panorama.currentDistance.dataType = 'distance';
            panorama.currentDistance.dataResult = returnFloat(calculateDistance(panorama.currentDistance.geometry.vertices)) + '米';
            panorama.measureGroup.add(panorama.currentDistance);
            // panorama.measureGroup.visible = true;
            return panorama.currentDistance;
        } else if (clickType === 'move' && panorama.currentDistance != null) {

            console.log('move panorama');

            geometry.vertices = panorama.currentDistance.geometry.vertices.slice(0, panorama.currentDistance.geometry.vertices.length - 1);
            panorama.scene.remove(panorama.currentDistance);
            geometry.vertices.push(
                new THREE.Vector3(p.x, p.y, p.z)
            );
            panorama.currentDistance = new THREE.Line(geometry, materialDistance);
            panorama.scene.add(panorama.currentDistance);
        }

    }

    //height
    function clickHeight(clickType, dataIndex) {
        panorama.raycaster.setFromCamera(new THREE.Vector2(panorama.mouse.x, panorama.mouse.y), panorama.camera);
        var distance = -panorama.outdoorSceneData[panorama.currentScene].planeY / panorama.raycaster.ray.direction.y;
        var p = panorama.raycaster.ray.at(distance);

        // if (p.y > 0 || (Math.sqrt(Math.pow(p.x, 2) + Math.pow(p.z, 2)) > 800)) {    //该点超出边界，不显示，返回null
        //     return null;
        // }

        var materialHeight = new THREE.LineBasicMaterial({
            color: 0x44A6F4,
            linewidth: 20
        });
        var geometry = new THREE.Geometry();
        if (panorama.currentHeight === null && clickType === 'click') {      //确定该线的起点
            geometry.vertices.push(
                new THREE.Vector3(p.x, p.y, p.z),
                new THREE.Vector3(p.x, p.y, p.z)
            );
            panorama.currentHeight = new THREE.Line(geometry, materialHeight);
            panorama.scene.add(panorama.currentHeight);
            return 'start';
        } else if (clickType === 'dbclick') {                                      //确定该线的终点
            geometry.vertices = panorama.currentHeight.geometry.vertices.slice(0, 1);
            var tempP = geometry.vertices[0];
            panorama.scene.remove(panorama.currentHeight);
            var airPoint = calcAirPoint(tempP, new THREE.Vector2(panorama.mouse.x, panorama.mouse.y));
            geometry.vertices.push(
                new THREE.Vector3(airPoint.x, airPoint.y, airPoint.z)
            );
            panorama.currentHeight = new THREE.Line(geometry, materialHeight);
            panorama.currentHeight.dataIndex = dataIndex;
            panorama.currentHeight.dataType = 'height';
            panorama.currentHeight.dataResult = returnFloat(Math.abs(airPoint.y - tempP.y)) + '米';
            panorama.measureGroup.add(panorama.currentHeight);
            return panorama.currentHeight;
        } else if (clickType === 'move' && panorama.currentHeight != null) {
            geometry.vertices = panorama.currentHeight.geometry.vertices.slice(0, 1);
            var tempP = geometry.vertices[0];
            panorama.scene.remove(panorama.currentHeight);
            var airPoint = calcAirPoint(tempP, new THREE.Vector2(panorama.mouse.x, panorama.mouse.y));
            geometry.vertices.push(
                new THREE.Vector3(airPoint.x, airPoint.y, airPoint.z)
            );
            panorama.currentHeight = new THREE.Line(geometry, materialHeight);
            panorama.scene.add(panorama.currentHeight);
        }

    }

    //area
    function clickArea(clickType, dataIndex) {



        panorama.raycaster.setFromCamera(new THREE.Vector2(panorama.mouse.x, panorama.mouse.y), panorama.camera);
        var distance = -panorama.outdoorSceneData[panorama.currentScene].planeY / panorama.raycaster.ray.direction.y;
        var p = panorama.raycaster.ray.at(distance);

        if (p.y > 0 || (Math.sqrt(Math.pow(p.x, 2) + Math.pow(p.z, 2)) > 800)) {    //该点超出边界，不显示，返回null
            return null;
        }


        if (clickType === 'click' || clickType === 'dbclick' || panorama.areaArray.length >= 2) {
            console.log('click1');
            panorama.areaArray.push(new THREE.Vector2(p.x, p.z));
        }

        if((clickType === 'click' || clickType === 'dbclick') && panorama.areaArray.length >= 4){
            if(detectArrayPointsIntersect(panorama.areaArray)){     //有线相交
                panorama.areaArray.pop();
                return 'intersect';
            }
        }

        if (panorama.areaArray.length >= 3) {
            //因为不是第一个点，且areaArray的长度大于3，则先画出图形

            panorama.scene.remove(panorama.currentArea);
            var materialArea = new THREE.MeshBasicMaterial({
                color: 0x44A6F4,
                side: THREE.DoubleSide,
                transparent: true,
                opacity: 0.4
            });
            var planeShape = getAreaPlaneShape();
            var geometry = new THREE.ShapeGeometry(planeShape);
            panorama.currentArea = new THREE.Mesh(geometry, materialArea);
            panorama.currentArea.position.set(0, -panorama.outdoorSceneData[panorama.currentScene].planeY, 0);
            panorama.currentArea.rotateX(-Math.PI / 2);
            panorama.currentArea.scale.set(1, -1, 1);
            panorama.scene.add(panorama.currentArea);
            if (clickType === 'move') {
                panorama.areaArray.pop();
            }
            if (clickType === 'dbclick') {
                panorama.currentArea.dataIndex = dataIndex;
                panorama.currentArea.dataType = 'area';
                panorama.currentArea.dataResult = returnFloat(calcGroundArea(panorama.areaArray)) + '平方米';
                panorama.measureGroup.add(panorama.currentArea);
                return panorama.currentArea;
            }
        }
    }

    //clear current
    function clearCurrent() {
        panorama.scene.remove(panorama.currentArea);
        panorama.scene.remove(panorama.currentDistance);
        panorama.scene.remove(panorama.currentHeight);
        panorama.currentArea = null;
        panorama.currentDistance = null;
        panorama.currentHeight = null;
        panorama.areaArray = [];
    }

    //update , animate
    function animate() {
        requestAnimationFrame(animate);
        update();
    }

    function update() {
        //update div coord
        // updateDivXY();

        //animation
        var deltatime = clock.getDelta();
        timePass = timePass + deltatime;
        if (changeTime < timePass) {
            if ((typeof panorama.outdoorSceneData) != 'undefined') {
                for (var i = 0; i < panorama.outdoorSceneData.length; i++) {
                    if (i != panorama.currentScene) {
                        panorama.outdoorSceneData[i].mapPlane.offset.y = panorama.outdoorSceneData[i].mapPlane.repeat.y * count;
                    }
                }
            }
            count++;
            count = (count >= 23) ? 1 : count;
            timePass = 0;
        }
        //watch camera
        if (panorama.isUserInteracting === false) {
            //转动
            // lon += 0.1;
        }
        lat = Math.max(-85, Math.min(85, lat));
        phi = THREE.Math.degToRad(90 - lat);  //纬度转弧度，控制上下
        theta = THREE.Math.degToRad(lon);     //经度转弧度，控制左右
        panorama.camera.target.x = 500 * Math.sin(phi) * Math.cos(theta);
        panorama.camera.target.y = panorama.camera.position.y + 500 * Math.cos(phi);
        panorama.camera.target.z = 500 * Math.sin(phi) * Math.sin(theta);
        panorama.camera.lookAt(panorama.camera.target);
        panorama.renderer.render(panorama.scene, panorama.camera);
    }

    function updateIconScale() {
        for (var i = 0; i < panorama.iconGroup.children.length; i++) {
            panorama.setSpriteScale(panorama.iconGroup.children[i]);
        }
    }

    function setSpriteScale(iconSprite) {
        var tempVec = new THREE.Vector2(0, 0);
        panorama.raycaster.setFromCamera(tempVec, panorama.camera);
        var d = panorama.raycaster.ray.distanceToPoint(iconSprite.position);
        d = Math.sqrt(20 * 20 - d * d);
        var tanFov = Math.tan(panorama.camera.fov / 2 * Math.PI / 180);
        var tempScale = SCALE_CONSTANT * tanFov * d / 30;
        iconSprite.scale.set(tempScale, tempScale, 0);
    }

    // load,hide,show,util
    function clearEditGroup() {
        for (var i = 0; i < panorama.iconGroup.children.length; i++) {
            panorama.iconGroup.remove(panorama.iconGroup.children[i]);
            i--;
        }
        for (var j = 0; j < panorama.lineGroup.children.length; j++) {
            panorama.lineGroup.remove(panorama.lineGroup.children[j]);
            j--;
        }
        for (var k = 0; k < panorama.measureGroup.children.length; k++) {
            panorama.measureGroup.remove(panorama.measureGroup.children[k]);
            k--;
        }
    }

    function loadEditData(data, lineData, measureData) {
        for (var i = 0; i < data.length; i++) {
            panorama.iconGroup.add(data[i]);
        }
        for (var j = 0; j < lineData.length; j++) {
            panorama.lineGroup.add(lineData[j]);
        }
        //measureData
        for (var k = 0; k < measureData.distanceData.length; k++) {
            panorama.measureGroup.add(measureData.distanceData[k]);
        }
        for (var k1 = 0; k1 < measureData.heightData.length; k1++) {
            panorama.measureGroup.add(measureData.heightData[k1]);
        }
        for (var k2 = 0; k2 < measureData.areaData.length; k2++) {
            panorama.measureGroup.add(measureData.areaData[k2]);
        }
    }

    function showEditGroup() {
        panorama.iconGroup.visible = true;
        panorama.lineGroup.visible = true;
        panorama.measureGroup.visible = true;
    }

    function hideEditGroup() {
        panorama.iconGroup.visible = false;
        panorama.lineGroup.visible = false;
        panorama.measureGroup.visible = false;
    }

    function getSpriteXYZ() {
        panorama.raycaster.setFromCamera(panorama.mouse, panorama.camera);
        var p = raycaster.ray.at(20);
        return {
            x: p.x,
            y: p.y,
            z: p.z
        }
    }

    function getAreaPlaneShape() {
        var planeShape = new THREE.Shape();
        planeShape.moveTo(panorama.areaArray[0].x, panorama.areaArray[0].y);
        for (var i = 1; i < panorama.areaArray.length; i++) {
            planeShape.lineTo(panorama.areaArray[i].x, panorama.areaArray[i].y);
        }
        return planeShape;
    }

    function mousePointTo3D(d) {
        panorama.raycaster.setFromCamera(panorama.mouse, panorama.camera);
        var p = raycaster.ray.at(d);   //离相机多远
        return p;
    }

    return {
        camera: camera,
        renderer: renderer,
        mouse: mouse,
        mesh: mesh,
        raycaster: raycaster,
        group: group,
        textureLoader: textureLoader,
        scene: scene,
        material: material,
        isUserInteracting: isUserInteracting,
        currentScene: currentScene,
        outdoorSceneData: outdoorSceneData,
        iconGroup: iconGroup,
        lineGroup: lineGroup,
        SCALE_CONSTANT: SCALE_CONSTANT,
        currentDistance: currentDistance,
        currentHeight: currentHeight,
        currentArea: currentArea,
        measureGroup: measureGroup,
        areaArray: areaArray,
        init: init,
        animate: animate,
        addIcon: addIcon,
        addLine: addLine,
        addRedIcon: addRedIcon,
        clearEditGroup: clearEditGroup,
        loadEditData: loadEditData,
        showEditGroup: showEditGroup,
        hideEditGroup: hideEditGroup,
        getSpriteXYZ: getSpriteXYZ,
        setSpriteScale: setSpriteScale,
        updateIconScale: updateIconScale,
        clickDistance: clickDistance,
        clickHeight: clickHeight,
        clickArea: clickArea,
        clearCurrent: clearCurrent,
        mousePointTo3D: mousePointTo3D
    };

})();