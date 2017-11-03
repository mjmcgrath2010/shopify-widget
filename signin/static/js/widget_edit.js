(function () {
    var init = function (isEditMode, data) {
            var saveBtn = document.getElementById('save-widget-config'),
                cancelBtn = document.getElementById('cancel-widget-config');

            if (!hapyak.widget.player.isEditMode || hyWidget.mode !== 'edit') {
                return;
            }

            hapyak.context.quickedit.doubleClick.disable();

            initMaterialize();
            saveBtn && saveBtn.addEventListener('click', function () {

                saveSettings();
            }, false);
            cancelBtn && cancelBtn.addEventListener('click', function () {
                widgetUtils.reload('view');
            }, false);
        },
        ready = function () {
            var trgtEl;
            var config = hyWidget.config;

            if (config) {
                for (key in config) {
                    trgtEl = document.getElementById(key + '-value');

                    if (config[key].propertyType === 'display') {
                        trgtEl.checked = config[key].value
                    } else {
                        trgtEl.innerText = config[key].value;
                    }
                }
            }

            player && player.pause();
            widgetUtils.tempFrameSize('100%', '50%');
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
            /*
                Example input el:
                <input id="skip-value"
                    data-editId="skip-value" 
                    data-viewId="skip"
                    data-input-type="boolean"
                    data-property-type="display"
                    class="config" checked type="checkbox">
            */
            var config = widgetUtils.getAllValues('#edit-container input.config, #edit-container textarea.config');

            var baseProps = widgetUtils.getAllValues('#edit-container input.base-prop, #edit-container textarea.base-prop');

            baseProps && widgetUtils.setBaseProps(baseProps);
            config && widgetUtils.setConfig(config);
            widgetUtils.reload('view');
        };

    widgetUtils.onWidgetLoad(init);
}());
