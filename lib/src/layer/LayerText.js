define(['THREE', 'Layer'], function (THREE, Layer) {
    function LayerText() {

    }
    LayerText.prototype = new Layer("LayerText");

    LayerText.prototype.load = function (stage, scene) {  //add data to group
        Layer.prototype.load.call(this, stage, scene);
        //TODO read scene data and load existing lines

        if(typeof this.scene.textData === 'undefined'){
            this.scene.textData = [];
        }else{
            for(var i = 0; i < this.scene.textData.length; i++){
                // this.group.add(this.scene.textData[i]);
            }
        }
    };

    LayerText.prototype.addText = function (textObj, color) {

        var tempP = this.container.camera.project3dToScreen(textObj.point);
        var $h1 = $('    <div class="arrow_box">\n' +
            '            <span>' + textObj.text + '</span>\n' +
            '            <span><img class="text_delimg" src="../res/img/icon/text_delete.png" onclick="removeText(" + this.scene.textData.length + ")"></span>\n' +
            '            </div>');
        $('#textDiv').append($h1);

        $h1.css('left',  tempP.x  - $h1.width()/2 -10  + 'px')
        $h1.css('top', tempP.y - 20 - $h1.height() + 'px');

        this.scene.textData.push({
            point3d: textObj.point,
            text: textObj.text,
            dataIndex: this.scene.textData.length,
            label: $h1
        });

    };

    LayerText.prototype.removeText = function (dataIndex) {

        var tempP = this.scene.textData.splice(dataIndex, 1);
        tempP.label.remove();

        for(var i = 0; i < this.scene.textData.length; i++){
            if(this.scene.textData[i].dataIndex !== i){
                this.scene.textData[i].dataIndex = i;
                this.scene.textData[i].label[0].children[2].children[0].setAttribute('onclick','removeText('+ i +')');
            }
        }

    };

    LayerText.prototype.unload = function () {

    };

    Layer.prototype.show = function () {

    };

    Layer.prototype.hide = function () {

    };

    Layer.prototype.syncLabelPosition = function () {

    };



    return LayerText;
});