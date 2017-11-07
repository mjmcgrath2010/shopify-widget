/*globals hapyak, $, hyWidget, Materialize */
'use strict';

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
                hyWidget.utils.reload('view');
            }, false);
        },
        ready = function () {
            var trgtEl,
                key;

            var config = hyWidget.config;

            if (config) {
                for (key in config) {
                    trgtEl = document.getElementById(key + '-value');

                    if (config[key].propertyType === 'display') {
                        trgtEl.checked = config[key].value;
                    } else {
                        trgtEl.innerText = config[key].value;
                    }
                }
            }

            hapyak.widget.player.pause();
            hyWidget.utils.tempFrameSize('100%', '50%');
            hyWidget.utils.display('#widget-body', true);
            hyWidget.utils.display('#edit-container', true);
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
        saveSettings = function () {
            /*
                Example input el:
                <input id="skip-value"
                    data-editId="skip-value" 
                    data-viewId="skip"
                    data-input-type="boolean"
                    data-property-type="display"
                    class="config" checked type="checkbox">
            */
            var config = hyWidget.utils.getAllValues('#edit-container input.config, #edit-container textarea.config');

            var baseProps = hyWidget.utils.getAllValues('#edit-container input.base-prop, #edit-container textarea.base-prop');

            baseProps && hyWidget.utils.setBaseProps(baseProps);
            config && hyWidget.utils.setConfig(config);
            hyWidget.utils.reload('view');
        };

    hyWidget.utils.onWidgetLoad(init);
}());
