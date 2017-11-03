(function () {
    var auth = null,
        didSetup = false,
        inEditor = false,
        widgetData = null,
        init = function (isEditMode, data) {
            var user = existingUserInfo();

            widgetData = data;
            inEditor = hyWidget.mode === 'view' &&  hapyak.widget.player.isEditMode;

            if (hyWidget.mode === 'edit') {
                return;
            }

            if (inEditor) {
                setup();
            }

            if (isAuthed()) {
                signinComplete();
                return;
            }

            if (user.userCookie && user.userCookie !== '') {
                authAndTrack(user.userCookie, user.userNameCookie);
                signinComplete();
                return;
            }

            // Init evt listener for `authchange`
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
            var available = ['first-name', 'last-name', 'option-one', 'email-address'],
                isValid = true;

            widgetConfig && available.forEach(function (field) {
                var field = widgetConfig[field],
                    viewId = field && field.viewid + '-view-input-field',
                    trgtEl = viewId && document.getElementById(viewId);

                // If the field is not present, then count as true
                if (!field.value) {
                    return;
                }

                if (values[viewId].value) {
                    trgtEl.className = trgtEl.className.replace(/invalid/g, '');
                    return;
                }
                
                trgtEl.className = trgtEl.className += ' invalid';
                isValid = false;
            });

            return isValid;
        },
        authAndTrack = function (userId, username) {
            if (inEditor || !userId) {
                return;
            }

            window.HapyakCookie.set('_hapyakTrackingUser', userId);
            window.HapyakCookie.set('_hapyakTrackingUserName', username);

            widgetUtils.env('set', '_hapyakTrackingUser', userId);
            widgetUtils.env('set', '_hapyakTrackingUserName', username);

            hapyak.context.auth({
                userId: userId,
                username: username
            });

            widgetUtils.track.event('hy', 'leadGen', {
                userId: userId,
                username: username,
                widget: 'widget_signin',
                widgetName: widgetData && widgetData.customWidget || ''
            });
        },
        submit = function () {
            var formValues = widgetUtils.getAllValues('#fields input');

            if (!validate(formValues)) {
                return;
            }

            // widgetUtils.track.click('submit', 'click');

            authAndTrack(formValues['email-address-view-input-field'].value,
                        formValues['first-name-view-input-field'].value +
                        formValues['last-name-view-input-field'].value);
        },
        signinComplete = function () {
            if (inEditor) {
                return;
            }

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
                updateColumns = function (id) {
                    var trgtEl = document.getElementById(id);
                    trgtEl.className = trgtEl.className.replace('s3', 's6');
                };

            var hasFirstName,
                hasLastName;

            setupToggle();

            if (didSetup) {
                return;
            }

            didSetup = true;

            if (widgetConfig) {
                widgetUtils.applyConfig(widgetConfig);
                hasFirstName = widgetConfig['first-name'].value;
                hasLastName = widgetConfig['last-name'].value;

                if (hasFirstName && !hasLastName) {
                    updateColumns('first-name');
                } else if (!hasFirstName && hasLastName) {
                    updateColumns('last-name');
                }

                // Explicitly check value is false
                if (widgetConfig['gated'].value === false) {
                    hapyak.widget.releaseGate();
                }
            }

            submitBtn && submitBtn.addEventListener('click', submit, false);
            skipBtn && skipBtn.addEventListener('click', function () {
                // widgetUtils.track.click('skip', 'click');
                signinComplete();
            }, false);

            Materialize.updateTextFields && Materialize.updateTextFields();
            player.pause();
            widgetUtils.tempFrameSize('100%', '100%');
            widgetUtils.display('#widget-body', true);
            widgetUtils.display('#view-container', true);
        };

    widgetUtils.onWidgetLoad(init);
}());
