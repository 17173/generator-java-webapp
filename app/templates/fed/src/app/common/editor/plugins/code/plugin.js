define(function (require, exports, module) {

'use strict';

var $ = require('$'),
  Confirm = require('confirm');

require('../../../ace/ace');

/*global tinymce:true */
tinymce.PluginManager.add('code', function(editor) {

  function initAce (dialog) {

    /*global ace:true */
    dialog.ace = ace.edit('aceContent');

    dialog.ace.setOptions({
      theme: 'ace/theme/chrome',
      mode: 'ace/mode/handlebars',
      maxLines: 18,
      minLines: 18,
      fontSize: 18,
      displayIndentGuides: true,
      showInvisibles: true,
      showPrintMargin: false,
      // `free` 导致换行处叠字BUG
      wrap: 79
    });

    dialog.ace.setValue(editor.getContent({'source_view': true}));
  }

  function freeAce (dialog) {
    dialog.ace.destroy();

    document.body.style.overflow = '';
  }

  function showDialog () {
    document.body.style.overflow = 'hidden';

    new Confirm({
      baseXY: {
        y: 0
      },
      selfXY: {
        y: 0
      },
      title: '编辑源代码',
      content: '<div id="aceContent"></div>',
      css: {
        width: 918
      },
      events: {
        submit: function (e) {
          var self = this;

          editor.focus();

          editor.undoManager.transact(function() {
            editor.setContent(self.ace.getValue());
          });

          editor.selection.setCursorLocation();
          editor.nodeChanged();
        },
        // cancel: function () {

        // },
        render: function () {
          // document.getElementById('aceContent').textContent =
          //     editor.getContent({'source_view': true});

          initAce(this);
        },
        destroy: function () {
          freeAce(this);
        }
      }
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