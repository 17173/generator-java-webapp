  'use strict';

  var Confirm = require('pandora-confirm');

  var CodeEditor = require('../../../code/editor');

  /*global tinymce:true */

  tinymce.PluginManager.add('code', function(editor) {

    var codeEditor;

    function saveChange() {
      editor.focus();
      editor.undoManager.transact(function() {
        editor.setContent(codeEditor.getValue());
      });

      editor.selection.setCursorLocation();
      editor.nodeChanged();
    }

    function showDialog() {
      codeEditor = new CodeEditor({
        coreCfg: {
          maxLines: 37,
          minLines: 37,
          fontSize: 14,
          vScrollBarAlwaysVisible: false,
          hScrollBarAlwaysVisible: false,
          useWorker: false,
          wrap: 'off'
        },
        value: editor.getContent({
          'source_view': true
        })
      });

      new Confirm({
        children: [codeEditor],
        css: {
          position: 'absolute',
          width: 1100,
          height: 825
        },
        events: {
          render : function(){
            codeEditor.editor.getSession().setUseWrapMode(true);
          },
          submit: function(e) {
            saveChange();
          }
        },
        maskFixed: true,
        title: '编辑源代码'
      });
    }

    editor.addCommand('mceCodeEditor', showDialog);

    editor.addButton('code', {
      icon: 'code',
      tooltip: 'Source code',
      onclick: showDialog
    });

    editor.addMenuItem('code', {
      icon: 'code',
      text: 'Source code',
      context: 'tools',
      onclick: showDialog
    });

  });

