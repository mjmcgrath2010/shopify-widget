(function () {
    var init = function (isEditMode, data) {
            var saveBtn = document.getElementById('save-widget-config'),
                cancelBtn = document.getElementById('cancel-widget-config');

            if (!hapyak.widget.player.isEditMode || hyWidget.mode !== 'edit') {
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
            var trgtEl;

            setupDefaults();

            if (widgetConfig) {
                for (key in widgetConfig) {
                    trgtEl = document.getElementById(key + '-value');

                    if (widgetConfig[key].propertyType === 'display') {
                        trgtEl.checked = widgetConfig[key].value
                    } else {
                        trgtEl.innerText = widgetConfig[key].value;
                    }
                }
            }

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

            baseProps && widgetUtils.setBaseProps(baseProps);
            config && widgetUtils.setConfig(config);
            widgetUtils.reload('view');
        };

    widgetUtils.onWidgetLoad(init);
}());
