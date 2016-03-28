module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        clean: {
            "build": [
                "build/js"
            ],
            "assets": [
                "web/assets"
            ]
        },
        browserify: {
            "build": {
                "options": {
                    "transform": [
                        "babelify"
                    ],
                    "watch": false,
                    "keepAlive": false
                },
                "files": {
                    "build/js/landscape.js": "js/src/landscape.js"
                }
            }
        },
        copy: {
            "build": {
                "files": [
                    {
                        "src": [
                            "build/js/*.js"
                        ],
                        "dest": "web/assets/js",
                        "flatten": true,
                        "expand": true
                    }
                ]
            },
            "vendor": {
                "files": [
                    {
                        "src": [
                            "node_modules/babel-polyfill/dist/polyfill.min.js"
                        ],
                        "dest": "web/assets/js/vendor/",
                        "expand": true,
                        "flatten": true
                    }
                ]
            }
        }

    });

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-contrib-copy');

    // Default task(s).
    grunt.registerTask('default', ['clean', 'browserify', 'copy']);
}
