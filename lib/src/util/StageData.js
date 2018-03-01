define('StageData', ['threeUtil'], function (threeUtil) {

    function StageData(container) {
        this.container = container;
        this.stage = null;
        this.data = null;
        this.selected = null;
    }

    StageData.prototype.setStage = function (stage) {
        if (this.stage !== stage) {
            this.selectStageData(-1);
        }
        this.stage = stage;
        this.data = this.stage.data = this.stage.data || [];
        this.selected = null;
    };

    StageData.prototype.getAll = function () {
        return this.data || [];
    };

    StageData.prototype.addStageData = function (low, high, lng, lat) {
        if (!this.stage) return;

        var points = [
            [lng + 0.0000, lat + 0.0000],
            [lng + 0.0001, lat + 0.0000],
            [lng + 0.0001, lat + 0.0001],
            [lng + 0.0000, lat + 0.0001],
        ];
        var shape = {
            low: low,
            high: high,
            points: points,
        };
        var mesh = threeUtil.pointListToMeshData(points, low, high);
        var pack = {low: low, high: high, shape: shape, mesh: mesh};
        this.data.push(pack);

        this.getReceivers().forEach(function (target) {
            target.addStageData(pack);
        });

        this.selectStageData(this.data.length - 1);
    };

    StageData.prototype.removeStageData = function (index) {
        if (this.selected === this.data[index]) {
            this.selectStageData(-1);
        }
        this.data.splice(index, 1);
        this.getReceivers().forEach(function (target) {
            target.reloadAllStageData(); //TODO implement removeStageData method
        });
    };

    StageData.prototype.selectStageData = function (index) {
        if (index >= 0 && this.data[index] === this.selected) {
            index = -1;
        }
        this.selected = index >= 0 ? this.data[index] : null;
        var selected = this.selected;
        this.getReceivers().forEach(function (target) {
            target.selectStageData(selected);
        });
    };

    StageData.prototype.reloadStageData = function (pack, sender) {
        this.getReceivers().forEach(function (target) {
            if (target !== sender) {
                target.reloadStageData(pack);
            }
        });
    };

    StageData.prototype.getReceivers = function () {
        var result = [
            this.container.getLayer('LayerSceneMap'),
            this.container.getLayer('LayerSceneMapOverlay'),
            this.container.getLayer('LayerModelingList'),
        ];
        var editorShape = this.container.getCurrentEditor('EditorBuildingShape');
        var editorMesh = this.container.getCurrentEditor('EditorBuildingMesh');
        if (editorShape) result.push(editorShape);
        if (editorMesh) result.push(editorMesh);
        return result;
    };

    return StageData;
});