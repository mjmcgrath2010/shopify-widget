(function () {
    var init = function (isEditMode, data) {
            if (hyWidget.mode === 'edit') {
                return;
            }

            if (isAuthed() === undefined) {
                hapyak.context.addEventListener('authchange', function (authInfo) {
                    auth = authInfo;
                    ready();
                });

                return;
            }

            ready();
        },
        isAuthed = function () {
            auth = hapyak.context.auth();

            return auth && (auth.userId || auth.username);
        },
        getAllValues = function () {
            var inputValues = document.querySelectorAll('#fields input'),
                inputs = {};

            inputValues && inputValues.forEach(function (el) {
                inputs[el.id || Date.now()] = el.value;
            });

            return inputs;
        },
        validate = function (values) {
            // require all - figure out validation
            var name;

            for (name in values) { 
                if ([null, undefined, ''].indexOf(values[name]) > -1) {
                    delete values[name];
                }
            }

            return Object.keys(values).length === 3;
        },
        setAuthCookies = function (userId, username) {
            window.HapyakCookie.set('_hapyakTrackingUser', userId);
            window.HapyakCookie.set('_hapyakTrackingUserName', username);

            widgetUtils.env('set', '_hapyakTrackingUser', userId);
            widgetUtils.env('set', '_hapyakTrackingUserName', username);
        },
        auth = null,
        didSetup = false,
        submit = function () {
            var formValues = getAllValues();

            if (!validate(formValues)) {
                console.log('invalid: ', formValues);
                return;
            }

            dismissForm();
        },
        dismissForm = function () {
            widgetUtils.env('set', 'loginComplete', true);
        },
        ready = function () {
            var submitBtn = document.getElementById('submit-btn'),
                toggleBtn = document.getElementById('change-mode');

            if (didSetup) {
                return;
            }

            didSetup = true;

            if (toggleBtn) {
                toggleBtn.style.display = hapyak.widget.player.isEditMode && hyWidget.mode === 'view' ? 'block' : 'none';
                toggleBtn.addEventListener('click', function () {
                    widgetUtils.reload();
                });
            }

            // if (auth.userId || auth.username) {
            //     dismissForm()
            //     return;
            // }

            if (widgetConfig) {
                //  setup styles / text / etc
                //  view-container  background color
            }

            submitBtn && submitBtn.addEventListener('click', submit, false);

            Materialize.updateTextFields && Materialize.updateTextFields();
            widgetUtils.tempFrameSize('100%', '100%');
            widgetUtils.display('#widget-body', true);
            widgetUtils.display('#view-container', true);
        };

    widgetUtils.onWidgetLoad(init);
}());

// var config = {
//     'bodyBackground': '',
//     'title': {
//         'color': '',
//         'text': ''
//     },
//     'subTitle': {
//         'color': '',
//         'text': ''
//     },
//     'submitBtn': {
//         'background': '',
//         'color': '',
//         'text': ''
//     },
//     'skipBtn': {
//         'background': '',
//         'color': '',
//         'text': ''
//     },
//     'fields': [
//         {
//             'colors': {
//                 'background': '',
//                 'color': ''
//             }
//         }
//     ]
// };
