define([
    'LayerPano',
    'LayerSceneIcon',
    'LayerLines',
    'LayerAmap',
    'LayerIcons',
    'LayerDistance',
    'LayerHeight',
    'LayerArea',
    'LayerText',
    'LayerSceneList',
    'LayerSceneMap',
    'LayerSceneMapOverlay',
    'LayerExternalData',
    'LayerCompass',
    'LayerModelingList',
], function () {
    var layerConstructors = arguments;
    return function (container) {
        if (layerConstructors.length) {
            for (var i = 0; i < layerConstructors.length; i++) {
                var LayerConstructor = layerConstructors[i];
                container.addLayer(new LayerConstructor());
            }
        }
    };
});