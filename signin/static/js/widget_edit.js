/*globals hapyak, $, hyWidget, Materialize */
'use strict';

(function () {
    var init = function editInit (isEditMode, data) {
            var saveBtn = document.getElementById('save-widget-config'),
                cancelBtn = document.getElementById('cancel-widget-config');

            hapyak.context.quickedit.doubleClick.disable();

            if (!hapyak.widget.player.isEditMode || hyWidget.mode !== 'edit') {
                return;
            }

            initMaterialize();
            saveBtn && saveBtn.addEventListener('click', saveSettings, false);
            cancelBtn && cancelBtn.addEventListener('click', function cancelAndReload () {
                hyWidget.utils.reload('view');
            }, false);
        },
        ready = function editReady () {
            var config = hyWidget.config;

            var trgtEl,
                key;

            if (config) {
                for (key in config) {
                    if (config.hasOwnProperty(key)) {
                        trgtEl = document.getElementById(key + '-value');

                        if (!trgtEl) {
                            return;
                        }

                        if (config[key].propertyType === 'display') {
                            trgtEl.checked = config[key].value;
                        } else if (['color', 'background'].indexOf(config[key].propertyType) > -1) {
                            trgtEl.style.background = '#' + config[key].value;
                            trgtEl.value =  config[key].value;
                        } else {
                            trgtEl.innerText = config[key].value;
                            trgtEl.value = config[key].value;
                        }
                    }
                }
            }

            hapyak.widget.player.pause();
            hyWidget.utils.tempFrameSize('100%', '40%');
            hyWidget.utils.display('#widget-body', true);
            hyWidget.utils.display('#edit-container', true);
        },
        initMaterialize = function editInitMaterialize () {
            var init = function () {
                Materialize.updateTextFields && Materialize.updateTextFields();
                ready();
            };

            if (Materialize && Materialize.updateTextFields) {
                init();
                return;
            }
            
            $(document).ready(function () {
                init();
            });
        },
        saveSettings = function saveWidgetSettings () {
            /*
                Example input el:
                <textarea id="title-value"
                    data-edit-id="title-value"
                    data-input-type="text"
                    data-property-type="text"
                    data-view-id="title"
                    class="materialize-textarea config">Default Text</textarea>

                data-property-type : `text`, `display`, `background`, `color`, `etc`
            */
            var querySelect = '#edit-container input.trgtProp, #edit-container textarea.trgtProp',
                config = hyWidget.utils.getAllValues(querySelect.replace(/trgtProp/g, 'config')),
                baseProps = hyWidget.utils.getAllValues(querySelect.replace(/trgtProp/g, 'base-prop'));

            baseProps && hyWidget.utils.setBaseProps(baseProps);
            config && hyWidget.utils.setConfig(config);
            hyWidget.utils.reload('view');
        };

    hyWidget.utils.onWidgetLoad(init);
}());
