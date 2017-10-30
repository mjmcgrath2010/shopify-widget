if (!describe) {
    return;
}
describe('DOM Tests', function () { 
    var widgetBase = document.getElementById('widget-body');

    it('is in the DOM', function () {
        expect(widgetBase).to.not.equal(null);
    });
 
    it('is a child of the body', function () {
        expect(widgetBase.parentElement).to.equal(document.body);
    });
});

describe('"hapyak" global object', function () {
    var loaded = false;

    this.timeout(20000)

    // todo: listen for the load event and remove setTimeout
    before(function(done) {
        setTimeout(function() {
            loaded = true;
            done();
        }, 5000);
    });

    it('is loaded', function () {
        expect(loaded).equals(true);
    });

    it('exists', function () {
        expect(hapyak).to.exist;
    });

    describe('hapyak.widget', function () {
        it('exists', function () {
            chai.expect(hapyak).to.have.property('widget')
        });

        it('has expected functions', function () {
            var widget = hapyak && hapyak.widget,
                fnNames = ['addEventListener', 'removeEventListener', 'set', 'get', 'save',
                           'setProperties', 'getProperties', 'releaseGate', 'startEditing', 'stopEditing'];

            fnNames.forEach(function (fnName) {
                assert.isFunction(widget[fnName]);
            });
        });

        it ('has expected properties', function () {
            var widget = hapyak && hapyak.widget,
                props = ['config', 'editButton', 'env', 'isEditing', 'paused', 'player', 'quickedit', 'tracking'];

            props.forEach(function (prop) {
                chai.expect(widget).to.have.property(prop);
            });
        });
    });

    describe('Widget', function () {
        var isIframed = widgetUtils.isIframed();;

        describe('widgetUtils object', function () {
            it('exists', function () {
                chai.expect(widgetUtils).to.exist;
            });
            
            describe('dotget', function () {
                it ('should get nested property', function () {
                    var nestedObject = {
                            'foo': {
                                'food': {
                                    'foodie': 'tuna'
                                }
                            }
                        },
                        dotgetResult = widgetUtils.dotget(nestedObject, 'foo.food.foodie');

                    chai.expect(dotgetResult).to.equal('tuna');
                    chai.expect(dotgetResult).not.to.equal('groundhog');
                })
            });

            describe('isIframed', function () {
                it ('should return boolean', function () {
                    assert.isBoolean(isIframed);
                })
            });
        });

        if (isIframed) {
            describe('widget properties', function () {
                it('has expected widget props', function () {
                    var props = ['customClasses', 'durationFormat', 'durationValue', 'end', 'gate',
                                 'height', 'left', 'noscale', 'pause', 'precondition', 'start',
                                 'startTimeFormat', 'startTimeValue', 'top', 'width', '_duration'];

                     props.forEach(function (val) {
                        chai.expect(widgetProps).to.have.property(val);
                    });
                });

                describe('setable properties when in edit mode and iframed', function () {
                    var originalProps = hapyak.widget.getProperties(),
                        randNum = function (min, max) {
                            return Math.floor(Math.random()*(max - min + 1) + min);
                        },
                        checkAfter = function (prop, val) {
                            var props = hapyak.widget.getProperties();

                            chai.expect(props[prop]).to.equal(val);
                        },
                        propTestSize = function (prop, size) {
                            if (!isIframed) {
                                return;
                            }

                            widgetUtils.setBaseProp(prop, size + '%');

                            setTimeout(function () {
                                var props = hapyak.widget.getProperties();

                                chai.expect(props[prop]).to.equal(size + '%');
                            }, 5000);
                        },
                        randString = function () {
                            var text = '',
                                possible = 'ABCDEFGabcdefg01234789';

                            for (var i = 0; i < 5; i++) {
                                text += possible.charAt(Math.floor(Math.random() * possible.length));    
                            }

                            return text;
                        };

                    describe('settable properties', function() {
                        describe('properties can be set individually', function() {
                            it('has setable height', function () {
                                propTestSize('height', randNum(40, 80));
                            });

                            it('has setable width', function () {
                                propTestSize('width', randNum(40, 80));
                            });

                            it('has setable left', function () {
                                propTestSize('left', randNum(0, 20));
                            });

                            it('has setable top', function () {
                                propTestSize('top', randNum(0, 20));
                            });
                        });

                        describe('properties can be set in a batch', function() {
                            var newClass = randString(),
                                newPrecond = randString();

                            widgetUtils.setBaseProps({
                                'customClasses': newClass,
                                'precondition': newPrecond,
                            });

                            it('has setable customClasses, durationValue, noscale', function (done) {
                                setTimeout(function () {
                                    var props = hapyak.widget.getProperties();

                                    chai.expect(props['customClasses']).to.equal(newClass);
                                    chai.expect(props['precondition']).to.equal(newPrecond);
                                    done();
                                }, 3000);
                            });
                        });
                    });
                })
            });
        } else {
            describe('widget properties', function () {
                it('is not iframed ', function () {
                    chai.expect(isIframed).to.equal(false);
                });

                it('does NOT have expected widget properties when not in iframe', function () {
                    chai.expect(widgetProps).to.equal(undefined);
                });
            });
        }

        describe('alert-box', function () {
            var baseAlert = document.getElementById('base-alert'),
                isActive = baseAlert && baseAlert.className.indexOf('active') > -1;

            it('is not active if iframed', function () {
                chai.expect(isActive).to.equal(isIframed ? false : true);
            });
        })
    });
});
