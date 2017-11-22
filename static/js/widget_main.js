/*globals hapyak */
'use strict';

(function () {
    var didSetup = false,
        inEditor = false,
        widgetData = null,
        getLibrary = function getLibrary () {
            return hapyak && hapyak.widget && hapyak.widget.library || {};
        },
        init = function mainSetup (isEditMode, data) {
            widgetData = data;
            inEditor = getLibrary().mode === 'view' &&  hapyak.widget.player.isEditMode;

            if (getLibrary().mode === 'edit') {
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
                toggleBtn.style.display = isEditMode && getLibrary().mode === 'view' ? 'block' : 'none';
                toggleBtn.addEventListener('click', getLibrary().utils.reload, false);
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
            getLibrary().utils.startLoad();
        };

    getLibrary().utils.onWidgetLoad(init);
    hapyak.context.addEventListener('annotationload', customLoad, false);
}());
