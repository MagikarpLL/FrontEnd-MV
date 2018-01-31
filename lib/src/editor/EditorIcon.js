define(['Editor', 'THREE'], function (Editor, THREE) {
    function EditorIcon() {
        this.imagePath = 'resource/ids360Viewer/img/icon/fireEngine-red.png';
    }

    EditorIcon.prototype = new Editor("EditorIcon");

    EditorIcon.prototype.add = function (container) {
        Editor.prototype.add.call(this, container);
    };

    EditorIcon.prototype.onMouseMove = function (event) {
        this.container.getLayer('LayerIcons').moveIcon(event.offsetX, event.offsetY);
    };
    
    EditorIcon.prototype.onMouseClick = function (event) {
        this.container.getLayer('LayerIcons').selectIcon(event.offsetX, event.offsetY);
    };

    EditorIcon.prototype.onMouseDbClick = function (event) {
        this.container.getLayer('LayerIcons').addIcon(event.offsetX, event.offsetY, this.imagePath);
    };

    EditorIcon.prototype.setImage = function (imagePath) {
        this.imagePath = imagePath;
    };


    return EditorIcon;
});