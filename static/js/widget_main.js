/*globals hapyak */
'use strict';

hapyak.shopifyWidget = {
    didSetup: false,
    inEditor: false,
    widgetData: null,
    library: null,
    shopifyLoaded: false,
    client: {},
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

        if (this.shopifyLoaded) {
            this.shopifyConfig()
        }

        this.library.utils.applyConfig(this.library.config);
        this.didSetup = true;
    },
    shopifyConfig: function shopifyConfig(domain, accessToken, options, idsArray) {

        // if (!domain || !apiKey || !appId) {
        //     return alert('Please make sure to setup all configs properly.')
        // }

        this.client = ShopifyBuy.buildClient({
            domain: domain || 'hapyak-test-store.myshopify.com',
            storefrontAccessToken: accessToken || '23fedee89bcadec0487bf990c2c714d1',
        });


        // Sample Options:
        var defaultOptions = {
            "product": {
                "layout": "horizontal",
                    "variantId": "all",
                    "width": "100%",
                    "contents": {
                    "img": false,
                        "imgWithCarousel": true,
                        "variantTitle": false,
                        "description": true,
                        "buttonWithQuantity": false,
                        "quantity": false
                },
                "styles": {
                    "product": {
                        "text-align": "left",
                            "@media (min-width: 601px)": {
                            "max-width": "100%",
                                "margin-left": "0",
                                "margin-bottom": "50px"
                        }
                    },
                    "title": {
                        "font-size": "26px"
                    },
                    "price": {
                        "font-size": "18px"
                    },
                    "compareAt": {
                        "font-size": "15px"
                    }
                }
            },
            "cart": {
                "contents": {
                    "button": true
                },
                "styles": {
                    "footer": {
                        "background-color": "#ffffff"
                    }
                }
            },
            "modalProduct": {
                "contents": {
                    "img": false,
                        "imgWithCarousel": true,
                        "variantTitle": false,
                        "buttonWithQuantity": true,
                        "button": false,
                        "quantity": false
                },
                "styles": {
                    "product": {
                        "@media (min-width: 601px)": {
                            "max-width": "100%",
                                "margin-left": "0px",
                                "margin-bottom": "0px"
                        }
                    }
                }
            },
            "productSet": {
                "styles": {
                    "products": {
                        "@media (min-width: 601px)": {
                            "margin-left": "-20px"
                        }
                    }
                }
            }
        };
        ShopifyBuy.UI.onReady(this.client).then(function (ui) {
            ui.createComponent('product', {
                id: idsArray || [1658849624164],
                node: document.getElementById('shopify-container'),
                moneyFormat: '%24%7B%7Bamount%7D%7D',
                options: options || defaultOptions
            });
        });
    },
    addProuct: function addProduct() {

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
    loadScript: function loadScript() {
        var script = document.createElement('script'),
            scriptURL = 'https://sdks.shopifycdn.com/buy-button/latest/buy-button-storefront.min.js';

        script.async = true;
        script.src = scriptURL;
        (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(script);
        script.onload = function () {
            window.ShopifyBuy && window.ShopifyBuy.UI ? hapyak.shopifyWidget.shopifyLoaded = true : hapyak.shopifyWidget.shopifyLoaded = false;
        };
    },
    customLoad: function customLoad() {
        /*
            Required to init widget load for both editor and viewer.
            Widgets may require unique events to occur before load, so this logic
            is executed on a per widget basis.
        */

        window.ShopifyBuy && window.ShopifyBuy.UI ? hapyak.shopifyWidget.shopifyLoaded = true : hapyak.shopifyWidget.loadScript();

        hapyak.widget.library.utils.startLoad();
    }
};

hapyak.widget.library.utils.onWidgetLoad(hapyak.shopifyWidget.init.bind(hapyak.shopifyWidget));
hapyak.context.addEventListener('iframeshow', hapyak.shopifyWidget.customLoad, false);