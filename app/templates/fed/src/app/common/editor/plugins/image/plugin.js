define(function (require, exports, module) {

'use strict';

var Modifier = require('./modifier'),
    PaneList = require('./panelist');

/*global tinymce:true */

tinymce.PluginManager.add('image', function(editor) {

  var sidebar, paneList;

  function insertContent (data) {
    editor.insertContent('<img' +
          ' src="' + data.src + '"' +
          ' width="' + data.width + '"' +
          ' height="' + data.height + '"' +
          ' alt="' + data.alt + '"' +
        '/>');
  }

  function showDialog() {
    var imgElm = editor.selection.getNode();

    if (imgElm.nodeName !== 'IMG' ||
        imgElm.getAttribute('data-mce-object') ||
        imgElm.getAttribute('data-mce-component')) {
      imgElm = null;
    }

    // editor, imgElm
    new Modifier({
      // editor: function () {
      //   return editor;
      // },
      events: {
        change: function (e, data) {
          // 事件传递
          // self.fire.apply(self, arguments);

          if (!imgElm) {
            // 插入到侧栏
            paneList.append(data);

            insertContent(data);
          } else {
            imgElm.src = data.src;
            imgElm.alt = data.alt;
            imgElm.width = data.width;
            imgElm.height = data.height;
          }
        }
      },
      imgElm: imgElm,
      title: imgElm ? '编辑图片' : '插入图片'
    });

    // 切换到对应侧栏
    sidebar.slide('#sidebar-image');
  }

  function initPaneList (pane) {
    paneList = sidebar.imagePaneList;

    if (paneList) {
      return;
    }

    paneList = sidebar.imagePaneList = new PaneList({
      element: pane,
      events: {
        select: function (e, data) {
          // 事件传递
          // self.fire.apply(self, arguments);
          insertContent(data);
        }
      }
    });
  }

  // 确保 sidebar 就位
  editor.on('load', function () {

    sidebar = editor.sidebar.on({
      tab: function (e, tab, pane) {
        if (!paneList &&
            tab.prop('hash') === '#sidebar-image') {
          initPaneList(pane);
        }
      }
    });

    editor.on('change nodechange', function (e) {
      if (paneList) {
        paneList.update(editor.getContent());
      }
    });

  });

  editor.addButton('image', {
    icon: 'image',
    tooltip: 'Insert/edit image',
    onclick: showDialog,
    stateSelector: 'img:not([data-mce-placeholder],[data-mce-component])'
  });

  editor.addMenuItem('image', {
    icon: 'image',
    text: 'Insert image',
    onclick: showDialog,
    context: 'insert',
    prependToContext: true
  });

});

});
