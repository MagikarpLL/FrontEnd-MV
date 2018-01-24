define(['Editor', 'THREE', 'measureUtils','utils'], function (Editor, THREE, measureUtils,utils) {
    function EditorArea() {
        this.linePointList = [];
        this.start = false;
        this.currentArea = null;
    }

    EditorArea.prototype = new Editor("EditorArea");

    EditorArea.prototype.add = function (container) {
        Editor.prototype.add.call(this, container);
    };

    EditorArea.prototype.onMouseMove = function (event) {


        if (this.start === false) {
            if($('#clickSetStart')[0]){
                $('#clickSetStart').css('top', event.clientY + 30);
                $('#clickSetStart').css('left', event.clientX + 30);
            }else{
                $('#mainDiv').append('<div id="clickSetStart" class="clickSetStart">单击以确定起点</div>');
            }
            $('#moveSetStart').remove();
        } else {
            if($('#moveSetStart')[0]){
                $('#moveSetStart').css('top', event.clientY + 30);
                $('#moveSetStart').css('left', event.clientX + 30);
            }else{
                $('#mainDiv').append('<div id="moveSetStart" class="clickSetStart">单击继续，双击结束</div>');
            }
            $('#clickSetStart').remove();


            //add point
            var temp = measureUtils.get3DPoint(event, this.container);
            var dy = this.container.camera.rayMouse(event.clientX, event.clientY).direction.y;
            if (dy > 0 || (Math.sqrt(Math.pow(temp.x, 2) + Math.pow(temp.z, 2)) > 800)) {    //该点超出边界，不显示，返回null
                $('#moveSetStart').text('该点不位于地面，请重新选择');
                $('#moveSetStart').css('color','red');
                return null;
            }else{
                $('#moveSetStart').text('单击继续，双击结束');
                $('#moveSetStart').css('color','black');
            }


            var tempP = {
                point: new THREE.Vector2(temp.x, temp.z),
                removeable: true
            };
            this.linePointList.push(tempP);


            // draw area
            if(this.linePointList.length > 2){

                if(utils.detectArrayPointsIntersect(utils.getPointArray(this.linePointList))){     //有线相交
                    this.linePointList.pop();
                    $('#moveSetStart').text('图形线段交叉，请顺/逆时针选择点');
                    $('#moveSetStart').css('color','red');
                    return null;
                }else{
                    $('#moveSetStart').text('单击继续，双击结束');
                    $('#moveSetStart').css('color','black');
                }

                //remove last area
                this.group.remove(this.currentArea);

                var materialArea = new THREE.MeshBasicMaterial({
                    color: 0x44A6F4,
                    side: THREE.DoubleSide,
                    transparent: true,
                    opacity: 0.4
                });
                var planeShape = measureUtils.getAreaPlaneShape(this.linePointList);
                var geometry = new THREE.ShapeGeometry(planeShape);
                this.currentArea = new THREE.Mesh(geometry, materialArea);
                this.currentArea.position.set(0, -this.container.scene.imageAlt, 0);
                this.currentArea.rotateX(-Math.PI / 2);
                this.currentArea.scale.set(1, -1, 1);
                this.group.add(this.currentArea);
            }

            //pop point
            this.linePointList.pop();   //remove last point

        }


        // this.container.getLayer('LayerIcons').moveIcon(event.clientX, event.clientY);
    };

    EditorArea.prototype.onMouseClick = function (event) {

        this.start = true;

        var temp = measureUtils.get3DPoint(event, this.container);
        var dy = this.container.camera.rayMouse(event.clientX, event.clientY).direction.y;
        if (dy > 0 || (Math.sqrt(Math.pow(temp.x, 2) + Math.pow(temp.z, 2)) > 800)) {    //该点超出边界，不显示，返回null
            $('#moveSetStart').text('该点不位于地面，请重新选择');
            $('#moveSetStart').css('color','red');
            return null;
        }else{
            $('#moveSetStart').text('单击继续，双击结束');
            $('#moveSetStart').css('color','black');
        }


        var tempP = {
            point: new THREE.Vector2(temp.x, temp.z),
            // img: measureUtils.addImageToPoint(),
            // label: measureUtils.addLabelToPoint(),
            removeable: false,
            type:'point'
        };
        this.linePointList.push(tempP);


        if (this.linePointList.length > 2) {

            if(utils.detectArrayPointsIntersect(utils.getPointArray(this.linePointList))){     //有线相交
                this.linePointList.pop();
                $('#moveSetStart').text('图形线段交叉，请顺/逆时针选择点');
                $('#moveSetStart').css('color','red');
                return null;
            }else{
                $('#moveSetStart').text('单击继续，双击结束');
                $('#moveSetStart').css('color','black');
            }

            this.group.remove(this.currentArea); //remove area

            //paintArea
            var materialArea = new THREE.MeshBasicMaterial({
                color: 0x44A6F4,
                side: THREE.DoubleSide,
                transparent: true,
                opacity: 0.4
            });
            var planeShape = measureUtils.getAreaPlaneShape(this.linePointList);
            var geometry = new THREE.ShapeGeometry(planeShape);
            this.currentArea = new THREE.Mesh(geometry, materialArea);
            this.currentArea.position.set(0, -this.container.scene.imageAlt, 0);
            this.currentArea.rotateX(-Math.PI / 2);
            this.currentArea.scale.set(1, -1, 1);
            this.group.add(this.currentArea);

        }



        // measureUtils.syncPosition(this.container, this.linePointList);
        // measureUtils.updateContent(this.container, this.linePointList, 'distance');


    }

    EditorArea.prototype.onMouseDbClick = function (event) {

        if(this.linePointList.length > 2){

            //add point
            var temp = measureUtils.get3DPoint(event, this.container);
            var dy = this.container.camera.rayMouse(event.clientX, event.clientY).direction.y;
            if (dy > 0 || (Math.sqrt(Math.pow(temp.x, 2) + Math.pow(temp.z, 2)) > 800)) {    //该点超出边界，不显示，返回null
                $('#moveSetStart').text('该点不位于地面，请重新选择');
                $('#moveSetStart').css('color','red');
                return null;
            }else{
                $('#moveSetStart').text('单击继续，双击结束');
                $('#moveSetStart').css('color','black');
            }

            if(utils.detectArrayPointsIntersect(utils.getPointArray(this.linePointList))){     //有线相交
                this.linePointList.pop();
                $('#moveSetStart').text('图形线段交叉，请顺/逆时针选择点');
                $('#moveSetStart').css('color','red');
                return null;
            }else{
                $('#moveSetStart').text('单击继续，双击结束');
                $('#moveSetStart').css('color','black');
            }

            //remove last area
            this.group.remove(this.currentArea);

            this.start = false;

            var tempP = {
                point: new THREE.Vector2(temp.x, temp.z),
                label: measureUtils.addLabelToPoint('areaDiv'),
                removeable: false,
                type:'end'
            };
            this.linePointList.push(tempP);

            //draw area
            var materialArea = new THREE.MeshBasicMaterial({
                color: 0x44A6F4,
                side: THREE.DoubleSide,
                transparent: true,
                opacity: 0.4
            });
            var planeShape = measureUtils.getAreaPlaneShape(this.linePointList);
            var geometry = new THREE.ShapeGeometry(planeShape);
            this.currentArea = new THREE.Mesh(geometry, materialArea);
            this.currentArea.position.set(0, -this.container.scene.imageAlt, 0);
            this.currentArea.rotateX(-Math.PI / 2);
            this.currentArea.scale.set(1, -1, 1);
            this.group.add(this.currentArea);

            // measureUtils.syncPosition(this.container, this.linePointList);
            // measureUtils.updateAreaContent(this.container, this.linePointList);

            this.container.getLayer("LayerArea").addArea(this.linePointList);

            this.linePointList = [];
            this.currentArea = null;
            for (var i = this.group.children.length - 1; i >= 0; i--) {
                this.group.remove(this.group.children[i]);
            }
        }

    };

    EditorArea.prototype.exit = function (event) {
        Editor.prototype.exit.call(this);

        $('#moveSetStart').remove();
        $('#clickSetStart').remove();

    };


    return EditorArea;
});