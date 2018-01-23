define(['THREE'], function (THREE) {
    function Editor(name) {
        this.name = name ? name : "Editor";
    }

    Editor.prototype = {
        add: function (container) {
            this.container = container;
        },
        enter: function (stage, scene) {
            this.group = new THREE.Group();
            this.container.group.add(this.group);
        },
        onMouseDown: function () {

        },
        onMouseMove: function () {

        },
        onMouseUp: function () {

        },
        onMouseWheel: function () {
            
        },
        onMouseClick: function () {

        },
        onMouseDbClick: function () {
            
        },
        update: function (deltatime) {

        },
        exit: function () {
            this.container.group.remove(this.group)
        },
        remove: function () {

        },
    };

    return Editor;
});