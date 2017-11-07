/*globals hapyak, $, hyWidget */
'use strict';

(function () {
    window.hyWidget = {
        didLoad: false,
        props: {},
        config: {},
        mode: '',
        utils: {
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
                    return '';
                }

                if (!results[2]) {
                    return '';
                }

                return decodeURIComponent(results[2].replace(/\+/g, ' '));
            },
            cookie: {
                set: function (key, value, days) {
                    var expires,
                        date;

                    if (days) {
                        date = new Date();
                        date.setTime(date.getTime() + (days * 86400000));

                        expires = '; expires=' + date.toGMTString();
                    } else {
                        expires = '';
                    }

                    document.cookie = key + '=' + value + expires + '; path=/';
                },
                get: function (key) {
                    var cookie,
                        i;

                    var identifier = key + '=',
                        cookies = document.cookie.split(';');

                    for (i = 0; i < cookies.length; i++) {
                        cookie = cookies[i];

                        while (cookie.charAt(0) === ' ') {
                            cookie = cookie.substring(1, cookie.length);
                        }

                        if (cookie.indexOf(identifier) === 0) {
                            return cookie.substring(identifier.length, cookie.length);
                        }
                    }

                    return '';
                },
                remove: function (key) {
                    this.set(key, '', -1);
                }
            },
            isIframed: function () {
                // try/catch to handle security exception
                try {
                    return window.self !== window.top;
                } catch (e) {
                    return true;
                }
            },
            applyConfig: function (config) {
                var prop,
                    trgt,
                    trgtEl,
                    trgtEls;

                for (prop in config) {
                    trgt = config[prop];
                    trgtEl = document.getElementById(trgt.viewid),
                    trgtEls = document.querySelectorAll('#view-container .' + trgt.viewclass);

                    if (trgt.propertyType === 'background' || trgt.propertyType === 'color') {
                        if (trgtEl) {
                            trgtEl.style[trgt.propertyType] = trgt.value;
                        } else if (trgtEls) {
                            trgtEls.forEach(function (el) {
                                el.style[trgt.propertyType] = trgt.value;
                            });
                        }
                    }

                    if (trgtEl && trgt.propertyType === 'display') {
                        trgtEl.style.display = trgt.value ? 'block' : 'none';
                    }

                    if (trgt.propertyType === 'text') {
                        trgtEl.innerText = trgt.value;
                    }
                }
            },
            getAllValues: function (querySelector) {
                var inputValues = document.querySelectorAll(querySelector) || [],
                    inputs = {};

                inputValues && inputValues.forEach(function (el) {
                    // Date.now() in case id is missing
                    var id = el.id ? el.id.replace('-value', '') : Date.now();

                    inputs[id] = {
                        'value': el.type === 'checkbox' ? el.checked : el.value,
                        'type': el.type
                    };

                    if (el.dataset.viewid) {
                        inputs[id].viewid = el.dataset.viewid;
                    }
                    if (el.dataset.viewclass) {
                        inputs[id].viewclass = el.dataset.viewclass;
                    }
                    if (el.dataset.propertyType) {
                        inputs[id].propertyType = el.dataset.propertyType;
                    }
                });

                return inputs;
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
                    return;
                }

                hapyak.widget.player.removeClass(['hapyak-annotation-full-frame']);
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
                    mode = hyWidget.utils.getParameterByName('mode');

                if (!mode && override !== 'view') {
                    url += '&mode=edit';
                }
                
                window.location.href = url;
            },
            onWidgetLoad: function (cb) {
                var baseAlertText = document.getElementById('base-alert-text');

                if (!hyWidget.utils.isIframed()) {
                    hyWidget.utils.display('#widget-body', true);
                    hyWidget.utils.display('#base-alert', true);
                    baseAlertText.innerText = 'Some features may not be available outside of the HapYak iframe domain.';
                    return;
                }

                hapyak.context.addEventListener('annotationload', function hyDataAvailable (data) {
                    var isHyEditMode = hapyak.widget.player.isEditMode;

                    hyWidget.mode = isHyEditMode && hyWidget.utils.getParameterByName('mode') === 'edit' ? 'edit' : 'view';

                    cb && cb(hapyak.widget.player.isEditMode, data);
                }, false);

                hapyak.context.addEventListener('editModeChange', function hyDataAvailable () {
                    hyWidget.utils.reload('view');
                }, false);
            }
        }
    };

    var init = function (isEditMode, data) {
        hyWidget.props = hapyak.widget.getProperties();
        hyWidget.config = data && data.customConfig;

        window.HapyakCookie = hyWidget.utils.cookie;
        hapyak.widget.tracking.disableClickTracking();
    };

    hyWidget.utils.onWidgetLoad(init);
}());
