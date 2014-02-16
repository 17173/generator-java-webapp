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
        app: 'src/app',
        sea: 'sea-modules',
        dist: 'dist'
    };
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        cfg: grunt.file.readJSON('config.json'),
        yeoman: yeomanConfig,
        jshint: {
            options: {
                // read jshint options from jshintrc file
                "jshintrc": ".jshintrc"
            },
            app: ['<%= yeoman.app %>/**/*.js']
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

        transport: {
            options: {
                paths: ['<%= yeoman.sea %>'],
                alias: '<%= pkg.spm.alias %>',
                parsers: {
                    '.js' : [script.jsParser],
                    '.css' : [style.css2jsParser],
                    '.html' : [text.html2jsParser]
                }
            },

            app: {
                options: {
                    idleading: 'app/'
                },

                files: [
                    {
                        cwd: '<%= yeoman.app %>/',
                        src: '**/*',
                        filter: 'isFile',
                        dest: '.build/app'
                    }
                ]
            }
        },
        concat: {
            options: {
                paths: ['<%= yeoman.sea %>'],
                include: 'relative'
            },
            app: {
                options: {
                    include: 'all'
                },
                files: [
                    {
                        expand: true,
                        cwd: '.build/',
                        src: ['app/**/*.js'],
                        dest: '<%= yeoman.dist %>/',
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

        uglify: {
            app: {
                files: [
                    {
                        expand: true,
                        cwd: '<%= yeoman.dist %>/',
                        src: ['app/**/*.js', '!app/**/*-debug.js'],
                        dest: '<%= yeoman.dist %>/',
                        ext: '.js'
                    }
                ]
            }
        },
        copy: {
            sea: {
                files: [
                    {
                        expand: true,
                        cwd: '<%= yeoman.sea %>/seajs/',
                        src: ['**'],
                        dest: '<%= yeoman.dist %>/sea-modules/seajs/'
                    }
                ]
            }
        },
        clean: {
            build: ['.build']
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
    grunt.registerTask('build', ['jshint','transport', 'concat', 'uglify','copy','clean']);

};
