(function () {
    var auth = null,
        didSetup = false,
        init = function (isEditMode, data) {
            var user = existingUserInfo();

            if (hyWidget.mode === 'edit') {
                return;
            }

            if (isAuthed()) {
                signinComplete();
                return;
            }

            if (user.userCookie && user.userCookie !== '') {
                setAuthInfo(user.userCookie, user.userNameCookie);
                signinComplete();
                return;
            }

            hapyak.context.addEventListener('authchange', function (authInfo) {
                if (authInfo.userId) {
                    signinComplete();
                }
            });

            setup();
        },
        existingUserInfo = function () {
            var userCookie = window.HapyakCookie.get('_hapyakTrackingUser'),
                userNameCookie = window.HapyakCookie.get('_hapyakTrackingUserName');

            if (!userCookie || userCookie === '') {
                userCookie = hapyak.context.env.get('_hapyakTrackingUser');
            }

            if (!userNameCookie || userNameCookie === '') {
                userNameCookie = hapyak.context.env.get('_hapyakTrackingUserName');
            }

            return {
                'userCookie': userCookie,
                'userNameCookie': userNameCookie
            };
        },
        isAuthed = function () {
            auth = hapyak.context.auth();

            return auth && (auth.userId || auth.username);
        },
        validate = function (values) {
            var name;

            var available = ['first-name', 'last-name', 'option-one', 'email-address'];

            return widgetConfig && available.every(function (field) {
                var field = widgetConfig[field];

                // If the field is not present, then count as true
                if (!field.value) {
                    return true;
                }

                return field && field.value && values[field.viewid + '-view-input-field'].value;
            });
        },
        setAuthInfo = function (userId, username) {
            window.HapyakCookie.set('_hapyakTrackingUser', userId);
            window.HapyakCookie.set('_hapyakTrackingUserName', username);

            widgetUtils.env('set', '_hapyakTrackingUser', userId);
            widgetUtils.env('set', '_hapyakTrackingUserName', username);

            hapyak.context.auth({
                userId: userId,
                username: username
            });

            hapyak.context.tracking.action('leadGen', {
                userId: userId,
                username: username,
                tag: 'iframe_signin'
            });
        },
        submit = function () {
            var formValues = widgetUtils.getAllValues('#fields input');

            if (!validate(formValues)) {
                return;
            }

            setAuthInfo(formValues['email-address-view-input-field'].value,
                        formValues['first-name-view-input-field'].value +
                        formValues['last-name-view-input-field'].value);
        },
        signinComplete = function () {
            // sigin complete logic
            hapyak.widget.releaseGate();
            widgetUtils.tempFrameSize('0%', '0%');
            widgetUtils.env('set', 'loginComplete', true);
        },
        setupToggle = function () {
            var toggleBtn = document.getElementById('change-mode');

            if (toggleBtn) {
                toggleBtn.style.display = hapyak.widget.player.isEditMode && hyWidget.mode === 'view' ? 'block' : 'none';
                toggleBtn.addEventListener('click', function () {
                    widgetUtils.reload();
                });
            }
        }
        setup = function () {
            var submitBtn = document.getElementById('submit-btn'),
                skipBtn = document.getElementById('skip'),
                hasFirstName = widgetConfig['first-name'].value,
                hasLastName = widgetConfig['last-name'].value,
                updateColumns = function (id) {
                    trgtEl = document.getElementById(id);
                    trgtEl.className = trgtEl.className.replace('s3', 's6');
                };

            var trgtEl;

            setupToggle();

            if (didSetup) {
                return;
            }

            didSetup = true;

            if (widgetConfig) {
                widgetUtils.applyConfig(widgetConfig);

                if (hasFirstName && !hasLastName) {
                    updateColumns('first-name');
                } else if (!hasFirstName && hasLastName) {
                    updateColumns('last-name');
                }
            }

            submitBtn && submitBtn.addEventListener('click', submit, false);
            skipBtn && skipBtn.addEventListener('click', signinComplete, false);

            Materialize.updateTextFields && Materialize.updateTextFields();
            widgetUtils.tempFrameSize('100%', '100%');
            widgetUtils.display('#widget-body', true);
            widgetUtils.display('#view-container', true);
        };

    widgetUtils.onWidgetLoad(init);
}());
