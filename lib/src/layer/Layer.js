define(['THREE'], function (THREE) {
    function Layer(name) {
        this.name = name;
        this.visible = false;
    }

    Layer.prototype = {
        add: function (container) {

            console.log('add');

            this.container = container;
            this.group = new THREE.Group();
            container.group.add(this.group);
            this.group.userData = this;

            console.log(this.container.group.children.length);
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