define(function (require, exports, module) {

'use strict';

var $ = require('$'),
    Tabs = require('tabs');

/*global tinymce:true */

tinymce.PluginManager.add('sidebar', function (editor) {
  var sidebar;

  editor.on('init', function() {
    var statusbar, panes, panesHeight;

    // sidebar 按钮右浮动
    // $('.mce-i-sidebar').closest('[role=group]').css('float', 'right');

    editor.sidebar = sidebar = new Tabs({
      classPrefix: 'mce-sidebar',
      container: editor.getContainer(),
      data: {
        tabs: [
          {
            id: 'sidebar-image',
            name: '图片'
          },
          {
            id: 'sidebar-video',
            name: '视频'
          },
          {
            id: 'sidebar-gallery',
            name: '组图'
          }
        ]
      },
      initialTab: -1
    });

    // 侦听状态栏 resize
    statusbar = editor.theme.panel.find('#statusbar')[0];

    statusbar.on('ResizeStart', function () {
      panes = sidebar.role('panes');
      panesHeight = panes.height();

      panes.css({
        flex: 'none',
        height: panesHeight
      });
    });

    statusbar.on('Resize', function (e) {
      panes.css({
        height: panesHeight + e.deltaY
      });
    });

    statusbar.on('ResizeEnd', function () {
      panes.css({
        flex: 1,
        height: 'auto'
      });
    });
  });

  editor.addButton('sidebar', {
    icon: 'sidebar',
    tooltip: '侧栏',
    onclick: function () {
      if (this.active()) {
        this.active(false);
        sidebar.hide();
      } else {
        this.active(true);
        sidebar.show();
      }
    },
    active: true
  });

});

});
