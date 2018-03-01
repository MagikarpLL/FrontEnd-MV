define('ModeControl', ['jquery'], function ($) {

    var uiFolder = "resource/ids360Viewer/img/view/";
    var iconFolder = "resource/ids360Viewer/img/icon/";

    var modesByName = {};

    function ModeControl(container) {
        this.container = container;
        container.modeControl = this;
        this.mode = undefined;
        this.lastMode = undefined;
        this.modesByName = modesByName;
    }

    ModeControl.prototype.getMode = function (name) {
        return this.modesByName[name];
    };

    ModeControl.prototype.isMode = function (mode) {
        if (mode && typeof mode === 'string') mode = this.getMode(mode);
        if (!mode) return false;
        return this.mode === mode;
    };
    ModeControl.prototype.isSubMode = function (mode) {
        if (mode && typeof mode === 'string') mode = this.getMode(mode);
        if (!mode) return false;
        var currMode = this.mode;
        while (currMode) {
            if (currMode === mode) return true;
            currMode = currMode.parent;
        }
        return false;
    };

    ModeControl.prototype.setMode = function (mode) {
        if (mode && typeof mode === 'string') mode = this.getMode(mode);
        if (!mode) return false;
        if (this.mode === mode) return;
        this.lastMode = this.mode;
        var container = this.container;

        //TODO find nearest ancestor
        //exit to root
        while (this.mode) {
            if (this.mode.onExit) this.mode.onExit(container);
            this.mode = this.mode.parent;
        }
        this.mode = mode;
        //enter to mode
        var list = [];
        while (mode) {
            list.push(mode);
            mode = mode.parent;
        }
        list.reverse();
        list.forEach(function (mode) {
            if (mode.onEnter) mode.onEnter(container);
        });
    };

    function Mode(parent, name, onEnter, onExit) {
        this.parent = parent;
        this.onEnter = onEnter;
        this.onExit = onExit;
        this.name = name;
        modesByName[name] = this;
    }


    var outdoorMode = new Mode(null, 'outdoor', function (container) {
        container.getLayer('LayerSceneMap').show();
        $('#mainDiv').css('opacity', 0);
    }, function (container) {
    });


    var panoViewMode = new Mode(null, 'panoView', function (container) {
        container.getLayer('LayerSceneMap').hide();
        $('#mainDiv').css('opacity', 1);
        container.enterEditor("EditorCamera", "EditorClickScene", "EditorExternalClickable");
    }, function (container) {
    });


    var editMode = new Mode(panoViewMode, 'edit', function (container) {
        container.enterEditor();
        $("#editIcon").hide();
        $("#editPanel").show();
    }, function (container) {
        $("#editIcon").show();
        $("#editPanel").hide();
    });

    var editTextMode = new Mode(editMode, 'editText', function (container) {
        $('#textImg').attr('src', uiFolder + 'edit_textSelected.png');
        container.enterEditor('EditorText');
    }, function (container) {
        container.enterEditor();
        $('#textImg').attr('src', uiFolder + 'edit_text.png');
    });

    var editLineMode = new Mode(editMode, 'editLine', function (container) {
        container.enterEditor("EditorDrawLine");
        $('#lineImg').attr('src', uiFolder + 'edit_lineSelected.png');
    }, function (container) {
        container.enterEditor();
        $('#lineImg').attr('src', uiFolder + 'edit_line.png');
    });
    var editEraserMode = new Mode(editMode, 'editEraser', function (container) {
        container.enterEditor("EditorErase");
        $('#rubberImg').attr('src', uiFolder + 'edit_rubberSelected.png');
    }, function (container) {
        container.enterEditor();
        $('#rubberImg').attr('src', uiFolder + 'edit_rubber.png');
    });

    var editIconFiretruckMode = new Mode(editMode, 'editIconFiretruck', function (container) {
        $('#fireEngineImg').attr('src', uiFolder + 'edit_fireEngineSelected.png');
        container.enterEditor('EditorIcon');
        container.getEditor("EditorIcon").setImage(iconFolder + "fireEngine-red.png");
    }, function (container) {
        container.enterEditor();
        $('#fireEngineImg').attr('src', uiFolder + 'edit_fireEngine.png');
    });
    var editIconFirehydrantMode = new Mode(editMode, 'editIconFirehydrant', function (container) {
        $('#fireHydrantImg').attr('src', uiFolder + 'edit_fireHydrantSelected.png');
        container.enterEditor('EditorIcon');
        container.getEditor("EditorIcon").setImage(iconFolder + "fireHydrant-red.png");
    }, function (container) {
        container.enterEditor();
        $('#fireHydrantImg').attr('src', uiFolder + 'edit_fireHydrant.png');
    });
    var editIconWaterMode = new Mode(editMode, 'editIconWater', function (container) {
        $('#waterImg').attr('src', uiFolder + 'edit_waterSelected.png');
        container.enterEditor('EditorIcon');
        container.getEditor("EditorIcon").setImage(iconFolder + "water-red.png");
    }, function (container) {
        container.enterEditor();
        $('#waterImg').attr('src', uiFolder + 'edit_water.png');
    });


    var measureMode = new Mode(panoViewMode, 'measure', function (container) {
        container.enterEditor();
        $("#measureIcon").hide();
        $("#measurePanel").show();
    }, function (container) {
        $("#measureIcon").show();
        $("#measurePanel").hide();
    });
    var measureDistanceMode = new Mode(measureMode, 'measureDistance', function (container) {
        container.enterEditor("EditorDistance");
        $('#mainDiv').css('cursor', 'pointer');
        $('#distanceImg').attr('src', uiFolder + 'measure_distanceSelected.png');
    }, function (container) {
        container.enterEditor();
        $('#mainDiv').css('cursor', 'default');
        $('#distanceImg').attr('src', uiFolder + 'measure_distance.png');
    });
    var measureHeightMode = new Mode(measureMode, 'measureHeight', function (container) {
        container.enterEditor("EditorHeight");
        $('#mainDiv').css('cursor', 'pointer');
        $('#heightImg').attr('src', uiFolder + 'measure_heightSelected.png');
    }, function (container) {
        container.enterEditor();
        $('#mainDiv').css('cursor', 'default');
        $('#heightImg').attr('src', uiFolder + 'measure_height.png');
    });
    var measureAreaMode = new Mode(measureMode, 'measureArea', function (container) {
        container.enterEditor("EditorArea");
        $('#mainDiv').css('cursor', 'pointer');
        $('#areaImg').attr('src', uiFolder + 'measure_areaSelected.png');
    }, function (container) {
        container.enterEditor();
        $('#mainDiv').css('cursor', 'default');
        $('#areaImg').attr('src', uiFolder + 'measure_area.png');
    });

    var modelingMode = new Mode(panoViewMode, 'modeling', function (container) {
        container.enterEditor("EditorCamera");
        $("#modelingIcon").hide();
        $("#modelingPanel").show();
    }, function (container) {
        $("#modelingIcon").show();
        $("#modelingPanel").hide();
    });
    var modelingHeight = new Mode(modelingMode, 'modelingHeight', function (container) {
        container.getEditor("EditorBuildingShape").reset();
        container.enterEditor("EditorBuildingShape", "EditorCamera", "EditorClickScene");
        $('#modelingHeightImg').attr('src', uiFolder + 'modeling_heightSelected.png');
    }, function (container) {
        container.enterEditor();
        $('#modelingHeightImg').attr('src', uiFolder + 'modeling_height.png');
    });
    var modelingShape = new Mode(modelingMode, 'modelingShape', function (container) {
        container.enterEditor("EditorBuildingShape", "EditorCamera", "EditorClickScene");
        $('#modelingShapeImg').attr('src', uiFolder + 'modeling_shapeSelected.png');
    }, function (container) {
        container.enterEditor();
        $('#modelingShapeImg').attr('src', uiFolder + 'modeling_shape.png');
    });
    var modelingMesh = new Mode(modelingMode, 'modelingMesh', function (container) {
        container.enterEditor("EditorBuildingMesh", "EditorCamera", "EditorClickScene");
        $('#modelingMeshImg').attr('src', uiFolder + 'modeling_meshSelected.png');
    }, function (container) {
        container.enterEditor();
        $('#modelingMeshImg').attr('src', uiFolder + 'modeling_mesh.png');
    });

    return ModeControl;

});