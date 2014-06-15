'use strict';
/**
 * Created by Jonas Kugelmann on 26.05.2014.
 * Sourcecode from https://github.com/jdpedrie/angularjs-camelCase-to-human-filter
 * Wandelt "CamelCase" in "Title Case" um
 */
app.filter('titlecase', function () {
    return function(input) {
        return input.charAt(0).toUpperCase() + input.substr(1).replace(/[A-Z]/g, ' $&');
    }
});