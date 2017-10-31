var widgetProps,
    widgetConfig,
    player;

var hyWidget = {
    didLoad: false,
    mode: ''
};

(function () {
    window.widgetUtils = {
        dotget: function (obj, desc, d) {
            var value,
                arr;

            if (obj && desc) {
                arr = desc.split('.');

                while (obj && arr.length) {
                    obj = obj[arr.shift()];
                }
                value = obj;
            }

            return value !== undefined ? value : d;
        },
        getParameterByName: function (name, url) {
            var regex,
                results;

            if (!url) {
                url = window.location.href;
            }

            name = name.replace(/[\[\]]/g, '\\$&');
            regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)');
            results = regex.exec(url);

            if (!results) {
                return null;
            }

            if (!results[2]) {
                return '';
            }

            return decodeURIComponent(results[2].replace(/\+/g, ' '));
        },
        isIframed: function () {
            try {
                return window.self !== window.top;
            } catch (e) {
                return true;
            }
        },
        track: {
            event: function (provider, type, props) {
                if (provider === 'hy') {
                    hapyak.widget.tracking.action(type, props);
                }
            },
            click: function (evt) {
                hapyak.widget.tracking.click(evt);
            }
        },
        env: function (action, prop, val) {
            if (action === 'get') {
                return hapyak.widget.env.get(prop);
            }

            // hapyak.widget.env.set this needs to be checked
            if (action === 'set') {
                hapyak.widget.env.set(prop, val, false, 'track');
            }
        },
        releaseGate: function () {
            hapyak.widget.releaseGate();
        },
        setConfig: function (props) {
            /*
                Freeform json blob
                * This will be updated to be settable within setBaseProp *
            */
            hapyak.context.annotationConfig = props;
        },
        setBaseProp: function (prop, val) {
            var isNumeric = function (n) {
                    return !isNaN(parseFloat(n)) && isFinite(n);
                };

            if (isNumeric(val)) {
                val = parseInt(val);
            }

            hapyak.widget.set(prop, val);
        },
        setBaseProps: function (props) {
            var key;

            var data = {
                'durationFormat': props.durationFormat,
                'durationValue': props.durationValue,
                'end': props.end,
                'height': props.height,
                'left': props.left,
                'pause': props.pause,
                'noscale': props.noscale,
                'precondition': props.precondition,
                'start': props.start,
                'startTimeFormat': props.startTimeFormat,
                'top': props.top,
                'width': props.width,
                'customClasses': props.customClasses,
                'gate': props.gate
            };

            for (key in data) {
                if (!data[key]) {
                    delete data[key];
                }
            }

            hapyak.widget.setProperties(data);
        },
        hideEditBtns: function (props) {
            /*
                {
                    'delete': true
                }
            */
            var availableProps = ['editor', 'preview', 'done', 'delete','more','nudge', 'gate',
                                  'duration', 'startTime', 'pause', 'displayRule', 'addClass', 'scale'];
            
            if (!props) {
                return;
            }

            if (props.all) {
                hapyak.widget.editButton.hide();
                return;
            }

            // show/hide edit buttons given
            availableProps.forEach(function (prop) {
                if (props.hasOwnProperty(prop)) {
                    hapyak.widget.quickedit[prop][props[prop] ? 'hide' : 'show']();
                }
            });
        },
        tempFrameSize: function (height, width) {
            if (height) {
                hapyak.context.height = height;
            }

            if (width) {
                hapyak.context.width = width;
            }

            if (height === '100%' && width === '100%') {
                hapyak.widget.player.addClass(['hapyak-annotation-full-frame']);
            }
        },
        display: function (elem, show) {
            if (show) {
                $(elem).addClass('active');
                return;
            }
            
            $(elem).removeClass('active');
        },
        reload: function (override) {
            var url = window.location.origin + window.location.pathname + '?bust=' + Date.now(),
                mode = widgetUtils.getParameterByName('mode');

            if (!mode && override !== 'view') {
                url += '&mode=edit'
            }
            
            window.location.href = url;
        },
        onWidgetLoad: function (cb) {
            var baseAlertText = document.getElementById('base-alert-text'),
                baseAlertBox = document.getElementById('base-alert');

            if (!widgetUtils.isIframed()) {
                widgetUtils.display('#widget-body', true);
                widgetUtils.display('#base-alert', true);
                baseAlertText.innerText = 'Some features may not be available outside of the HapYak iframe domain.'
                return;
            }

            if (baseAlertBox) {
                baseAlertBox.style.display = 'none';
            }

            hapyak.context.addEventListener('annotationload', function hyDataAvailable (data) {
                var isHyEditMode = hapyak.widget.player.isEditMode;

                hyWidget.mode = isHyEditMode && widgetUtils.getParameterByName('mode') === 'edit' ? 'edit' : 'view';

                player = hapyak.widget.player;
                cb && cb(hapyak.widget.player.isEditMode, data);
            }, false);

            hapyak.context.addEventListener('editModeChange', function hyDataAvailable () {
                // location.reload(true); // Most dependable for fresh data 10/20/17
                widgetUtils.reload('view');
            }, false);
        }
    },
    init = function (isEditMode, data) {
        widgetProps = hapyak.widget.getProperties();
        widgetConfig = data && data.customConfig;

        hapyak.widget.tracking.disableClickTracking();
    };

    widgetUtils.onWidgetLoad(init);
}());
