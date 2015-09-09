define(function(require, exports, module) {

  'use strict';

  var Confirm = require('confirm');

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

});

/*
  animatedScroll: false,
  autoScrollEditorIntoView: undefined,
  behavioursEnabled: true,
  cursorStyle: "ace",
  displayIndentGuides: true,
  dragDelay: 150,
  dragEnabled: true,
  enableMultiselect: true,
  fadeFoldWidgets: false,
  firstLineNumber: 1,
  fixedWidthGutter: undefined,
  focusTimout: 0,
  foldStyle: undefined,
  fontFamily: undefined,
  fontSize: 16,
  hScrollBarAlwaysVisible: false,
  highlightActiveLine: true,
  highlightGutterLine: true,
  highlightSelectedWord: true,
  maxLines: Infinity,
  mergeUndoDeltas: true,
  minLines: undefined,
  mode: "ace/mode/html",
  newLineMode: "auto",
  overwrite: false,
  printMargin: 80,
  printMarginColumn: 80,
  readOnly: false,
  scrollPastEnd: 0,
  scrollSpeed: 2,
  selectionStyle: "line",
  showFoldWidgets: true,
  showGutter: true,
  showInvisibles: true,
  showLineNumbers: true,
  showPrintMargin: true,
  tabSize: 4,
  theme: "ace/theme/monokai",
  tooltipFollowsMouse: true,
  useSoftTabs: true,
  useWorker: true,
  vScrollBarAlwaysVisible: false,
  wrap: "free",
  wrapBehavioursEnabled: true,
*/
