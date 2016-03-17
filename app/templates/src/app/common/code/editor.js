  'use strict';

  var $ = require('jquery'),
    Widget = require('pandora-widget');

  /* global ace:true */
  var Editor = module.exports = Widget.extend({

    defaults: {
      css: {
        'z-index': 1,
        border: '1px solid #ddd',
        'border-radius': 3
      },
      coreCfg: {
        /**
         * github 轻主题
         * https://gist.github.com/lynzz/48b7c47ab3ce1aec29b2
         * 需要下载 ace 源文件，https://github.com/ajaxorg/ace
         * 粘贴到 ace/theme/github.css，重新 build
         * 执行 node ./Makefile.dryice.js -m -nc
         * @type {String}
         */
        theme: 'ace/theme/github',
        mode: 'ace/mode/html',
        maxLines: 18,
        minLines: 10,
        fontSize: 13,
        tabSize: 2,
        displayIndentGuides: true,
        showInvisibles: false,
        showPrintMargin: false,
        vScrollBarAlwaysVisible: true,
        // 错误提示
        useWorker: false,
        wrap: 'off'
      }
    },

    setup: function() {
      this.initField();
      this.render();
      this.initEditor();
    },

    getValue: function() {
      return this.editor.getValue();
    },

    setValue: function(value) {
      return this.editor.setValue(value);
    },

    destroy: function() {
      this.editor.destroy();
      Editor.superclass.destroy.apply(this);
    },

    initField: function() {
      var field = $(this.option('field')),
        value;

      if (field.length) {
        this.field = field.hide();
        if ((value = this.option('value'))) {
          field.val(value);
        }
      }
    },

    initEditor: function() {
      var editor = this.editor = ace.edit(this.element[0]),
        field = this.field,
        value;

      editor.setOptions(this.option('coreCfg'));

      if ((value = field ? field.val() : this.option('value'))) {
        editor.setValue(value);
      }

      if (field) {
        editor.on('change', function() {
          field.val(editor.getValue());
        });

        field.on('mousedown', function() {
          editor.focus();
        });
      }
      this.fire('initEditor');
    }

  });

