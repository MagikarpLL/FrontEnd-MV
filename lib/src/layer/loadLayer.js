define(['LayerPano', 'LayerSceneIcon', 'LayerLines'], function (LayerPano, LayerSceneIcon, LayerLines) {
    return function (container) {
        container.addLayer(new LayerPano());
        container.addLayer(new LayerSceneIcon());
        container.addLayer(new LayerLines());
        //others
    };
});