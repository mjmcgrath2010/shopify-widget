(function () {
    var init = function (isEditMode, data) {
            if (isEditMode) {
                return;
            }

            ready();
        },
        ready = function () {
            widgetUtils.display('#widget-body', true);
            widgetUtils.display('#view-container', true);
        };

    widgetUtils.onWidgetLoad(init);
}());
