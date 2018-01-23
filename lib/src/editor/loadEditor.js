define(['EditorCamera', 'EditorClickScene', 'EditorDrawLine', 'EditorErase', 'EditorIcon', 'EditorDistance'], function (EditorCamera, EditorClickScene, EditorDrawLine, EditorErase, EditorIcon, EditorDistance) {
    return function (container) {
        container.addEditor(new EditorCamera());
        container.addEditor(new EditorClickScene());
        container.addEditor(new EditorDrawLine());
        container.addEditor(new EditorErase());
        container.addEditor(new EditorIcon());
        container.addEditor(new EditorDistance());
        //others
    };
});