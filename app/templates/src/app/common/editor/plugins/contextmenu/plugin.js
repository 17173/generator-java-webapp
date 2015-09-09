define(function(require, exports, module) {

  'use strict';

  /*global tinymce:true */

  tinymce.PluginManager.add('contextmenu', function(editor) {
    var menu,
      items = [],
      contextmenu,
      contextmenuNeverUseNative = editor.settings['contextmenu_never_use_native'];

    editor.on('contextmenu', function(e) {
      // Block TinyMCE menu on ctrlKey
      if (e.ctrlKey && !contextmenuNeverUseNative) {
        return;
      }

      e.preventDefault();

      // Render menu
      if (!menu) {
        contextmenu = editor.settings.contextmenu ||
          // 'link unlink image component pagebreak | inserttable tableprops row column deletetable';
          'link image component vote pagebreak | inserttable tableprops row column deletetable';

        contextmenu.split(/[ ,]/).forEach(function(name) {
          var item = (name === '|') ? {
              text: name
            } : editor.menuItems[name];

          if (item) {
            item.shortcut = ''; // Hide shortcuts
            items.push(item);
          }
        });

        for (var i = 0; i < items.length; i++) {
          if (items[i].text === '|' && (i === 0 || i === items.length - 1)) {
            items.splice(i, 1);
          }
        }

        menu = new tinymce.ui.Menu({
          items: items,
          context: 'contextmenu'
        }).addClass('contextmenu').renderTo();

        editor.on('remove', function() {
          menu.remove();
          menu = null;
        });
      } else {
        menu.show();
      }

      // Position menu
      var pos = {
        x: e.pageX,
        y: e.pageY
      };

      if (!editor.inline) {
        pos = tinymce.DOM.getPos(editor.getContentAreaContainer());
        pos.x += e.clientX;
        pos.y += e.clientY;
      }

      menu.moveTo(pos.x, pos.y);
    });
  });

});
