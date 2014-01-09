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
                    appDir: '<%= yeoman.app %>',
                    baseUrl: './js/lib',
                    mainConfigFile: '<%= yeoman.app %>/js/main.js',
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
                    dir: '<%= yeoman.dist %>',
                    //skipDirOptimize: true,
                    modules: [
                        //First set up the common build layer.
                        {
                            //module names are relative to baseUrl
                            name: '../main',
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
                            name: '../page/search',
                            include: ['app/search'],
                            exclude: ['../main']
                        }
                    ]
                }
            }
        },

        jshint: {
            options: {
                globals: {
                    define: true,
                    requirejs: true,
                    require: true
                },
                "jquery": true,//检查预定义的全局变量，防止出现$未定义，该项根据实际代码修改 
                "bitwise": false,//不检查位运算
                "browser": true,//通过浏览器内置的全局变量检测
                "devel":false,//禁止对调试用的alert和console.log的调用
                "camelcase": true,//使用驼峰式命名
                "curly": true,//强制使用花括号
                "eqeqeq": false,//不强制使用===比较运算符
                "es3":true,//兼容es3规范，针对旧版浏览器编写的代码
                "esnext": false, //不使用最新的es6规范
                "forin":false,//不强制过滤遍历对象继承的属性    
                "freeze":false,//不限制对内置对象的扩展
                "immed": true,//禁止未用括号包含立即执行函数
                "indent": false,//不强制缩进
                "latedef": true,//禁止先调用后定义
                "maxdepth":3,//代码块嵌套最多不超过3层
                "maxparams":3,//函数最多不超过3个参数
                "newcap": false,//不对首字母大写的函数强制使用new
                "noarg": false,//不禁止对arguments.caller和arguments.callee的调用
                "noempty":false,//禁止空代码块
                "nonew":false,//允许直接new实例化而不赋值给变量
                "plusplus":false,//允许++和--运算符使用
                "quotmark": "single",//字符串使用单引号
                "undef":true,//禁止明确未定义的变量调用，如果你的变量（myvar）是在其他文件中定义的，可以使用/*global myvar */绕过检测
                "unused": true,//禁止定义没用的变量
                "strict": false,//不强制使用es5严格模式
                "multistr": false//禁止多行字符串，改用加号连接
            },
            all: ['<%= yeoman.app %>/js/app/*.js']
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

    grunt.registerTask('build', ['jshint','requirejs']);
    grunt.registerTask('default', ['jshint', 'qunit', 'build']);

};
