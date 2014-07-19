define(function (require, exports, module) {

'use strict';

/*global tinymce:true */
tinymce.PluginManager.add('dblclick', function(editor) {

  // editor.on('init', function () {
  //   console.log('init');
  // });

  editor.on('dblclick', function () {
    console.log('dblclick', editor.selection.getNode());
  });

  // editor.addButton('image', {
  //   icon: 'image',
  //   tooltip: 'Image',
  //   onclick: showDialog,
  //   stateSelector: 'img:not([data-mce-object],[data-mce-placeholder])'
  // });

  // editor.addMenuItem('image', {
  //   icon: 'image',
  //   text: 'Insert image',
  //   onclick: showDialog,
  //   context: 'insert',
  //   prependToContext: true
  // });

});

});
