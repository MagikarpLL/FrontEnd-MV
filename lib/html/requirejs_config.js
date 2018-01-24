require.config({
    paths: {
        //lib
        'THREE': '../lib/three',
        'jquery': '../lib/jquery-3.2.1.min',
        'colorPicker': '../lib/colorpicker',
        'mCustomScrollBar': '../lib/jquery.mCustomScrollbar.min',
        'md5': '../lib/md5',
        'amap':'../lib/amap',

        //main
        'ids360Viewer': '../src/ids360Viewer',

        //map
        'SceneMap': '../src/map/SceneMap',

        //container
        'Container': '../src/container/Container',
        'Camera': '../src/container/Camera',
        //layer
        'loadLayer': '../src/layer/loadLayer',
        'Layer': '../src/layer/Layer',
        'LayerPano': '../src/layer/LayerPano',
        'LayerSceneIcon': '../src/layer/LayerSceneIcon',
        'LayerLines': '../src/layer/LayerLines',
        'LayerAmap': '../src/layer/LayerAmap',
        'LayerIcons': '../src/layer/LayerIcons',
        'LayerDistance': '../src/layer/LayerDistance',
        'LayerHeight': '../src/layer/LayerHeight',
        'LayerArea': '../src/layer/LayerArea',
        'LayerText': '../src/layer/LayerText',

        //editor
        'loadEditor': '../src/editor/loadEditor',
        'Editor': '../src/editor/Editor',
        'EditorCamera': '../src/editor/EditorCamera',
        'EditorClickScene': '../src/editor/EditorClickScene',
        'EditorDrawLine': '../src/editor/EditorDrawLine',
        'EditorErase': '../src/editor/EditorErase',
        'EditorIcon': '../src/editor/EditorIcon',
        'EditorDistance': '../src/editor/EditorDistance',
        'EditorHeight': '../src/editor/EditorHeight',
        'EditorArea': '../src/editor/EditorArea',
        'EditorText': '../src/editor/EditorText',

        //util
        'database': '../src/util/database',
        'utils': '../src/util/utils',
        'measureUtils': '../src/util/measureUtils',
    },
    shim:{
        colorPicker:{
            deps:[],
            exports: 'ColorPicker'
        },
        amap:{
            deps:[],
            exports: 'AMap'
        }
    },
});