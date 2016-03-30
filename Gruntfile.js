module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        clean: {
            build: [
                'build/js'
            ],
            assets: [
                'web/assets'
            ]
        },
        scsslint: {
            allFiles: [
                'css/*.scss'
            ],
            options: {
                bundleExec: false,
                colorizeOutput: true,
                maxBuffer: 100000,
                compact: true,
                config: 'scss-lint.yml'
            }
        },
        eslint: {
            target: 'js/src/**/*.js'
        },
        browserify: {
            develop: {
                options: {
                    transform: [
                        'babelify'
                    ],
                    watch: true,
                    keepAlive: true
                },
                files: {
                    'build/js/landscape.js': 'js/src/landscape.js'
                }
            },
            build: {
                options: {
                    transform: [
                        'babelify'
                    ],
                    watch: false,
                    keepAlive: false
                },
                files: {
                    'build/js/landscape.js': 'js/src/landscape.js'
                }
            }
        },
        copy: {
            build: {
                files: [
                    {
                        src: [
                            'build/js/*.js'
                        ],
                        dest: 'web/assets/js',
                        flatten: true,
                        expand: true
                    }
                ]
            },
            vendor: {
                files: [
                    {
                        src: [
                            'node_modules/babel-polyfill/dist/polyfill.min.js'
                        ],
                        dest: 'web/assets/js/vendor/',
                        expand: true,
                        flatten: true
                    }
                ]
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-scss-lint');
    grunt.loadNpmTasks('grunt-eslint');
    // todo: add compass, autoprefixer, uglify
    // todo: add JS unit testing

    grunt.registerTask('default', ['clean', 'scsslint', 'eslint', 'browserify:build', 'copy']);
    grunt.registerTask('lint:css', ['scsslint']);
    grunt.registerTask('lint:js', ['eslint']);
    grunt.registerTask('develop:js', ['browserify:develop']);
};
