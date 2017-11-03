(function () {
    var didSetup = false,
        inEditor = false,
        widgetData = null,
        init = function (isEditMode, data) {
            widgetData = data;
            inEditor = hyWidget.mode === 'view' &&  hapyak.widget.player.isEditMode;

            if (hyWidget.mode === 'edit') {
                return;
            }

            if (inEditor) {
                setup();
            }
        },
        setupToggle = function () {
            // Toggle for editing/viewing in hy edit mode
            var toggleBtn = document.getElementById('change-mode'),
                isEditMode = hapyak.widget.player.isEditMode;

            if (toggleBtn) {
                toggleBtn.style.display = isEditMode && hyWidget.mode === 'view' ? 'block' : 'none';
                toggleBtn.addEventListener('click', widgetUtils.reload, false);
            }
        },
        setup = function () {
            // Props are available in `widgetData`
            setupToggle();

            if (didSetup) {
                return;
            }

            didSetup = true;
        };

    widgetUtils.onWidgetLoad(init);
}());
