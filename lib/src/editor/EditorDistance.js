define(['Editor', 'THREE', 'measureUtils', 'jquery'], function (Editor, THREE, measureUtils, $) {
    function EditorDistance() {
        this.linePointList = [];
        this.start = false;
        this.color = '#0B96FF';
    }

    EditorDistance.prototype = new Editor("EditorDistance");

    EditorDistance.prototype.add = function (container) {
        Editor.prototype.add.call(this, container);
    };

    EditorDistance.prototype.onMouseMove = function (event) {
        if (!measureUtils.hintMove(this.start, event, '单击继续，双击结束')) return;
        var temp = measureUtils.detectPointGround(this.container, event, 'moveSetStart');
        if (temp === null) return;
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
            var tempL = measureUtils.createLine(start.point, tempP.point, this.color);
            this.group.add(tempL);
        }
    };

    EditorDistance.prototype.onMouseClick = function (event) {
        this.start = true;
        var temp = measureUtils.detectPointGround(this.container, event, 'moveSetStart');
        if (temp === null) return;
        var tempP = {
            point: new THREE.Vector3(temp.x, temp.y, temp.z),
            img: measureUtils.addImageToPoint('distanceDiv'),
            label: measureUtils.addLabelToPoint('distanceDiv'),
            removeable: false,
            type: 'point'
        };
        if (this.group.children.length > 0) {
            this.group.remove(this.group.children[this.group.children.length - 1]); //remove last line
            this.linePointList.pop();   //remove last point
            var start = this.linePointList[this.linePointList.length - 1];
            var tempL = measureUtils.createLine(start.point, tempP.point, this.color);
            this.group.add(tempL);
        }
        this.linePointList.push(tempP);
        measureUtils.syncPosition(this.container, this.linePointList);
        measureUtils.updateContent(this.container, this.linePointList, 'distance');
    }

    EditorDistance.prototype.onMouseDbClick = function (event) {
        if (this.group.children.length > 0) {
            var temp = measureUtils.detectPointGround(this.container, event, 'moveSetStart');
            if (temp === null) return;
            this.start = false;
            this.group.remove(this.group.children[this.group.children.length - 1]); //remove last line
            this.linePointList.pop();   //remove last point
            var start = this.linePointList[this.linePointList.length - 1];
            var tempP = {
                point: new THREE.Vector3(temp.x, temp.y, temp.z),
                img: measureUtils.addImageToPoint('distanceDiv'),
                label: measureUtils.addLabelToPoint('distanceDiv'),
                removeable: false,
                type: 'end'
            };
            this.linePointList.push(tempP);
            var tempL = measureUtils.createLine(start.point, tempP.point, this.color);
            this.group.add(tempL);
            measureUtils.syncPosition(this.container, this.linePointList);
            measureUtils.updateContent(this.container, this.linePointList, 'distance');
            this.container.getLayer("LayerDistance").addLine(this.linePointList);
            this.linePointList = [];
            for (var i = this.group.children.length - 1; i >= 0; i--) {
                this.group.remove(this.group.children[i]);
            }
        }
    };

    EditorDistance.prototype.exit = function (event) {
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

    return EditorDistance;
});