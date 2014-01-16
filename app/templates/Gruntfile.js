'use strict';

var exec = require('child_process').exec;
var child;

module.exports = function(grunt) {
    // load all grunt tasks
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
    var transport = require('grunt-cmd-transport');
    var style = transport.style.init(grunt);
    var text = transport.text.init(grunt);
    var script = transport.script.init(grunt);
    // configurable paths
    var yeomanConfig = {
        app: 'admin/static/js/app',
        dist: 'cdn/admin'
    };
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        cfg: grunt.file.readJSON('config.json'),
        yeoman: yeomanConfig,
        jshint: {
            options: {
                "globals": {
                    "jQuery": true,
                    "define": true
                },
                "jquery": true,//检查预定义的全局变量，防止出现$未定义，该项根据实际代码修改
                "bitwise": false,//不检查位运算
                "browser": true,//通过浏览器内置的全局变量检测
                "devel":true,//允许对调试用的alert和console.log的调用
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
                "smarttabs": true,//允许混合tab和空格缩进
                "strict": false,//不强制使用es5严格模式
                "sub": true,//允许用[]形式访问对象属性
                "undef": true,//禁止明确未定义的变量调用，如果你的变量（myvar）是在其他文件中定义的，可以使用/*global myvar */绕过检测
                "unused": false,//允许定义没用的变量，在某些函数回调中，经常出现多个参数，但不一定会用
                "expr": true,
                "multistr": false//禁止多行字符串，改用加号连接
            },
            all: ['<%= yeoman.app %>/**/*.js']
        },

        open: {
            server: {
                url: 'http://localhost:<%= cfg.server.port %>'
            }
        },

        yuidoc: {
            compile: {
                name: '<%= pkg.name %>',
                description: '<%= pkg.description %>',
                version: '<%= pkg.version %>',
                options: {
                    paths: '<%= yeoman.app %>/',
                    outdir: './docs/api/'
                }
            }
        },

        transport : {
            options : {
                paths : ['.'],
                alias: '<%= pkg.spm.alias %>',
                parsers : {
                    '.js' : [script.jsParser],
                    '.css' : [style.css2jsParser],
                    '.html' : [text.html2jsParser]
                }
            },

            app : {
                options : {
                    idleading : 'app/'
                },

                files : [
                    {
                        cwd : '<%= yeoman.app %>/',
                        src : '**/*',
                        filter : 'isFile',
                        dest : '.build/app'
                    }
                ]
            }
        },
        concat : {
            options : {
                paths : ['.'],
                include : 'relative'
            },
            app : {
                options : {
                    include : 'all'
                },
                files: [
                    {
                        expand: true,
                        cwd: '.build/',
                        src: ['<%= yeoman.app %>/**/*.js'],
                        dest: 'dist/',
                        ext: '.js'
                    }
                ]
            }
        },
        watch: {
            app: {
                files: ["<%= yeoman.app %>/{,*/}*.js"],
                tasks: ["jshint"],
                options: {
                    nospawn: true,
                    interrupt: false,
                    debounceDelay: 100
                }
            }
        },

        uglify : {
            app : {
                files: [
                    {
                        expand: true,
                        cwd: 'dist/',
                        src: ['<%= yeoman.app %>/**/*.js', '!<%= yeoman.app %>/**/*-debug.js'],
                        dest: 'dist/',
                        ext: '.js'
                    }
                ]
            }
        },
        clean : {
            spm : ['.build']
        },
        qunit: {
            all: ['test/index.html']
        }
    });

    /*grunt.registerTask('server', function (target) {
        child = exec('fed server -w -p 3000 config.json', function(error, stdout, stderr) {
            console.log('stdout: ' + stdout);
            console.log('stderr: ' + stderr);
            if (error !== null) {
                console.log('exec error: ' + error);
            } else {
                grunt.task.run([
                    'open',
                    'watch'
                ]);
            }
        });
    });*/

    grunt.registerTask('default', ['watch']);
    grunt.registerTask('build', ['jshint','transport', 'concat', 'uglify','clean']);

};
