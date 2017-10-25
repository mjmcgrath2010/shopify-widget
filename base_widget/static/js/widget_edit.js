(function () {
    var init = function (isEditMode, data) {
            if (!isEditMode) {
                return;
            }

            hapyak.context.quickedit.doubleClick.disable();
            player.pause();

            initMaterialize();
        },
        ready = function () {
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
        };

    widgetUtils.onWidgetLoad(init);
}());
