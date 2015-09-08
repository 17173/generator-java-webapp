define(function(require, exports, module) {

  'use strict';

  /*global tinymce:true */

  tinymce.PluginManager.add('sidebar', function(editor) {

    editor.addButton('sidebar', {
      icon: 'sidebar',
      tooltip: '侧栏',
      onclick: function() {
        if (this.active()) {
          this.active(false);
          editor.sidebar.hide();
        } else {
          this.active(true);
          editor.sidebar.show();
        }
      },
      active: true
    });

  });

});
