define([
    'EditorCamera',
    'EditorClickScene',
    'EditorDrawLine',
    'EditorErase',
    'EditorIcon',
    'EditorDistance',
    'EditorHeight',
    'EditorArea',
    'EditorText',
    'EditorExternalClickable',
    'EditorBuildingShape',
    'EditorBuildingMesh',
], function () {
    var editorConstructors = arguments;
    return function (container) {
        if (editorConstructors.length) {
            for (var i = 0; i < editorConstructors.length; i++) {
                var EditorConstructor = editorConstructors[i];
                container.addEditor(new EditorConstructor());
            }
        }
    };
});