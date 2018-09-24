/*globals hapyak */
'use strict';

hapyak.myWidget = {
    didSetup: false,
    inEditor: false,
    widgetData: null,
    library: null,
    init: function mainSetup(isEditMode, data) {
        this.widgetData = data;
        this.library = hapyak && hapyak.widget && hapyak.widget.library || {};
        this.inEditor = this.library.mode === 'view' && hapyak.widget.player.isEditMode;

        if (this.library.mode === 'edit') {
            return;
        }


        hapyak.widget.stopEditing();
        this.setup();
    },
    setupToggle: function mainSetupToggle() {
        // Toggle for editing/viewing in hy edit mode
        var toggleBtn = document.getElementById('change-mode'),
            isEditMode = hapyak.widget.player.isEditMode;

        if (toggleBtn) {
            toggleBtn.style.display = isEditMode && this.library.mode === 'view' ? 'block' : 'none';
            toggleBtn.addEventListener('click', this.library.utils.reload, false);
        }
    },
    setup: function mainSetup() {
        this.library.utils.display('#widget-body', true);
        this.library.utils.display('#view-container', true);
        this.setupToggle();

        if (this.didSetup) {
            return;
        }

        this.library.utils.applyConfig(this.library.config);
        this.didSetup = true;
    },
    trackAction: function hyTrackAction (action, mode, values) {
        var dotget = this.library.utils.dotget;

        var data;
        
        if(!action || !mode || !values) {
            return;
        }

        data = $.extend({}, values);
        
        this.library.utils.track.event('hapyak', action, data);
    
    },
    customLoad: function customLoad() {
        /*
            Required to init widget load for both editor and viewer.
            Widgets may require unique events to occur before load, so this logic
            is executed on a per widget basis.
        */

        hapyak.widget.library.utils.startLoad();
    }
}

hapyak.widget.library.utils.onWidgetLoad(hapyak.myWidget.init.bind(hapyak.myWidget));
hapyak.context.addEventListener('iframeshow', hapyak.myWidget.customLoad, false);