  'use strict';

  /*global tinymce:true */

  tinymce.PluginManager.add('hr', function(editor) {

    editor.addCommand('InsertHorizontalRule', function() {
      editor.execCommand('mceInsertContent', false, '<hr />');
      // 多插入一空行
      editor.insertContent('<p><br></p>');
    });

    editor.addButton('hr', {
      icon: 'hr',
      tooltip: 'Horizontal line',
      cmd: 'InsertHorizontalRule',
      stateSelector: 'hr'
    });

    editor.addMenuItem('hr', {
      icon: 'hr',
      text: 'Horizontal line',
      cmd: 'InsertHorizontalRule',
      context: 'insert'
    });
  });

