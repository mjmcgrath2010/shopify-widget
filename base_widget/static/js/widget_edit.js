/*globals hapyak, $, widgetUtils, hyWidget, player, Materialize */
'use strict';

(function () {
    var init = function (isEditMode, data) {
        var saveBtn = document.getElementById('save-widget-config'),
            cancelBtn = document.getElementById('cancel-widget-config');

        hapyak.context.quickedit.doubleClick.disable();

        if (!hapyak.widget.player.isEditMode || hyWidget.mode !== 'edit') {
            return;
        }

        initMaterialize();
        saveBtn && saveBtn.addEventListener('click', saveSettings, false);
        cancelBtn && cancelBtn.addEventListener('click', function () {
            widgetUtils.reload('view');
        }, false);
    },
    ready = function () {
        var trgtEl,
            key;

        var config = hyWidget.config;

        if (config) {
            for (key in config) {
                trgtEl = document.getElementById(key + '-value');

                if (!trgtEl) {
                    return;
                }

                if (config[key].propertyType === 'display') {
                    trgtEl.checked = config[key].value;
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
    saveSettings = function () {
        /*
            Example input el:
            <textarea id="title-value"
                data-editId="title-value"
                data-input-type="text"
                data-property-type="text"
                data-viewId="title"
                class="materialize-textarea config">Default Text</textarea>

            data-property-type : `text`, `display`, `background`, `color`, `etc`
        */
        var querySelect = '#edit-container input.trgtProp, #edit-container textarea.trgtProp',
            config = widgetUtils.getAllValues(querySelect.replace(/trgtProp/g, 'config')),
            baseProps = widgetUtils.getAllValues(querySelect.replace(/trgtProp/g, 'base-prop'));

        baseProps && widgetUtils.setBaseProps(baseProps);
        config && widgetUtils.setConfig(config);
        widgetUtils.reload('view');
    };

    widgetUtils.onWidgetLoad(init);
}());
