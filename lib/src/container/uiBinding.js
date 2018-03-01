define('uiBinding', ['jquery', 'database'], function ($, database) {
    return function (modeControl, contaienr) {
        var bindMode = function (element, mode) {
            mode = modeControl.getMode(mode);
            if (!mode) debugger;
            element.click(function (ev) {
                modeControl.setMode(mode);
                ev.stopPropagation();
            });
        };

        $('#switchLayer').click(function (ev) {
            if (modeControl.isSubMode('panoView')) {
                modeControl.setMode('outdoor');
            } else {
                modeControl.setMode(modeControl.lastMode || 'panoView');
            }
            ev.stopPropagation();
        });

        bindMode($("#editIcon"), 'edit');
        bindMode($('#lineImg'), 'editLine');
        bindMode($('#rubberImg'), 'editEraser');
        bindMode($('#textImg'), 'editText');
        bindMode($('#fireEngineImg'), 'editIconFiretruck');
        bindMode($('#fireHydrantImg'), 'editIconFirehydrant');
        bindMode($('#waterImg'), 'editIconWater');
        bindMode($("#backEditImg"), 'panoView');

        bindMode($("#measureIcon"), 'measure');
        bindMode($("#distanceImg"), 'measureDistance');
        bindMode($("#heightImg"), 'measureHeight');
        bindMode($("#areaImg"), 'measureArea');
        bindMode($("#backMeasureImg"), 'panoView');

        bindMode($("#modelingIcon"), 'modeling');
        bindMode($("#modelingHeightImg"), 'modelingHeight');
        bindMode($("#modelingShapeImg"), 'modelingShape');
        bindMode($("#modelingMeshImg"), 'modelingMesh');
        bindMode($("#backModelingImg"), 'panoView');
    };
});