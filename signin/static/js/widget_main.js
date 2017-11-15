/*globals hapyak, hyWidget, Materialize */
'use strict';

(function () {
    var auth = null,
        didSetup = false,
        inEditor = false,
        widgetData = null,
        init = function mainSetup (isEditMode, data) {
            var user = existingUserInfo();

            var authInfo;

            widgetData = data;
            inEditor = hyWidget.mode === 'view' &&  hapyak.widget.player.isEditMode;

            if (hyWidget.mode === 'edit') {
                return;
            }

            if (inEditor) {
                setup();
            }

            if (isAuthed()) {
                authInfo = hapyak.context.auth();

                authUser(authInfo.userId, authInfo.username);
                trackAction('auto', {
                    'userId': authInfo.userId,
                    'username': authInfo.username
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
        existingUserInfo = function getExistingUserInfo () {
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
        isAuthed = function checkIsAuthed () {
            auth = hapyak.context.auth();

            return auth && (auth.userId || auth.username);
        },
        validate = function validateInputs (values) {
            var available = ['first-name', 'last-name', 'option-one', 'email-address'],
                config = hyWidget.config,
                isValid = true;

            config && available.forEach(function (field) {
                var currentField = config[field],
                    viewId = currentField && currentField.viewid + '-view-input-field',
                    trgtEl = viewId && document.getElementById(viewId);

                // If the currentField is not present, then count as true
                if (!currentField.value) {
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
        authUser = function checkAuthUser (userId, username) {
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
        trackAction = function hyTrackAction (type, values) {
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
        submit = function submitData () {
            var formValues = hyWidget.utils.getAllValues('#fields input'),
                getVal = function (val) {
                    var viewVal = '-view-input-field',
                        trgtVal = formValues && formValues[val + viewVal];

                    return trgtVal && trgtVal.value;
                };

            var userId,
                userName,
                optionVal,
                first,
                last;

            if (!validate(formValues)) {
                return;
            }

            userId = getVal('email-address');
            first = getVal('first-name');
            last = getVal('last-name');
            optionVal = getVal('option-one');
            userName = first + ' ' + last;

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
        signinComplete = function signinCompleteFn () {
            if (inEditor) {
                return;
            }

            hapyak.widget.releaseGate();
            hyWidget.utils.tempFrameSize('0%', '0%');
            hyWidget.utils.env('set', 'loginComplete', true);
        },
        setupToggle = function mainSetupToggle () {
            // Toggle for editing/viewing in hy edit mode
            var toggleBtn = document.getElementById('change-mode'),
                isEditMode = hapyak.widget.player.isEditMode;

            if (toggleBtn) {
                toggleBtn.style.display = isEditMode && hyWidget.mode === 'view' ? 'block' : 'none';
                toggleBtn.addEventListener('click', hyWidget.utils.reload, false);
            }
        },
        setup = function () {
            var submitBtn = document.getElementById('submit-btn'),
                skipBtn = document.getElementById('skip'),
                config = hyWidget.config,
                updateColumns = function updateUiColumns (id) {
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
                if (config.gated.value === false) {
                    hapyak.widget.releaseGate();
                }
            }

            submitBtn && submitBtn.addEventListener('click', submit, false);
            skipBtn && skipBtn.addEventListener('click', function skipForm () {
                trackAction('skip', {});
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
