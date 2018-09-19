(function () {
    var assets = {
            'production': {
                'hyHost': '//d2qrdklrsxowl2.cloudfront.net'
            },
            'staging': {
                'hyHost': '//d3bo0fj9s1pd3n.cloudfront.net'
            },
            'feature': {
                'hyHost': '//feature.hapyak.com'
            },
            'dev': {
                'hyHost': '//dev.hapyak.com'
            }
        },
        getQueryParams = function getQueryParams(qs) {
            var params = {},
                re = /[?&]?([^=]+)=([^&]*)/g;

            var tokens;

            qs = qs.split('+').join(' ');

            while (tokens = re.exec(qs)) {
                params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
            }

            return params;
        },
        qString = getQueryParams(document.location.search),
        scripts = assets[qString.hyEnv] || assets.production,
        hyHost = scripts.hyHost;

    head.load([
        hyHost + '/js/hapyak-iframe.js',
        hyHost + '/js/hapyak.api.js',
        '//d3u7twytwz85jb.cloudfront.net/widgets/vendor/jquery/jquery-3.2.1.min.js',
        '//d3u7twytwz85jb.cloudfront.net/widgets/vendor/materialize/0.100.2.materialize.min.js',
        '//d3u7twytwz85jb.cloudfront.net/widgets/vendor/jscolor/jscolor.min.js',
        hyHost + '/static/js/widget/v1/base.js',
        hyHost + '/static/js/widget/v1/widget_edit.js',
        'static/js/widget_main.js'
    ]);
})();
