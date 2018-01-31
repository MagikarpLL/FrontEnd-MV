define(['THREE', 'Layer'], function (THREE, Layer) {
    function LayerCompass() {
        this.gaodeMap = undefined;
    }

    LayerCompass.prototype = new Layer("LayerCompass");

    LayerCompass.prototype.add = function (container) {
        Layer.prototype.add.call(this, container);

        this.w = 50;
        this.h = 50;

        this.spriteBg_ = null;
        this.spritePt_ = null;
        this.materialPt_ = null;
        this.materialBg_ = null;
    };

    LayerCompass.prototype.tryLoadResources = function () {
        if (!this.spriteBg_ && !this.spritePt_) {
            var bgImg = document.createElement("img");
            bgImg.src = "data:image/png;base64,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";
            var bgTexture = new THREE.Texture(bgImg);
            var vecImg = document.createElement("img");
            vecImg.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAACXBIWXMAAAsTAAALEwEAmpwYAAA4JGlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMwNjcgNzkuMTU3NzQ3LCAyMDE1LzAzLzMwLTIzOjQwOjQyICAgICAgICAiPgogICA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPgogICAgICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgICAgICAgICB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iCiAgICAgICAgICAgIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIKICAgICAgICAgICAgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIgogICAgICAgICAgICB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIKICAgICAgICAgICAgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIKICAgICAgICAgICAgeG1sbnM6dGlmZj0iaHR0cDovL25zLmFkb2JlLmNvbS90aWZmLzEuMC8iCiAgICAgICAgICAgIHhtbG5zOmV4aWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vZXhpZi8xLjAvIj4KICAgICAgICAgPHhtcDpDcmVhdG9yVG9vbD5BZG9iZSBQaG90b3Nob3AgQ0MgMjAxNSAoV2luZG93cyk8L3htcDpDcmVhdG9yVG9vbD4KICAgICAgICAgPHhtcDpDcmVhdGVEYXRlPjIwMTctMDctMTFUMTE6MDg6MTErMDg6MDA8L3htcDpDcmVhdGVEYXRlPgogICAgICAgICA8eG1wOk1vZGlmeURhdGU+MjAxNy0wNy0yMFQxODoyNDoxNiswODowMDwveG1wOk1vZGlmeURhdGU+CiAgICAgICAgIDx4bXA6TWV0YWRhdGFEYXRlPjIwMTctMDctMjBUMTg6MjQ6MTYrMDg6MDA8L3htcDpNZXRhZGF0YURhdGU+CiAgICAgICAgIDxkYzpmb3JtYXQ+aW1hZ2UvcG5nPC9kYzpmb3JtYXQ+CiAgICAgICAgIDxwaG90b3Nob3A6Q29sb3JNb2RlPjM8L3Bob3Rvc2hvcDpDb2xvck1vZGU+CiAgICAgICAgIDx4bXBNTTpJbnN0YW5jZUlEPnhtcC5paWQ6ZjNmNGRiOGYtMGJiZS1lZjRkLWJjYTEtZDM2MGU1Njg3ZGU4PC94bXBNTTpJbnN0YW5jZUlEPgogICAgICAgICA8eG1wTU06RG9jdW1lbnRJRD54bXAuZGlkOmYzZjRkYjhmLTBiYmUtZWY0ZC1iY2ExLWQzNjBlNTY4N2RlODwveG1wTU06RG9jdW1lbnRJRD4KICAgICAgICAgPHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD54bXAuZGlkOmYzZjRkYjhmLTBiYmUtZWY0ZC1iY2ExLWQzNjBlNTY4N2RlODwveG1wTU06T3JpZ2luYWxEb2N1bWVudElEPgogICAgICAgICA8eG1wTU06SGlzdG9yeT4KICAgICAgICAgICAgPHJkZjpTZXE+CiAgICAgICAgICAgICAgIDxyZGY6bGkgcmRmOnBhcnNlVHlwZT0iUmVzb3VyY2UiPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6YWN0aW9uPmNyZWF0ZWQ8L3N0RXZ0OmFjdGlvbj4KICAgICAgICAgICAgICAgICAgPHN0RXZ0Omluc3RhbmNlSUQ+eG1wLmlpZDpmM2Y0ZGI4Zi0wYmJlLWVmNGQtYmNhMS1kMzYwZTU2ODdkZTg8L3N0RXZ0Omluc3RhbmNlSUQ+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDp3aGVuPjIwMTctMDctMTFUMTE6MDg6MTErMDg6MDA8L3N0RXZ0OndoZW4+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDpzb2Z0d2FyZUFnZW50PkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE1IChXaW5kb3dzKTwvc3RFdnQ6c29mdHdhcmVBZ2VudD4KICAgICAgICAgICAgICAgPC9yZGY6bGk+CiAgICAgICAgICAgIDwvcmRmOlNlcT4KICAgICAgICAgPC94bXBNTTpIaXN0b3J5PgogICAgICAgICA8dGlmZjpPcmllbnRhdGlvbj4xPC90aWZmOk9yaWVudGF0aW9uPgogICAgICAgICA8dGlmZjpYUmVzb2x1dGlvbj43MjAwMDAvMTAwMDA8L3RpZmY6WFJlc29sdXRpb24+CiAgICAgICAgIDx0aWZmOllSZXNvbHV0aW9uPjcyMDAwMC8xMDAwMDwvdGlmZjpZUmVzb2x1dGlvbj4KICAgICAgICAgPHRpZmY6UmVzb2x1dGlvblVuaXQ+MjwvdGlmZjpSZXNvbHV0aW9uVW5pdD4KICAgICAgICAgPGV4aWY6Q29sb3JTcGFjZT42NTUzNTwvZXhpZjpDb2xvclNwYWNlPgogICAgICAgICA8ZXhpZjpQaXhlbFhEaW1lbnNpb24+NjQ8L2V4aWY6UGl4ZWxYRGltZW5zaW9uPgogICAgICAgICA8ZXhpZjpQaXhlbFlEaW1lbnNpb24+NjQ8L2V4aWY6UGl4ZWxZRGltZW5zaW9uPgogICAgICA8L3JkZjpEZXNjcmlwdGlvbj4KICAgPC9yZGY6UkRGPgo8L3g6eG1wbWV0YT4KICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAKPD94cGFja2V0IGVuZD0idyI/PvD4yuUAAAAgY0hSTQAAeiUAAICDAAD5/wAAgOkAAHUwAADqYAAAOpgAABdvkl/FRgAABUpJREFUeNrkm19sFEUcx78zO7fbXv+3HAV5oGnUFvljQmKMMRhM/BMjkBo9qX/AQJ9NUOubTwUtWlKDiSb6YKvEeEQt1gjGh/JA6IvQkJg0CFZBaVpoe8Xr9dr7tzM+XI9e29tjCzuzd2WSS253Z2dmP/P7/eb7m7slQgg4VX48ftxWvReam3EiEGBbtm6dXF9fP8gYewpAZDl9OTVuCvfK85zzMgBbBgYGNrs1FjcBtBBKITjXGxoaXgLguWcAnAgE1gB4TqMUXAhmGIbf7/eX3EsW8AYAlj4ghKzu7OzcnnluJQMgAPYBgMZSz8s5130+X7MbbuAGgMcBNMzNfDqiU8bYM11dXbVzgFY0gP0Wy1pxU1PTLtVWoBpAGQB/+oB55p+Vc657vd7XVjqA3QBKM4NBZtE0bZNqTUBdNX+yEAHn3FCtCVQC2ADgscwTjLHFcUAzDONllZqAujb7VmskIT6VmkAVAA+AvUs6p0u756ZpqNQEqgDsALDaDgABEJWaQBWAlmWmul5VmkAFgPsAPJvtgsayuznn3OP1el9fKQD2WgU0SqwtXNO0jSo0gWwAxG70z2IFSjSBbADbADxgdTFTCmeJA5phGLtlawLZAFru0nykawKZAMoBvJhD8NhxA93n870i0w1kAmgGYGm+VitAFk3wtExNIBPAficaka0JZAHYBODRnB1Te13PaYI9hQZg3+0qaJpmuzGZmkAGAB3AHicb5JwbjY2NUjSBDAA7AfictAAhBNV1XYomkAHAbt6fF5rAaQDrrBIfB9xAiiYgTv46fOPkoTOzXN+2eDHP9p1SgnLjIkxzej4xIgSEEFDMfwchoISAUA3UY8Taeosebu84elk4NHBHzanovz+StcmxjIcViwCIhddqzwPGVE4ldOt+E5gJrw23d4yOL8KaPwAqguffQyzcnxWAyACQPlE9Cxj22x+bNLoAzOStCwAAPqi6CMEbcwJIX9scBcpNezHA9JhPtIr6/sHktdTCkK9/kKCeLhlBcDpSc6F/MBly0vzlANC9xwAknW72whV2xGnzlwPg7aujINovTjaZiJWFt787fBpAojByAWbYcwObxhycqvpZxuzLA6CXngTI+G3r2Yh/QlDx2anQYQCzhQPgwJ9xUHbMiaZmZ2quHPwmdA0AL6wNEU9xtxPN/DtR/IUs85ejAzLL+5W/gfNHLHXAhihQbe0HZqIosebV6PqJEEazZIh5bgEAoOl3pQmmIjVnJ0KYljlEuQA83gBAond6e9/v5mGZ5i8fwDtXb4JqPdY2br0nEItWTvgPXR+wt1bkK4CUJrijYDgeqvhO9uyrAaCX9QHkn+VtfjBx4PPrRwBECx/AW5c5NM9Xy7klMlMz+MPZWNDpxMcdAPOawPbDXBrWj8pSfmp1QGY5WHka3HxygQ54MAb4FiaOiXjJrL4jUgdgLLdELrQXJjTjy6XOvrRaKFL1q4rgpx6AXtIDkIUbgJwsmlWCwJlY+8oE0Pr3DKj2ba4q0Wj18Jufjg/JSnzcBQAArCinJhgJlnarnH21QTBd2ioGwflDgADq48Da1CYPN3WzoSVeNzSCYVt7KQX71pjFpmk4surc0AimlA9HOQCLTdNzQ+Qj1ebvjgsAQFtlL3hyF+qSwLoY4rHykLFz6n4AE3abKOwXJ9mcJqCpn8iD4apeN2bfPQB66SkQOgaqQwhNdHw/+aEq6ZsfAFr/SoAVfQ1mIBFfdenjnvCIisQnfwAAgLe6G55iBMMln7g1+7eCiRsfABA/beyrrUKJm+N28+VpQCf+GzfdCX7p8v8A9QdtLPP+wngAAAAASUVORK5CYII=";
            var vecTexture = new THREE.Texture(vecImg);
            bgTexture.needsUpdate = true;
            vecTexture.needsUpdate = true;
            this.materialBg_ = new THREE.SpriteMaterial({
                map: bgTexture
            });
            this.spriteBg_ = new THREE.Sprite(this.materialBg_);
            this.spriteBg_.scale.set(this.w, this.h, 1);
            this.materialPt_ = new THREE.SpriteMaterial({
                map: vecTexture
            });
            this.spritePt_ = new THREE.Sprite(this.materialPt_);
            this.spritePt_.scale.set(this.w, this.h, 1);
            this.container.groupOrtho.add(this.spriteBg_);
            this.container.groupOrtho.add(this.spritePt_);
        }
    };

    LayerCompass.prototype.update = function (deltatime) {
        LayerCompass.prototype.tryLoadResources.call(this);

        this.materialPt_.rotation = -this.container.camera.lng * Math.PI / 180 + Math.PI;

        var halfWidth = this.container.width / 2;
        var halfHeight = this.container.height / 2;
        var offset = [20, 20];
        this.spriteBg_.position.set(
            -halfWidth + this.w / 2 + offset[0],
            halfHeight - this.h / 2 - offset[1],
            .5
        );
        this.spritePt_.position.set(
            -halfWidth + this.w / 2 + offset[0],
            halfHeight - this.h / 2 - offset[1],
            1
        );
    };

    return LayerCompass;
});