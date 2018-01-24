define(['LayerPano', 'LayerSceneIcon', 'LayerLines','LayerAmap', 'LayerIcons','LayerDistance','LayerHeight','LayerArea','LayerText'], function (LayerPano, LayerSceneIcon, LayerLines, LayerAmap, LayerIcons, LayerDistance,LayerHeight, LayerArea, LayerText) {
    return function (container) {
        container.addLayer(new LayerPano());
        container.addLayer(new LayerSceneIcon());
        container.addLayer(new LayerLines());
        container.addLayer(new LayerAmap());
        container.addLayer(new LayerIcons());
        container.addLayer(new LayerDistance());
        container.addLayer(new LayerHeight());
        container.addLayer(new LayerArea());
        container.addLayer(new LayerText());
        //others
    };
});