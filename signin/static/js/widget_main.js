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
                trackAction('auto', {
                    'userId': userId,
                    'username': username
                });
                signinComplete();
                return;
            }

            if (user.userCookie && user.userCookie !== '') {
                authUser(user.userCookie, user.userNameCookie);
                trackAction('auto', {
                    'userId': user.userCookie,
                    'username': user.userNameCookie
                });
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
                config = hyWidget.config;
                isValid = true;

            config && available.forEach(function (field) {
                var field = config[field],
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
        authUser = function (userId, username) {
            if (inEditor || !userId) {
                return;
            }

            window.HapyakCookie.set('_hapyakTrackingUser', userId);
            window.HapyakCookie.set('_hapyakTrackingUserName', username);

            hyWidget.utils.env('set', '_hapyakTrackingUser', userId);
            hyWidget.utils.env('set', '_hapyakTrackingUserName', username);

            hapyak.context.auth({
                userId: userId,
                username: username
            });
        },
        trackAction = function (type, values) {
            var dotget = hyWidget.utils.dotget,
                data = {
                    widget: 'widget_signin',
                    widgetName: widgetData && widgetData.customWidget || '',
                    action: type,
                    title: dotget(hyWidget, 'config.title.value'),
                    subTitle: dotget(hyWidget, 'config.sub-title.value'),
                    optionValue: values.optionVal || '',
                    optionValuePlaceholderText: dotget(hyWidget, 'config.option-one-text.value'),
                    optionInputAvailable: dotget(hyWidget, 'config.option-one.value'),
                    firstNameValue: values.firstName || '',
                    firstNameOptionInputAvailable: dotget(hyWidget, 'config.first-name.value'),
                    lastNameValue: values.lastName || '',
                    lastNameOptionInputAvailable: dotget(hyWidget, 'config.last-name.value'),
                    gated: !!dotget(hyWidget, 'props.gate'),
                    skippable: dotget(hyWidget, 'config.skip.value')
                };
            
            if (values.userId) {
                data.userId = values.userId;
            }

            if (values.username) {
                data.username = values.username;
            }

            hyWidget.utils.track.event('hy', 'leadGen', data);
        },
        submit = function () {
            var formValues = hyWidget.utils.getAllValues('#fields input'),
                viewVal = '-view-input-field';

            var userId,
                userName,
                optionVal,
                first,
                last;

            if (!validate(formValues)) {
                return;
            }

            userId = formValues['email-address' + viewVal].value;
            first = formValues['first-name'  + viewVal].value;
            last = formValues['last-name'  + viewVal].value;
            userName = first + ' ' + last;
            optionVal = formValues['option-one'  + viewVal].value

            trackAction('manual', {
                'userId': userId,
                'userName': userName,
                'firstName': first,
                'lastName': last,
                'optionVal': optionVal
            });
            authUser(userId, userName);
            signinComplete();
        },
        signinComplete = function () {
            if (inEditor) {
                return;
            }

            hapyak.widget.releaseGate();
            hyWidget.utils.tempFrameSize('0%', '0%');
            hyWidget.utils.env('set', 'loginComplete', true);
        },
        setupToggle = function () {
            var toggleBtn = document.getElementById('change-mode');

            if (toggleBtn) {
                toggleBtn.style.display = hapyak.widget.player.isEditMode && hyWidget.mode === 'view' ? 'block' : 'none';
                toggleBtn.addEventListener('click', function () {
                    hyWidget.utils.reload();
                });
            }
        }
        setup = function () {
            var submitBtn = document.getElementById('submit-btn'),
                skipBtn = document.getElementById('skip'),
                config = hyWidget.config,
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

            if (config) {
                hyWidget.utils.applyConfig(config);
                hasFirstName = config['first-name'].value;
                hasLastName = config['last-name'].value;

                if (hasFirstName && !hasLastName) {
                    updateColumns('first-name');
                } else if (!hasFirstName && hasLastName) {
                    updateColumns('last-name');
                }

                // Explicitly check value is false
                if (config['gated'].value === false) {
                    hapyak.widget.releaseGate();
                }
            }

            submitBtn && submitBtn.addEventListener('click', submit, false);
            skipBtn && skipBtn.addEventListener('click', function () {
                trackAction('skip');
                signinComplete();
            }, false);

            Materialize.updateTextFields && Materialize.updateTextFields();
            hapyak.widget.player.pause();
            hyWidget.utils.tempFrameSize('100%', '100%');
            hyWidget.utils.display('#widget-body', true);
            hyWidget.utils.display('#view-container', true);
        };

    hyWidget.utils.onWidgetLoad(init);
}());
