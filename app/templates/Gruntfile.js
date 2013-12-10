'use strict';
var LIVERELOAD_PORT = 35729;
var lrSnippet = require('connect-livereload')({port: LIVERELOAD_PORT});
var mountFolder = function (connect, dir) {
    return connect.static(require('path').resolve(dir));
};
module.exports = function(grunt) {
    // load all grunt tasks
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
    // configurable paths
    var yeomanConfig = {
        app: 'admin/static',
        dist: 'cdn/admin'
    };
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        yeoman: yeomanConfig,
        requirejs: {
            std: {
                options: {
                    appDir: 'app',
                    baseUrl: './js/lib',
                    mainConfigFile: 'app/js/config.js',
                    optimize: 'uglify2',
                    uglify2: {
                        //Example of a specialized config. If you are fine
                        //with the default options, no need to specify
                        //any of these properties.
                        output: {
                            beautify: false
                        },
                        compress: {
                            sequences: false,
                            global_defs: {
                                DEBUG: false
                            }
                        },
                        warnings: true,
                        mangle: false
                    },
                    generateSourceMaps: true,
                    preserveLicenseComments: false,
                    // useSourceUrl: true,
                    dir: 'dist',
                    //skipDirOptimize: true,
                    modules: [
                        //First set up the common build layer.
                        {
                            //module names are relative to baseUrl
                            name: '../config',
                            //List common dependencies here. Only need to list
                            //top level dependencies, "include" will find
                            //nested dependencies.
                            include: [

                            ]
                        },
                        //Now set up a build layer for each page, but exclude
                        //the common one. "exclude" will exclude nested
                        //the nested, built dependencies from "common". Any
                        //"exclude" that includes built modules should be
                        //listed before the build layer that wants to exclude it.
                        //"include" the appropriate "app/main*" module since by default
                        //it will not get added to the build since it is loaded by a nested
                        //require in the page*.js files.
                        {
                            //module names are relative to baseUrl/paths config
                            name: '../page/page-search',
                            include: ['app/search'],
                            exclude: ['../config']
                        }
                    ]
                }
            }
        },

        jshint: {
            options: {
                curly: true,
                eqeqeq: true,
                immed: true,
                latedef: true,
                newcap: true,
                noarg: true,
                sub: true,
                undef: true,
                eqnull: true,
                browser: true,
                nomen: true,
                globals: {
                    define: true,
                    requirejs: true,
                    require: true
                }
            },
            all: ['www/js/app/*.js']
        },

        open: {
            server: {
                url: 'http://localhost:<%= connect.options.port %>/html/search.html'
            }
        },

        yuidoc: {
            compile: {
                name: '<%= pkg.name %>',
                description: '<%= pkg.description %>',
                version: '<%= pkg.version %>',
                //url: '<%= pkg.homepage %>',
                options: {
                    paths: '<%= yeoman.app %>/js/common/',
                    //themedir: './docs/_site/yuidoc-bootstrap-theme/',
                    //helpers: ['./docs/_site/yuidoc-bootstrap-theme/helpers/helpers.js'],
                    outdir: './docs/api/'
                }
            }
        },

        watch: {
            livereload: {
                options: {
                    livereload: LIVERELOAD_PORT
                },
                files: [
                    '<%= yeoman.app %>/{,*/}*.html',
                    '{.tmp,<%= yeoman.app %>}/css/{,*/}*.css',
                    '{.tmp,<%= yeoman.app %>}/js/{,*/}*.js',
                    '<%= yeoman.app %>/img/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
                ]
            }
        },
        connect: {
            options: {
                port: 9001,
                // Change this to '0.0.0.0' to access the server from outside.
                hostname: 'localhost'
            },
            livereload: {
                options: {
                    middleware: function (connect) {
                        return [
                            lrSnippet,
                            mountFolder(connect, '.tmp'),
                            mountFolder(connect, yeomanConfig.app)
                        ];
                    }
                }
            },
            test: {
                options: {
                    middleware: function (connect) {
                        return [
                            mountFolder(connect, '.tmp'),
                            mountFolder(connect, 'test')
                        ];
                    }
                }
            },
            dist: {
                options: {
                    middleware: function (connect) {
                        return [
                            mountFolder(connect, yeomanConfig.dist)
                        ];
                    }
                }
            }
        },
        clean: {
            dist: {
                files: [{
                    dot: true,
                    src: [
                        '.tmp'
                    ]
                }]
            },
            server: '.tmp'
        },
        qunit: {
            all: ['test/index.html']
        }
    });

    grunt.registerTask('server', function (target) {
        if (target === 'dist') {
            return grunt.task.run(['build', 'open', 'connect:dist:keepalive']);
        }

        grunt.task.run([
            //'clean:server',
            'connect:livereload',
            'open',
            'watch'
        ]);
    });

    grunt.registerTask('build', ['uglify','cssmin','yuidoc']);
    grunt.registerTask('default', ['jshint', 'qunit', 'build']);

};
