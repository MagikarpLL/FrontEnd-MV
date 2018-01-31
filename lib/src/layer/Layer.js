define(['THREE'], function (THREE) {
    function Layer(name) {
        this.name = name;
        this.visible = false;
    }

    Layer.prototype = {
        add: function (container) {
            this.container = container;
            this.group = new THREE.Group();
            container.group.add(this.group);
            this.group.userData = this;
        },
        load: function (stage, scene) {
            this.scene = scene;
        },
        show: function () {
            this.visible = true;
            this.group.visible = true;
        },
        hide: function () {
            this.visible = false;
            this.group.visible = false;
        },
        update: function (deltatime) {

        },
        isVisible: function () {
            return this.visible;
        },
        unload: function () {

        },
        remove: function () {
            this.container.group.remove(this.group)
        },
    };

    return Layer;
});