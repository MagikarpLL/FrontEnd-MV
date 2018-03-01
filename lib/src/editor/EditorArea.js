define(['Editor', 'THREE', 'measureUtils', 'jquery'], function (Editor, THREE, measureUtils, $) {
    function EditorArea() {
        this.linePointList = [];
        this.start = false;
        this.currentArea = null;
        this.color = '#1BF6FF';
        this.lineGroup = new THREE.Group();
        this.lineGroup.groupName = 'linegroup';
        this.lineColor = '#0066ff';
    }

    EditorArea.prototype = new Editor("EditorArea");

    EditorArea.prototype.add = function (container) {
        Editor.prototype.add.call(this, container);
    };

    EditorArea.prototype.enter = function () {
        this.group = new THREE.Group();
        this.container.group.add(this.group);
        this.group.add(this.lineGroup);
    }
/*
鼠标移动时，先判断是否满足画面积的条件，若满足，则删除当前Editor里存的area，然后添加当前点，并重新绘制并加入当前Editor，最后删除当前点
 */
    EditorArea.prototype.onMouseMove = function (event) {
        if (!measureUtils.hintMove(this.start, event, '单击继续，双击结束')) return;
        var temp = measureUtils.detectPointGround(this.container, event, 'moveSetStart');
        if (temp === null) return;
        var tempP = {
            point: new THREE.Vector2(temp.x, temp.z),
            pointLine: new THREE.Vector3(temp.x, temp.y, temp.z),
            removeable: true
        };
        this.linePointList.push(tempP);
        if (this.linePointList.length > 2) {
            if (measureUtils.hintArrayPointIntersect(this.linePointList)) {
                this.linePointList.pop();
                return;
            }
            this.group.remove(this.currentArea);
            this.currentArea = measureUtils.createArea(this.container, this.linePointList);
            this.group.add(this.currentArea);
        }

        if (this.linePointList.length >= 2) {
            measureUtils.removeAndCreateAreaLines(this.linePointList, this.lineColor, this.lineGroup);
        }

        this.linePointList.pop();   //remove last point
    };

    EditorArea.prototype.onMouseClick = function (event) {
        this.start = true;
        var temp = measureUtils.detectPointGround(this.container, event, 'moveSetStart');
        if (temp === null) return;
        var tempP = {
            point: new THREE.Vector2(temp.x, temp.z),
            pointLine: new THREE.Vector3(temp.x, temp.y, temp.z),
            removeable: false,
            type: 'point'
        };
        this.linePointList.push(tempP);
        if (this.linePointList.length > 2) {
            if (measureUtils.hintArrayPointIntersect(this.linePointList)) {
                this.linePointList.pop();   //remove last point
                return;
            }
            this.group.remove(this.currentArea); //remove area
            this.currentArea = measureUtils.createArea(this.container, this.linePointList);
            this.group.add(this.currentArea);
        }

        if (this.linePointList.length >= 2) {
            measureUtils.removeAndCreateAreaLines(this.linePointList, this.lineColor, this.lineGroup);
        }

    }

    EditorArea.prototype.onMouseDbClick = function (event) {
        var temp = measureUtils.detectPointGround(this.container, event, 'moveSetStart');
        if (temp === null) return;
        var tempP = {
            point: new THREE.Vector2(temp.x, temp.z),
            pointLine: new THREE.Vector3(temp.x, temp.y, temp.z),
            removeable: false,
        };
        this.linePointList.push(tempP);

        if (this.linePointList.length > 2) {

            tempP.label = measureUtils.addLabelToPoint('areaDiv');
            tempP.type = 'end';

            if (measureUtils.hintArrayPointIntersect(this.linePointList)) {
                this.linePointList.pop();
                return;
            }
            this.start = false;
            this.group.remove(this.currentArea);
            this.currentArea = measureUtils.createArea(this.container, this.linePointList);
            this.group.add(this.currentArea);

            measureUtils.removeAndCreateAreaLines(this.linePointList, this.lineColor, this.lineGroup);


            this.container.getLayer("LayerArea").addArea(this.linePointList);
            this.linePointList = [];
            this.currentArea = null;
            for (var i = this.group.children.length - 1; i >= 0; i--) {
                if (this.group.children[i].groupName) {
                    var tempGroup = this.group.children[i];
                    for (var j = tempGroup.children.length - 1; j >= 0; j--) {
                        tempGroup.remove(tempGroup.children[j]);
                    }
                } else {
                    this.group.remove(this.group.children[i]);
                }
            }
        }
    };

    EditorArea.prototype.exit = function (event) {
        Editor.prototype.exit.call(this);
        $('#moveSetStart').remove();
        $('#clickSetStart').remove();
        this.linePointList = [];
        this.start = false;
        this.currentArea = null;
        for (var j = this.lineGroup.children.length - 1; j >= 0; j--) {
            this.lineGroup.remove(this.lineGroup.children[j]);
        }
    };

    return EditorArea;
});