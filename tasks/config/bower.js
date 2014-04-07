'use strict';
module.exports = function(grunt) {

    grunt.config.set('bower', {
        dev: {
            dest: '.tmp/public',
            js_dest: '.tmp/public/js/components',
            css_dest: '.tmp/public/styles/components',

        }
    });

    grunt.loadNpmTasks('grunt-bower');
};
