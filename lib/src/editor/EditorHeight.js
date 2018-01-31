define(['Editor', 'THREE', 'measureUtils', 'utils'], function (Editor, THREE, measureUtils, utils) {
    function EditorHeight() {
        this.linePointList = [];
        this.start = false;
        this.color = '#FF6C00';
    }

    EditorHeight.prototype = new Editor("EditorHeight");

    EditorHeight.prototype.add = function (container) {
        Editor.prototype.add.call(this, container);
    };

    EditorHeight.prototype.onMouseMove = function (event) {
        if (!measureUtils.hintMove(this.start, event, '双击结束')) return;
        if (this.linePointList.length > 0) {
            if (this.linePointList[this.linePointList.length - 1].removeable === true) {
                this.group.remove(this.group.children[this.group.children.length - 1]); //remove last line
                this.linePointList.pop();   //remove last point
            }
            var airPoint = utils.calcAirPoint(this.linePointList[0].point, new THREE.Vector2(((event.offsetX / window.innerWidth) * 2 - 1), (-(event.offsetY / window.innerHeight) * 2 + 1)), this.container.camera);
            var start = this.linePointList[0];
            var tempP = {
                point: new THREE.Vector3(airPoint.x, airPoint.y, airPoint.z),
                img: null,
                label: null,
                removeable: true
            };
            this.linePointList.push(tempP);
            var tempL = measureUtils.createLine(start.point, tempP.point, this.color);
            this.group.add(tempL);
        }
    };

    EditorHeight.prototype.onMouseClick = function (event) {

        var temp = measureUtils.detectPointGround(this.container, event, 'clickSetStart');
        if (temp === null) return;
        if (this.start === false) {
            this.start = true;
            var tempP = {
                point: new THREE.Vector3(temp.x, temp.y, temp.z),
                img: measureUtils.addImageToPoint('heightDiv'),
                label: measureUtils.addLabelToPoint('heightDiv'),
                removeable: false,
                type: 'point'
            };
            this.linePointList.push(tempP);
            measureUtils.syncPosition(this.container, this.linePointList);
            measureUtils.updateContent(this.container, this.linePointList, 'height');
        }
    };

    EditorHeight.prototype.onMouseDbClick = function (event) {
        this.start = false;
        if (this.group.children.length > 0) {
            this.group.remove(this.group.children[this.group.children.length - 1]); //remove last line
            this.linePointList.pop();   //remove last point
            var airPoint = utils.calcAirPoint(this.linePointList[0].point, new THREE.Vector2(((event.offsetX / window.innerWidth) * 2 - 1), (-(event.offsetY / window.innerHeight) * 2 + 1)), this.container.camera);
            var start = this.linePointList[0];
            var tempP = {
                point: new THREE.Vector3(airPoint.x, airPoint.y, airPoint.z),
                img: measureUtils.addImageToPoint('heightDiv'),
                label: measureUtils.addLabelToPoint('heightDiv'),
                removeable: false,
                type: 'end'
            };
            this.linePointList.push(tempP);
            var tempL = measureUtils.createLine(start.point, tempP.point, this.color);
            this.group.add(tempL);
            measureUtils.syncPosition(this.container, this.linePointList);
            measureUtils.updateContent(this.container, this.linePointList, 'height');
            this.container.getLayer("LayerHeight").addLine(this.linePointList);
            this.linePointList = [];
            for (var i = this.group.children.length - 1; i >= 0; i--) {
                this.group.remove(this.group.children[i]);
            }
        }
    };

    EditorHeight.prototype.exit = function (event) {
        Editor.prototype.exit.call(this);
        $('#moveSetStart').remove();
        $('#clickSetStart').remove();
        for (var i = 0; i < this.linePointList.length; i++) {
            if (this.linePointList[i].img) {
                this.linePointList[i].img.remove();
            }
            if (this.linePointList[i].label) {
                this.linePointList[i].label.remove();
            }
        }
        this.linePointList = [];
        this.start = false;
        for (var j = this.group.children.length - 1; j >= 0; j--) {
            this.group.remove(this.group.children[j]);
        }
    };

    return EditorHeight;
});