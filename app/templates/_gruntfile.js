/*global module:true */
/*global require:true */

module.exports = function(grunt) {

  'use strict';

  // load all grunt tasks
  require('time-grunt')(grunt);
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  /**
   * 注：如果只打单模块，有更改 urlmap 的话，必须打 header 包
   * @type {Array}
   */
  var mods = [
    'common',
    'header',
    'login',
    'demo'
  ];

  var assets = [
    'css',
    'font',
    'img',
    'js',
    'mov'
  ];

  function configJSHint(presets) {
    var cfg = presets || {};

    cfg.options = {
      jshintrc: true
    };

    mods.forEach(function (mod) {
      cfg[mod] = [
        'src/app/' + mod + '/**/*.js',
        '!src/app/common/editor/tinymce/**/*.js',
        '!src/app/common/code/ace/**/*.js'
      ];
    });

    cfg.editor = [
      'src/app/common/editor/**/*.js',
      '!src/app/common/editor/tinymce/**/*.js'
    ];

    cfg.code = [
      'src/app/common/code/**/*.js',
      '!src/app/common/code/ace/**/*.js'
    ];

    return cfg;
  }

  function configTransport(presets) {
    var cfg = presets || {};

    cfg.options = {
      debug: true,
      idleading: '',
      alias: '<%= spmAlias %>',
      paths: [
        'sea-modules',
        'src/app'
      ]
    };

    // for app/**
    mods.forEach(function (mod) {
      cfg[mod] = {
        options: {
          idleading: mod  + '/'
        },
        files: [{
          expand: true,
          cwd: 'src/app/' + mod + '/',
          src: [
            '**/*.js',
            '**/*.css',
            '**/*.handlebars',
            '**/*.tpl',
            '!editor/tinymce/**/*.js',
            '!code/ace/**/*.js'
          ],
          dest: '.build/app/' + mod + '/'
        }]
      };
    });

    // for editor
    cfg.editor = {
      options: {
        idleading: 'common/editor/'
      },
      files: [{
        expand: true,
        cwd: 'src/app/common/editor/',
        src: [
          '**/*.js',
          '**/*.css',
          '**/*.handlebars',
          '**/*.tpl',
          '!tinymce/**/*.js'
        ],
        dest: '.build/app/common/editor/'
      }]
    };

    // for code
    cfg.code = {
      options: {
        idleading: 'common/code/'
      },
      files: [{
        expand: true,
        cwd: 'src/app/common/code/',
        src: [
          '**/*.js',
          '**/*.css',
          '**/*.handlebars',
          '**/*.tpl',
          '!ace/**/*.js'
        ],
        dest: '.build/app/common/code/'
      }]
    };

    return cfg;
  }

  function configConcat(presets) {
    var cfg = presets || {};

    cfg.options = {
      debug: true,
      include: 'relative',
      paths: [
        'sea-modules',
        'src/app'
      ]
    };

    mods.forEach(function (mod) {
      if (mod === 'common') {
        cfg[mod] = {
          files: [{
            expand: true,
            cwd: '.build/app/' + mod + '/',
            src: [
              '**/*.js',
              '!editor/**/*.js',
              '!code/**/*.js'
            ],
            dest: 'dist/app/' + mod + '/'
          }]
        };
      } else {
        cfg[mod] = {
          files: [{
            expand: true,
            cwd: '.build/app/' + mod + '/',
            src: [
              '**/*.js'
            ],
            dest: 'dist/app/' + mod + '/'
          }]
        };
      }
    });

    cfg.editor = {
      files: [{
        expand: true,
        cwd: '.build/app/common/editor/',
        src: ['**/*.js', '!tinymce/**/*.js'],
        dest: 'dist/app/common/editor/'
      }]
    };

    cfg.code = {
      files: [{
        expand: true,
        cwd: '.build/app/common/code/',
        src: ['**/*.js', '!ace/**/*.js'],
        dest: 'dist/app/common/code/'
      }]
    };

    return cfg;
  }

  function configUglify(presets) {
    var cfg = presets || {};

    cfg.options = {
      // remove HH:MM:ss
      banner: '/*! <%= jsBanner %> */\n',
      beautify: {
        'ascii_only': true
      },
      compress: {
        'global_defs': {
          'DEBUG': false
        },
        'dead_code': true
      }
    };

    // for app/**
    mods.forEach(function (mod) {
      if (mod === 'common') {
        cfg[mod] = {
          files: [{
            expand: true,
            cwd: 'dist/app/' + mod + '/',
            src: [
              '**/*.js',
              '!**/*-debug*.js',
              '!editor/**/*.js',
              '!code/**/*.js'
            ],
            dest: 'dist/app/' + mod + '/'
          }]
        };
      } else {
        cfg[mod] = {
          files: [{
            expand: true,
            cwd: 'dist/app/' + mod + '/',
            src: [
              '**/*.js',
              '!**/*-debug*.js'
            ],
            dest: 'dist/app/' + mod + '/'
          }]
        };
      }
    });

    assets.forEach(function (asset) {
      cfg[asset] = {
        files: [{
          expand: true,
          cwd: 'dist/' + asset + '/',
          src: ['**/*.js', '!**/*-debug*.js'],
          dest: 'dist/' + asset + '/'
        }]
      };
    });

    cfg.editor = {
      files: [{
        expand: true,
        cwd: 'dist/app/common/editor/',
        src: ['**/*.js', '!**/*-debug*.js'],
        dest: 'dist/app/common/editor/'
      }]
    };

    cfg.code = {
      files: [{
        expand: true,
        cwd: 'dist/app/common/code/',
        src: ['**/*.js', '!**/*-debug*.js'],
        dest: 'dist/app/common/code/'
      }]
    };

    return cfg;
  }

  function configClean(presets) {
    var cfg = presets || {};

    cfg.options = {
      force: true
    };

    mods.forEach(function (mod) {
      if (mod === 'common') {
        cfg[mod] = {
          src: [
              '.build/app/' + mod + '/',
              'dist/app/' + mod + '/',
              '!.build/app/' + mod + '/editor/',
              '!dist/app/' + mod + '/editor/',
              '!.build/app/' + mod + '/code/',
              '!dist/app/' + mod + '/code/']
        };
        cfg[mod + '-after'] = {
          src: [
              '.build/app/' + mod + '/',
              '!.build/app/' + mod + '/editor/',
              '!.build/app/' + mod + '/code/'
          ]
        };
      } else {
        cfg[mod] = {
          src: [
              '.build/app/' + mod + '/',
              'dist/app/' + mod + '/']
        };
        cfg[mod + '-after'] = {
          src: [
              '.build/app/' + mod + '/'
          ]
        };
      }
    });

    assets.forEach(function (asset) {
      cfg[asset] = {
        src: ['dist/' + asset + '/']
      };
    });

    cfg.editor = {
      src: ['.build/app/common/editor/', 'dist/app/common/editor/']
    };

    cfg['editor-after'] = {
      src: ['.build/app/common/editor/']
    };

    cfg.code = {
      src: ['.build/app/common/code/', 'dist/app/common/code/']
    };

    cfg['code-after'] = {
      src: ['.build/app/common/code/']
    };

    cfg.build = {
      src: ['.build/']
    };

    return cfg;
  }

  function configCopy(presets) {
    var cfg = presets || {};

    assets.forEach(function (asset) {
      cfg[asset] = {
        files: [{
          expand: true,
          cwd: 'src/' + asset + '/',
          src: [
            '**/*.gif',
            '**/*.png',
            '**/*.jpg',
            '**/*.eot',
            '**/*.svg',
            '**/*.ttf',
            '**/*.woff',
            '**/*.otf',
            '**/*.js',
            '**/*.swf',
            '**/app.css',
            '**/login.css',
            '!sea-seajs-text.js'
          ],
          dest: 'dist/' + asset + '/'
        }]
      };
    });

    cfg['editor-core'] = {
      files: [{
        expand: true,
        cwd: 'src/app/common/editor/tinymce/',
        src: ['**/*'],
        dest: 'dist/app/common/editor/tinymce/'
      }]
    };

    cfg['code-core'] = {
      files: [{
        expand: true,
        cwd: 'src/app/common/code/ace/',
        src: ['**/*'],
        dest: 'dist/app/common/code/ace/'
      }]
    };

    return cfg;
  }

  function configLess(presets) {
    var cfg = presets || {};

    assets.forEach(function (asset) {
      if (asset !== 'css') {
        cfg[asset] = {};
        return true;
      }
      var files = {};
      files['dist/' + asset + '/app.css'] = 'src/' + asset + '/app.less';
      files['src/' + asset + '/app.css'] = 'src/' + asset + '/app.less';
      files['dist/' + asset + '/login.css'] = 'src/' + asset + '/login.less';
      files['src/' + asset + '/login.css'] = 'src/' + asset + '/login.less';
      cfg[asset] = {
        options: {
          paths: ['src/css'],
          cleancss: true
        },
        files: files
      };
    });

    return cfg;
  }

  function configWrap(presets) {
    var cfg = presets || {};

    assets.forEach(function (asset) {
      if (asset !== 'js') {
        cfg[asset] = {};
        return true;
      }
      cfg[asset] = {
        src: ['dist/js/sea-config.js'],
        dest: 'dist/js/sea-config.js',
        options: {
          separator: '',
          // need a custom value to pass var
          version: '<%= buildVersion %>',
          copyright: '<%= copyright %>',
          // compile (edit) content with function
          compiler: function(content, options) {
            return content.replace(/@VERSION/g, options.version)
              .replace(/@COPYRIGHT/g, options.copyright)
              .replace(/\'@DEBUG\'/g, false);
          }
        }
      };
    });

    var scriptPath = './WEB-INF/template/ftl/admin/inc/script.ftl';
    cfg.ftl = {
      src: [scriptPath],
      dest: scriptPath,
      ext: '.js',
      options: {
        separator: '',
        // need a custom value to pass var
        version: '<%= buildVersion %>',
        // compile (edit) content with function
        compiler: function(content, options) {
          return content.replace(/(sea-config.js\?)\d*/g, '$1' + options.version);
        }
      }
    };


    return cfg;
  }

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    watch: {
      css: {
        files: ['src/less/**/*.less'],
        tasks: ['less:css']
      }
    },

    livereload: {
      files: [
        'mock/**/*',
        'src/**/*',
        'WEB-INF/**/*'
      ]
    },

    jshint: configJSHint(),

    uglify: configUglify(),

    copy: configCopy(),

    transport: configTransport(),

    concat: configConcat(),

    clean: configClean(),

    less: configLess(),

    wrap: configWrap()

  });

  grunt.registerTask('build-editor', [
    'jshint:editor',
    'clean:editor',
    'copy:editor-core',
    'transport:editor',
    'concat:editor',
    'uglify:editor'
  ]);

  grunt.registerTask('build-code', [
    'jshint:code',
    'clean:code',
    'copy:code-core',
    'transport:code',
    'concat:code',
    'uglify:code'
  ]);

  mods.forEach(function(mod) {
    grunt.registerTask('build-mod-' + mod, [
      'jshint:' + mod,
      'clean:' + mod,
      'transport:' + mod,
      'concat:' + mod,
      'uglify:' + mod,
      'build-asset'
    ]);
  });

  grunt.registerTask('build-mod', mods.map(function (mod) {
    return 'build-mod-' + mod;
  }));

  grunt.registerTask('clean-mod-after', mods.map(function (mod) {
    return 'clean:' + mod + '-after';
  }));

  assets.forEach(function(asset) {
    grunt.registerTask('asset-' + asset, [
      'clean:' + asset,
      'copy:' + asset,
      'less:' + asset,
      'wrap:' + asset,
      'uglify:' + asset
    ]);
  });

  grunt.registerTask('build-asset', assets.map(function (asset) {
    return 'asset-' + asset;
  }));

  grunt.registerTask('clean-after', ['clean-mod-after']);

  grunt.registerTask('build-ftl', ['wrap:ftl']);

  grunt.registerTask('build-clean', ['clean:build']);

  grunt.registerTask('build', ['build-clean','build-asset', 'build-mod', 'build-editor', 'build-code','wrap:ftl']);

  grunt.registerTask('default', ['watch']);

};
