/*globals hapyak, widgetLibrary */
'use strict';

(function () {
    var didSetup = false,
        inEditor = false,
        widgetData = null,
        init = function mainSetup (isEditMode, data) {
            widgetData = data;
            inEditor = widgetLibrary.mode === 'view' &&  hapyak.widget.player.isEditMode;

            if (widgetLibrary.mode === 'edit') {
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
                toggleBtn.style.display = isEditMode && widgetLibrary.mode === 'view' ? 'block' : 'none';
                toggleBtn.addEventListener('click', widgetLibrary.utils.reload, false);
            }
        },
        setup = function mainSetup () {
            setupToggle();

            if (didSetup) {
                return;
            }

            didSetup = true;
        },
        customLoad = function customLoadWhenReady() {
            /*
                Required to init widget load for both editor and viewer.
                Widgets may require unique events to occur before load, so this logic
                is executed on a per widget basis.
            */
            widgetLibrary.utils.startLoad();
        };

    widgetLibrary.utils.onWidgetLoad(init);
    hapyak.context.addEventListener('annotationload', customLoad, false);
}());
