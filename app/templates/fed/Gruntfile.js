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
  var template = transport.template.init(grunt);
  // configurable paths
  var yeomanConfig = {
    app: 'src/app',
    css: 'src/css',
    sea: 'sea-modules',
    dist: 'dist'
  };
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
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
          outdir: './doc'
        }
      }
    },

    transport: {
      options: {
        paths: ['<%= yeoman.sea %>'],
        /*handlebars: {
         id: 'handlebars'
         },*/
        parsers: {
          '.js' : [script.jsParser],
          '.css' : [style.css2jsParser],
          '.html' : [text.html2jsParser],
          '.handlebars': [template.handlebarsParser]
        },
        alias: '<%= pkg.spm.alias %>'
      },

      app: {
        options: {
          idleading: 'app/'
        },

        files: [
          {
            expand: true,
            cwd: '<%= yeoman.app %>/',
            src: ['**/*', '!**/package.json'],
            filter: 'isFile',
            dest: '.build/app'
          }
        ]
      }
    },
    concat: {
      options: {
        paths: ['<%= yeoman.sea %>'],
        include: 'all'
      },
      app: {
        options: {
          // 不能用 style.css2js ,不然打包失败
          // https://github.com/spmjs/grunt-cmd-concat/issues/32
          css2js: transport.style.css2js
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
    clean: {
      build: ['.build']
    },
    fed: {
      server: {
        config: 'fed.json'
      }
    },
    copy: {
      app: {
        expand: true,
        cwd: 'src/app/',
        src: ['**'],
        dest: '_site/src/app'
      },
      sea: {
        expand: true,
        cwd: 'sea-modules',
        src: ['**'],
        dest: '_site/sea-modules'
      }
    },
    nico: {
      config:{}
    },
    qunit: {
      all: ['test/index.html']
    }
  });

  grunt.registerTask('doc', ['nico']);
  grunt.registerTask('default', ['fed']);
  grunt.registerTask('server', ['fed']);
  grunt.registerTask('build', [/*'jshint',*/, 'transport', 'concat', 'uglify','clean']);

};
