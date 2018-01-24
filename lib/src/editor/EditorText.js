define(['Editor', 'THREE', 'measureUtils'], function (Editor, THREE, meausreUtils) {
    function EditorText() {
        this.textObj = {};
        this.color = $('#textInput').css('color');
    }

    EditorText.prototype = new Editor("EditorText");

    EditorText.prototype.add = function (container) {
        Editor.prototype.add.call(this, container);
    };

    EditorText.prototype.enter = function (stage, scene) {
        Editor.prototype.enter.call(this,stage,scene);
    }

    EditorText.prototype.onMouseMove = function (event) {

    };

    EditorText.prototype.onMouseClick = function (event) {

    }

    EditorText.prototype.onMouseDbClick = function (event) {

        $('#textInput').val('');
        $('#textInput').show();
        $('#textInput').css('top',event.clientY);
        $('#textInput').css('left', event.clientX);

        document.getElementById('textInput').focus();
        this.textObj.point =  meausreUtils.get3DPoint(event, this.container);
    };

    EditorText.prototype.enterPress = function(event) {
        if (event.keyCode === 13) {
            console.log('enter');
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
        $('#textInput').css('color','' + color);
        this.color = color;
    }

    return EditorText;
});