define(function (require, exports, module) {

'use strict';

/*global tinymce:true */

tinymce.PluginManager.add('wordcount', function(editor) {

  function getCount() {
    return editor.getContent({format: 'text'}).length;
  }

  function update() {
    editor.theme.panel.find('#wordcount').text(['Words: {0}', getCount()]);
  }

  editor.on('init', function() {
    var statusbar = editor.theme.panel && editor.theme.panel.find('#statusbar')[0];

    if (statusbar) {
      window.setTimeout(function() {
        statusbar.insert({
          type: 'label',
          name: 'wordcount',
          text: ['Words: {0}', getCount()],
          classes: 'wordcount',
          disabled: editor.settings.readonly
        }, 0);

        editor.on('setcontent beforeaddundo', update);

        editor.on('keyup', function(e) {
          if (e.keyCode === 32) {
            update();
          }
        });
      }, 0);
    }
  });

});

});
