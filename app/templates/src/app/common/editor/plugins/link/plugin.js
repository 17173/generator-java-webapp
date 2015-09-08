define(function(require, exports, module) {

  'use strict';

  var Modifier = require('./modifier');

  /*global tinymce:true */

  tinymce.PluginManager.add('link', function(editor) {

    function showDialog() {
      var selection = editor.selection,
        anchorElm = selection.getNode(),
        onlyText, initialText;

      if (anchorElm.nodeName !== 'A' ||
        anchorElm.getAttribute('href') === null) {
        anchorElm = null;
      }

      if (anchorElm) {
        initialText = anchorElm.textContent;
      }

      function isOnlyTextSelected() {
        var html = selection.getContent();

        // Partial html and not a fully selected anchor element
        if (/</.test(html) && (!/^<a [^>]+>[^<]+<\/a>$/.test(html) || html.indexOf('href=') == -1)) {
          return false;
        }

        if (anchorElm) {
          var nodes = anchorElm.childNodes,
            i;

          if (nodes.length === 0) {
            return false;
          }

          for (i = nodes.length - 1; i >= 0; i--) {
            if (nodes[i].nodeType != 3) {
              return false;
            }
          }
        }

        return true;
      }

      // editor, anchorElm
      new Modifier({
        events: {
          valid: function(e) {
            var data = this.form.makeFormData().toJSON(),
              text = data.text;

            if (!data.href) {
              editor.execCommand('unlink');
            } else {
              delete data.text;

              if (anchorElm) {
                editor.focus();

                if (onlyText && text !== initialText) {
                  anchorElm.textContent = text;
                }

                editor.dom.setAttribs(anchorElm, data);

                selection.select(anchorElm);
                editor.undoManager.add();
              } else {
                if (onlyText) {
                  editor.insertContent(editor.dom.createHTML('a', data, editor.dom.encode(text)));
                } else {
                  editor.execCommand('mceInsertLink', false, data);
                }
              }
            }

            this.close();
          }
        },
        anchorElm: anchorElm,
        onlyText: (onlyText = isOnlyTextSelected()),
        selectedText: unescape(selection.getContent()),
        title: anchorElm ? '编辑链接' : '插入链接'
      });
    }
    function unlinkPostRender() {
      /*jshint validthis:true*/
      toggleMenuItem(this, 'a[href]');
    }

    function toggleMenuItem(ctrl, selector) {

      function bindSelectionListener() {

        function toggleMenuText(matched) {
          matched ? ctrl.show() : ctrl.hide();
        }

        toggleMenuText(editor.dom.getParent(editor.selection.getStart(), selector));

        editor.selection.selectorChanged(selector, toggleMenuText);
      }

      if (editor.initialized) {
        bindSelectionListener();
      } else {
        editor.on('init', bindSelectionListener);
      }
    }


    function postRender() {
      /*jshint validthis:true*/
      changeMenuText(this, 'a[href]');
    }

    function unescape(string){
     if (string === null) {
        return '';
     }
     return ('' + string).replace(/(&amp;|&lt;|&gt;|&quot;|&#x27;)/g,function(match){
      return{
           '&amp;' :'&',
           '&lt;' :'<',
           '&gt;' :'>',
           '&quot;' :'"',
           /*jshint quotmark:double*/
           "&#x27;": "'"
         }[match];
     });
    }

    function changeMenuText(ctrl, selector) {

      function bindSelectionListener() {

        function toggleMenuText(matched) {
          ctrl.getEl().lastChild.innerHTML = ctrl.translate(matched ? 'Edit link' : 'Insert link');
        }

        toggleMenuText(editor.dom.getParent(editor.selection.getStart(), selector));

        editor.selection.selectorChanged(selector, toggleMenuText);
      }

      if (editor.initialized) {
        bindSelectionListener();
      } else {
        editor.on('init', bindSelectionListener);
      }
    }

    // 确保右键选中
    editor.on('mouseup', function(e) {
      if (e.target.nodeName === 'a' &&
          e.target.getAttribute('href') !== null) {
        editor.selection.select(e.target);
      }
    });

    editor.addButton('link', {
      icon: 'link',
      tooltip: 'Link',
      shortcut: 'Ctrl+K',
      onclick: showDialog,
      stateSelector: 'a[href]'
    });

    editor.addShortcut('Ctrl+K', '', showDialog);

    editor.addButton('unlink', {
      icon: 'unlink',
      tooltip: 'Remove link',
      cmd: 'unlink',
      stateSelector: 'a[href]'
    });

    editor.addMenuItem('link', {
      icon: 'link',
      text: 'Link',
      shortcut: 'Ctrl+K',
      onclick: showDialog,
      onPostRender: postRender,
      stateSelector: 'a[href]',
      context: 'insert',
      prependToContext: true
    });

    editor.addMenuItem('unlink', {
      icon: 'unlink',
      text: 'Remove link',
      cmd: 'unlink',
      onPostRender: unlinkPostRender,
      stateSelector: 'a[href]',
      context: 'insert',
      prependToContext: true
    });

  });

});
