define(['Editor', 'THREE'], function (Editor, THREE) {
    function EditorIcon() {
        this.imagePath = '../res/img/icon/fireEngine-red.png';
    }

    EditorIcon.prototype = new Editor("EditorIcon");

    EditorIcon.prototype.add = function (container) {
        Editor.prototype.add.call(this, container);
    };

    EditorIcon.prototype.onMouseMove = function (event) {
        this.container.getLayer('LayerIcons').moveIcon(event.clientX, event.clientY);
    };
    
    EditorIcon.prototype.onMouseClick = function (event) {
        this.container.getLayer('LayerIcons').selectIcon(event.clientX, event.clientY);
    }

    EditorIcon.prototype.onMouseDbClick = function (event) {

        console.log( this.container.layerMap);

        this.container.getLayer('LayerIcons').addIcon(event.clientX, event.clientY, this.imagePath);
    };

    EditorIcon.prototype.setImage = function (imagePath) {
        this.imagePath = imagePath;
    };


    return EditorIcon;
});