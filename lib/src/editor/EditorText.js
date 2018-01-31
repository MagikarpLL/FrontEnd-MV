define(['Editor', 'jquery'], function (Editor, $) {
    function EditorText() {
        this.textObj = {};
        this.color = '#ff7200';
    }

    EditorText.prototype = new Editor("EditorText");

    EditorText.prototype.add = function (container) {
        Editor.prototype.add.call(this, container);
    };

    EditorText.prototype.enter = function (stage, scene) {
        Editor.prototype.enter.call(this,stage,scene);
    };

    EditorText.prototype.onMouseMove = function (event) {

    };

    EditorText.prototype.onMouseClick = function (event) {

    };

    EditorText.prototype.onMouseDbClick = function (event) {

        $('#textInput').val('');
        $('#textInput').show();
        $('#textInput').css('top',event.offsetY);
        $('#textInput').css('left', event.offsetX);

        document.getElementById('textInput').focus();
        this.textObj.point = this.container.camera.airpointMouse(10, event.offsetX, event.offsetY);
    };

    EditorText.prototype.enterPress = function(event) {
        if (event.keyCode === 13) {
            var text = $('#textInput').val().trim();
            if(text === ''){

            }else{
                this.textObj.text = text;
                this.container.getLayer('LayerText').addText(this.textObj, this.color);
            }
            $('#textInput').hide();
            this.textObj = {};
        }
    };

    EditorText.prototype.exit = function (event) {
        Editor.prototype.exit.call(this);

        $('#textInput').hide();
        $('#textInput').text('');
        this.textObj = {};

    };

    EditorText.prototype.setColor = function (color) {
        $('#textInput').css('color',color);
        this.color = color;
    }

    return EditorText;
});