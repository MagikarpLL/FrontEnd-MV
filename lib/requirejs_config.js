require.config({
    paths: {
        //lib
        'THREE': 'lib/three',
        'jquery': 'lib/jquery-3.2.1.min',

        //main
        'ids360Viewer': 'src/ids360Viewer',

        //container
        'Container': 'src/container/Container',
        'Camera': 'src/container/Camera',
        //layer
        'loadLayer': 'src/layer/loadLayer',
        'Layer': 'src/layer/Layer',
        'LayerPano': 'src/layer/LayerPano',
        'LayerSceneIcon': 'src/layer/LayerSceneIcon',
        'LayerLines': 'src/layer/LayerLines',
        //editor
        'loadEditor': 'src/editor/loadEditor',
        'Editor': 'src/editor/Editor',
        'EditorCamera': 'src/editor/EditorCamera',
        'EditorClickScene': 'src/editor/EditorClickScene',
        'EditorDrawLine': 'src/editor/EditorDrawLine',
        'EditorErase': 'src/editor/EditorErase',

        //util
        'database': 'src/util/database',
        'lnglat': 'src/util/lnglat',
    },
});