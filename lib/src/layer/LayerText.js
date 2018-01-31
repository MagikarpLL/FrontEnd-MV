define(['THREE', 'Layer', 'jquery','measureUtils'], function (THREE, Layer, $, measureUtils) {
    function LayerText() {

    }

    LayerText.prototype = new Layer("LayerText");

    LayerText.prototype.load = function (stage, scene) {  //add data to group
        Layer.prototype.load.call(this, stage, scene);
        //TODO read scene data and load existing lines

        if( this.scene.data && this.scene.data.textData){
            measureUtils.changeObjToV3d(this.scene.data.textData, 'text');
            measureUtils.addDataImgLabel(this.scene.data.textData, 'text', this.container);
            createTexts(this.scene.data.textData, this.container);
            syncTextPosition(this.scene.data.textData, this.container);
        }else{
            if(this.scene.data){
            }else{
                this.scene.data = {};
            }
            this.scene.data.textData = [];
        }

    };

    LayerText.prototype.unload = function () {
        for(var i = 0; i < this.scene.data.textData.length; i++){
            this.scene.data.textData[i].label = null;
        }
        $('#textDiv').empty();
    };

    LayerText.prototype.addText = function (textObj, color) {

        var tempP = this.container.camera.project3dToScreen(new THREE.Vector3(textObj.point.x, textObj.point.y, textObj.point.z));
        var $h1 = $('    <div class="arrow_box">\n' +
            '            <span>' + textObj.text + '</span>\n' +
            '            <span><img class="text_delimg" src="resource/ids360Viewer/img/icon/text_delete.png" onclick="removeText(' + this.scene.data.textData.length + ')"></span>\n' +
            '            </div>');
        $('#textDiv').append($h1);

        $h1.css('color',color);

        $h1.css('left', tempP.x - $h1.width() / 2 - 10 + 'px')
        $h1.css('top', tempP.y - 20 - $h1.height() + 'px');

        this.scene.data.textData.push({
            point3d: textObj.point,
            text: textObj.text,
            dataIndex: this.scene.data.textData.length,
            label: $h1,
            color:color.slice(1)
        });

        measureUtils.saveDataToServer(this.scene.id, this.scene.data);

    };

    LayerText.prototype.removeText = function (dataIndex) {
        var tempP = this.scene.data.textData.splice(dataIndex, 1);
        tempP[0].label.remove();
        for (var i = 0; i < this.scene.data.textData.length; i++) {
            if (this.scene.data.textData[i].dataIndex !== i) {
                this.scene.data.textData[i].dataIndex = i;

                console.log(this.scene.data.textData[i]);

                this.scene.data.textData[i].label[0].children[1].children[0].setAttribute('onclick', 'removeText(' + this.scene.data.textData[i].dataIndex + ')');
            }
        }

        measureUtils.saveDataToServer(this.scene.id, this.scene.data);

    };

    this.createTexts = function (textData, container) {
        for (var i = 0; i < textData.length; i++) {
            $('#textDiv').append(textData[i].label);
        }

        //syncPosition
        syncTextPosition(textData, container);
    };

    this.syncTextPosition = function (textData, container) {
        for (var i = 0; i < textData.length; i++) {
            var tempP = container.camera.project3dToScreen(new THREE.Vector3(textData[i].point3d.x, textData[i].point3d.y, textData[i].point3d.z));
            if(tempP !== null){
                textData[i].label.show();
                textData[i].label.css('left', tempP.x - textData[i].label.width() / 2 - 10 + 'px');
                textData[i].label.css('top', tempP.y - 20 - textData[i].label.height() + 'px');
            }else{
                textData[i].label.hide();
            }
        }
    }

    LayerText.prototype.show = function () {
        $('#textDiv').show();
        this.visible = true;
        this.group.visible = true;
    };

    LayerText.prototype.hide = function () {
        $('#textDiv').hide();
        this.visible = false;
        this.group.visible = false;
    };

    LayerText.prototype.syncPosition = function () {
        syncTextPosition(this.scene.data.textData, this.container);
    };


    return LayerText;
});