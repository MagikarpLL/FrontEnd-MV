define(['EditorCamera', 'EditorClickScene', 'EditorDrawLine', 'EditorErase'], function (EditorCamera, EditorClickScene, EditorDrawLine, EditorErase) {
    return function (container) {
        container.addEditor(new EditorCamera());
        container.addEditor(new EditorClickScene());
        container.addEditor(new EditorDrawLine());
        container.addEditor(new EditorErase());
        //others
    };
});