define(['Editor', 'THREE', 'measureUtils'], function (Editor, THREE, measureUtils) {
    function EditorDistance() {
        this.linePointList = [];
        this.start = false;
    }

    EditorDistance.prototype = new Editor("EditorDistance");

    EditorDistance.prototype.add = function (container) {
        Editor.prototype.add.call(this, container);
    };

    EditorDistance.prototype.onMouseMove = function (event) {


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

            if (this.linePointList.length > 0) {

                if (this.linePointList[this.linePointList.length - 1].removeable === true) {
                    this.group.remove(this.group.children[this.group.children.length - 1]); //remove last line
                    this.linePointList.pop();   //remove last point
                }
                var start = this.linePointList[this.linePointList.length - 1];
                var tempP = {
                    point: new THREE.Vector3(temp.x, temp.y, temp.z),
                    img: null,
                    label: null,
                    removeable: true
                };
                this.linePointList.push(tempP);
                var tempL = measureUtils.createLine(start.point, tempP.point);
                this.group.add(tempL);
            }
        }
    };

    EditorDistance.prototype.onMouseClick = function (event) {


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
            point: new THREE.Vector3(temp.x, temp.y, temp.z),
            img: measureUtils.addImageToPoint('distanceDiv'),
            label: measureUtils.addLabelToPoint('distanceDiv'),
            removeable: false,
            type:'point'
        };


        if (this.group.children.length > 0) {
            this.group.remove(this.group.children[this.group.children.length - 1]); //remove last line
            this.linePointList.pop();   //remove last point

            var start = this.linePointList[this.linePointList.length - 1];
            var tempL = measureUtils.createLine(start.point, tempP.point);
            this.group.add(tempL);
        }

        this.linePointList.push(tempP);

        measureUtils.syncPosition(this.container, this.linePointList);
        measureUtils.updateContent(this.container, this.linePointList, 'distance');


        // this.container.getLayer('LayerIcons').selectIcon(event.clientX, event.clientY);
    }

    EditorDistance.prototype.onMouseDbClick = function (event) {



        if (this.group.children.length > 0) {

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

            this.start = false;

            this.group.remove(this.group.children[this.group.children.length - 1]); //remove last line
            this.linePointList.pop();   //remove last point
            var start = this.linePointList[this.linePointList.length - 1];
            var tempP = {
                point: new THREE.Vector3(temp.x, temp.y, temp.z),
                img: measureUtils.addImageToPoint('distanceDiv'),
                label: measureUtils.addLabelToPoint('distanceDiv'),
                removeable: false,
                type:'end'
            };
            this.linePointList.push(tempP);
            var tempL = measureUtils.createLine(start.point, tempP.point);
            this.group.add(tempL);

            measureUtils.syncPosition(this.container, this.linePointList);
            measureUtils.updateContent(this.container, this.linePointList, 'distance');

            this.container.getLayer("LayerDistance").addLine(this.linePointList);

            this.linePointList = [];
            for (var i = this.group.children.length - 1; i >= 0; i--) {
                this.group.remove(this.group.children[i]);
            }

            //send data to layer

        }


    };

    EditorDistance.prototype.exit = function (event) {
        Editor.prototype.exit.call(this);

        $('#moveSetStart').remove();
        $('#clickSetStart').remove();

        for(var i = 0; i < this.linePointList.length; i++){
            if(this.linePointList[i].img){
                this.linePointList[i].img.remove();
            }
            if(this.linePointList[i].label){
                this.linePointList[i].label.remove();
            }
        }

        this.linePointList = [];

    };


    return EditorDistance;
});