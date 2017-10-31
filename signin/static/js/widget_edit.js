(function () {
    var init = function (isEditMode, data) {
            var saveBtn = document.getElementById('save-widget-config'),
                cancelBtn = document.getElementById('cancel-widget-config');

            if (!hapyak.widget.player.isEditMode || hyWidget.mode !== 'edit') {  // `true` should have another var set
                return;
            }

            hapyak.context.quickedit.doubleClick.disable();
            player.pause();

            initMaterialize();
            saveBtn && saveBtn.addEventListener('click', function () {
                saveSettings();
            }, false);
            cancelBtn && cancelBtn.addEventListener('click', function () {
                widgetUtils.reload('view');
            }, false);
        },
        setupDefaults = function () {
            // widgetUtils.setBaseProp('precondition', '!loginComplete');
            // widgetUtils.setBaseProp('top', '0%');
            // widgetUtils.setBaseProp('left', '0%');
        },
        ready = function () {
            setupDefaults();
            widgetUtils.display('#widget-body', true);
            widgetUtils.display('#edit-container', true);
        },
        initMaterialize = function () {
            var init = function () {
                Materialize.updateTextFields && Materialize.updateTextFields();
                ready();
            };

            if (Materialize && Materialize.updateTextFields) {
                init();
                return;
            }
            
            $(document).ready(function() {
                init();
            });
        },
        saveSettings = function (baseProps, config) {
            baseProps && widgetUtils.setBaseProps(baseProps);
            config && widgetUtils.setConfig(config);
            widgetUtils.reload('view');
        };

    widgetUtils.onWidgetLoad(init);
}());
