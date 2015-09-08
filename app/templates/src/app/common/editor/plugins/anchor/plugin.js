define(function(require, exports, module) {

  'use strict';

  /*global tinymce:true */

  // TODO: 选中高亮

  tinymce.PluginManager.add('anchor', function(editor) {

    function showDialog() {
      var selectedNode = editor.selection.getNode();

      editor.windowManager.open({
        title: 'Anchor',
        body: {
          type: 'textbox',
          name: 'name',
          size: 40,
          label: 'Name',
          value: selectedNode.name || selectedNode.id
        },
        onSubmit: function(e) {
          editor.execCommand('mceInsertContent', false, editor.dom.createHTML('a', {
            id: e.data.name
          }));
        }
      });
    }

    editor.addButton('anchor', {
      icon: 'anchor',
      tooltip: 'Anchor',
      onclick: showDialog,
      stateSelector: 'a:not([href])'
    });

    editor.addMenuItem('anchor', {
      icon: 'anchor',
      text: 'Anchor',
      context: 'insert',
      onclick: showDialog
    });

  });

});
