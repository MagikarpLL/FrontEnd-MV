define(['LayerPano', 'LayerSceneIcon', 'LayerLines','LayerAmap', 'LayerIcons','LayerDistance'], function (LayerPano, LayerSceneIcon, LayerLines, LayerAmap, LayerIcons, LayerDistance) {
    return function (container) {
        container.addLayer(new LayerPano());
        container.addLayer(new LayerSceneIcon());
        container.addLayer(new LayerLines());
        container.addLayer(new LayerAmap());
        container.addLayer(new LayerIcons());
        container.addLayer(new LayerDistance());
        //others
    };
});