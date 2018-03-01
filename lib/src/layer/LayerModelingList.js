define('LayerModelingList', ['jquery', 'Layer'], function ($, Layer) {

    function LayerModelingList() {

    }
    LayerModelingList.prototype = new Layer("LayerModelingList");

    LayerModelingList.prototype.load = function (stage, scene) {
        this.reloadAllStageData();
    };

    LayerModelingList.prototype.reloadAllStageData = function () {
        $('#modelingList').empty();

        var packs = this.container.stageData.getAll();
        for (var i = 0; i < packs.length; i++) {
            var pack = packs[i];
            if (this.container.stageData.selected !== pack) {
                $('#modelingList').append(
                    '<div>' +
                    '<div class="modelingListItem modelingListItemText" onclick="selectModelingListItem(' + i + ')">' + (~~pack.high) + '米</div>\n' +
                    '<img class="modelingListItemRemoveButton" src="resource/ids360Viewer/img/view/backEdit.png" onclick="removeModelingListItem(' + i + ')">\n' +
                    '</div>'
                );
            } else {
                $('#modelingList').append(
                    '<div>' +
                    '<div class="modelingListItem modelingListItemTextSelected" onclick="selectModelingListItem(' + i + ')">' + (~~pack.high) + '米</div>\n' +
                    '<img class="modelingListItemRemoveButton" src="resource/ids360Viewer/img/view/backEdit.png" onclick="removeModelingListItem(' + i + ')">\n' +
                    '</div>'
                );
            }
        }
    };
    LayerModelingList.prototype.addStageData = function (pack) {
        this.reloadAllStageData();
    };
    LayerModelingList.prototype.selectStageData = function (pack) {
        this.reloadAllStageData();
    };
    LayerModelingList.prototype.reloadStageData = function () {

    };

    LayerModelingList.prototype.unload = function (stage, scene) {
    };

    return LayerModelingList;
});