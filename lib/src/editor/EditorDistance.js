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

            if (this.linePointList.length > 0) {
                if (this.linePointList[this.linePointList.length - 1].removeable === true) {
                    this.group.remove(this.group.children[this.group.children.length - 1]); //remove last line
                    this.linePointList.pop();   //remove last point
                }
                var temp = measureUtils.get3DPoint(event, this.container);
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


        // this.container.getLayer('LayerIcons').moveIcon(event.clientX, event.clientY);
    };

    EditorDistance.prototype.onMouseClick = function (event) {

        this.start = true;

        console.log(event.clientX, event.clientY);


        var temp = measureUtils.get3DPoint(event, this.container);
        var tempP = {
            point: new THREE.Vector3(temp.x, temp.y, temp.z),
            img: measureUtils.addImageToPoint(),
            label: measureUtils.addLabelToPoint(),
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
        measureUtils.updateContent(this.container, this.linePointList);


        // this.container.getLayer('LayerIcons').selectIcon(event.clientX, event.clientY);
    }

    EditorDistance.prototype.onMouseDbClick = function (event) {


        this.start = false;
        if (this.group.children.length > 0) {
            this.group.remove(this.group.children[this.group.children.length - 1]); //remove last line
            this.linePointList.pop();   //remove last point

            var temp = measureUtils.get3DPoint(event, this.container);
            var start = this.linePointList[this.linePointList.length - 1];
            var tempP = {
                point: new THREE.Vector3(temp.x, temp.y, temp.z),
                img: measureUtils.addImageToPoint(),
                label: measureUtils.addLabelToPoint(),
                removeable: false,
                type:'end'
            };
            this.linePointList.push(tempP);
            var tempL = measureUtils.createLine(start.point, tempP.point);
            this.group.add(tempL);

            measureUtils.syncPosition(this.container, this.linePointList);
            measureUtils.updateContent(this.container, this.linePointList);

            // this.container.getLayer("LayerDistance").addLine(this.linePointList);
            //
            // this.linePointList = [];
            // for (var i = this.group.children.length - 1; i >= 0; i--) {
            //     this.group.remove(this.group.children[i]);
            // }

            //send data to layer

        }


    };

    EditorDistance.prototype.exit = function (event) {
        Editor.prototype.exit.call(this);


        // this.container.getLayer('LayerIcons').addIcon(event.clientX, event.clientY, this.imagePath);
    };


    return EditorDistance;
});