define(['EditorCamera', 'EditorClickScene', 'EditorDrawLine', 'EditorErase', 'EditorIcon', 'EditorDistance','EditorHeight','EditorArea','EditorText'], function (EditorCamera, EditorClickScene, EditorDrawLine, EditorErase, EditorIcon, EditorDistance,EditorHeight, EditorArea,EditorText) {
    return function (container) {
        container.addEditor(new EditorCamera());
        container.addEditor(new EditorClickScene());
        container.addEditor(new EditorDrawLine());
        container.addEditor(new EditorErase());
        container.addEditor(new EditorIcon());
        container.addEditor(new EditorDistance());
        container.addEditor(new EditorHeight());
        container.addEditor(new EditorArea());
        container.addEditor(new EditorText());
        //others
    };
});