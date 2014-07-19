define(function (require, exports, module) {

'use strict';

var DialogGallery = require('common/gallery/dialog');

var PaneList = require('../image/panelist');

/*global tinymce:true */

tinymce.PluginManager.add('browse', function(editor) {

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

    new DialogGallery({
      galleryOptions: {
        // url: 'imageSearch'
        selectable: 'multiple'
      },
      events: {
        // 从图库中选择
        processPic: function (e, data) {
          paneList.append({
            src: data.thumbUrl,
            width: data.width,
            height: data.height,
            alt: data.remark
          });
        }
      }
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

  editor.addButton('browse', {
    icon: 'browse',
    tooltip: 'Browse',
    onclick: showDialog
  });

});

});
