/*globals hapyak, hyWidget */
'use strict';

(function () {
    var didSetup = false,
        inEditor = false,
        widgetData = null,
        init = function mainSetup (isEditMode, data) {
            widgetData = data;
            inEditor = hyWidget.mode === 'view' &&  hapyak.widget.player.isEditMode;

            if (hyWidget.mode === 'edit') {
                return;
            }

            if (inEditor) {
                setup();
            }
        },
        setupToggle = function mainSetupToggle () {
            // Toggle for editing/viewing in hy edit mode
            var toggleBtn = document.getElementById('change-mode'),
                isEditMode = hapyak.widget.player.isEditMode;

            if (toggleBtn) {
                toggleBtn.style.display = isEditMode && hyWidget.mode === 'view' ? 'block' : 'none';
                toggleBtn.addEventListener('click', hyWidget.utils.reload, false);
            }
        },
        setup = function mainSetup () {
            // Props are available in `widgetData`
            setupToggle();

            if (didSetup) {
                return;
            }

            didSetup = true;
        };

    hyWidget.utils.onWidgetLoad(init);
}());
