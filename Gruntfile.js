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
                    watch: false,
                    keepAlive: false
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
        compass: {
            build: {
                options: {
                    importPath: [
                        'node_modules'
                    ],
                    sassDir: [
                        'css/src'
                    ],
                    cssDir: 'web/assets/css/',
                    environment: 'production',
                    noLineComments: false,
                    outputStyle: 'compressed',
                    specify: 'css/src/screen.scss'
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
                            'node_modules/babel-polyfill/dist/polyfill.min.js',
                            'node_modules/easeljs/lib/easeljs-0.8.2.min.js'
                        ],
                        dest: 'web/assets/js/vendor/',
                        flatten: true,
                        expand: true
                    }
                ]
            },
            assets: {
                files: [
                    {
                        src: [
                            'img/*'
                        ],
                        dest: 'web/assets/',
                        flatten: false,
                        expand: true
                    }
                ]
            }
        },
        uglify: {
            build: {
                files: {
                    'build/js/landscape.js': ['build/js/landscape.js']
                }
            }
        },
        autoprefixer: {
            build: {
                files: {
                    'web/assets/css/screen.css': 'web/assets/css/screen.css'
                }
            }
        },
        watch: {
            css: {
                files: [
                    'css/src/**/*.scss'
                ],
                tasks: [
                    'compass:build'
                ]
            },
            js: {
                files: [
                    'js/src/**/*.js'
                ],
                tasks: [
                    'develop:js'
                ]
            },
            options: {
                spawn: false
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-compass');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-scss-lint');
    grunt.loadNpmTasks('grunt-eslint');
    grunt.loadNpmTasks('grunt-autoprefixer');
    // todo: add JS unit testing

    grunt.registerTask('default', ['clean:build', 'eslint', 'browserify:build', 'uglify:build', 'clean:assets', 'scsslint', 'compass', 'autoprefixer', 'copy']);

    grunt.registerTask('lint:css', ['scsslint']);
    grunt.registerTask('lint:js', ['eslint']);

    grunt.registerTask('develop:js', ['browserify:develop', 'copy', 'watch:js']);
    grunt.registerTask('develop:css', ['compass', 'watch:css']);
};
