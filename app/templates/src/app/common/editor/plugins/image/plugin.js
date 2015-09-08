define(function(require, exports, module) {

  'use strict';

  var Modifier = require('./modifier'),
    PaneList = require('./panelist'),
    NetImage = require('./netimage');

  /*global tinymce:true */

  tinymce.PluginManager.add('image', function(editor) {

    var sidebar, paneList;

    function getHtml(data){
      var content = '<img' +
        ' src="' + data.src + '"' +
        ' width="' + data.width + '"' +
        ' height="' + data.height + '"' +
        ' alt="' + data.alt + '"' +
        '/>';

      if (data.width > 100 || data.height > 100) {
        content = '<p class="p-image" style="text-align: center;">' + content + '</p>';
      }
      return content;
    }

    function insertContent(data) {
      editor.insertContent(getHtml(data));
    }

    function showDialog() {
      var imgElm = editor.selection.getNode();

      if (imgElm.nodeName !== 'IMG' ||
        imgElm.getAttribute('data-mce-placeholder') ||
        imgElm.getAttribute('data-mce-component')) {
        imgElm = null;
      }

      // 切换到对应侧栏
      sidebar.slide('#sidebar-image');

      // editor, imgElm
      new Modifier({
        // editor: function () {
        //   return editor;
        // },
        events: {
          change: function(e, data) {
            // 事件传递
            // self.fire.apply(self, arguments);

            if (!imgElm) {
              // 插入到侧栏
              if(!NetImage.isMotu(data.src)){
                NetImage.turnToLocal([{
                  remark : data.alt,
                  src : data.src,
                  tags : ''
                }], function(){
                  data.src = this.data[0].remotePath;
                  paneList.append(data);
                  insertContent(data);
                });
              }else{
                paneList.append(data);
                insertContent(data);
              }
            } else {
              paneList.updateItem( data, imgElm.src);
              imgElm.src = data.src;
              imgElm.setAttribute('data-mce-src', data.src);
              imgElm.alt = data.alt;
              imgElm.width = data.width;
              imgElm.height = data.height;
            }
          }
        },
        imgElm: imgElm,
        title: imgElm ? '编辑图片' : '插入图片'
      });
    }

    function getSelectedImg(){
      var imgElm = editor.selection.getNode();
      if (imgElm.nodeName !== 'IMG' ||
        imgElm.getAttribute('data-mce-placeholder') ||
        imgElm.getAttribute('data-mce-component')) {
        return null;
      }
      return imgElm;
    }

    //TODO 和 browse下的initPaneList整合。
    function initPaneList(pane) {
      var statusbar = editor.theme.panel.find('#statusbar')[0];
      var panes = sidebar.role('panes');
      var panesHeight;
      var listBox;
      var EDGE_HEIGHT = 47;

      paneList = sidebar.imagePaneList;
      if (paneList) {
        return;
      }

      paneList = sidebar.imagePaneList = new PaneList({
        element: pane,
        events: {
          select: function(e, data) {
            if(data.selected){
              paneList.updateEditor(editor.getDoc(), data);
            }else{
              var imgElm = getSelectedImg();
              if(!imgElm){
                insertContent(data);
              }else{
                imgElm.src = data.src;
                imgElm.setAttribute('data-mce-src', data.src);
                imgElm.alt = data.alt;
                imgElm.width = data.width;
                imgElm.height = data.height;
              }
            }
            editor.fire('change');
          },

          remove: function(e, data){
            paneList.updateEditor(editor.getDoc(), data);
          },

          removeAll : function(e, dataList){
            var doc = editor.getDoc();
            dataList.forEach(function(item){
              paneList.updateEditor(doc, item);
            });
          },

          insertAll : function(e,dataList){
            var html='';
            dataList.forEach(function(item){
              if(item.selected) {
                return;
              }
              html += getHtml(item);
            });
            editor.insertContent(html);
          },
          render : function(){
            this.$('ul').height(panes.height() - EDGE_HEIGHT);
          }
        }
      });

      statusbar.on('ResizeStart', function() {
        panesHeight = panes.height();
        listBox = paneList.role('listBox');
      });

      statusbar.on('Resize', function(e) {
        listBox.height(panesHeight + e.deltaY - EDGE_HEIGHT);
      });

      editor.on('FullscreenStateChanged',function(){
        paneList.role('listBox').height(panes.height() - EDGE_HEIGHT);
      });

      sidebar.fire('createPaneList', 'image');
    }

    function postRender() {
      /*jshint validthis:true*/
      changeMenuText(this, 'img:not([data-mce-placeholder],[data-mce-component])');
    }

    function changeMenuText(ctrl, selector) {

      function bindSelectionListener() {

        function toggleMenuText(matched) {
          ctrl.getEl().lastChild.innerHTML = ctrl.translate(matched ? 'Edit image' : 'Insert image');
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

    // 确保 sidebar 就位
    editor.on('load', function() {

      sidebar = editor.sidebar.on({
        tab: function(e, tab, pane) {
          if (!paneList &&
            tab.prop('hash') === '#sidebar-image') {
            initPaneList(pane);
          }
        }
      });

      editor.on('change nodechange', function(e) {
        if (paneList) {
          paneList.update(editor.getContent());
        }
      });

      NetImage.netImage(editor);

    });

    // 确保右键选中
    editor.on('mouseup', function(e) {
      if (e.target.nodeName === 'IMG') {
        editor.selection.select(e.target);
      }
    });

    editor.addButton('image', {
      icon: 'image',
      tooltip: 'Image',
      onclick: showDialog,
      stateSelector: 'img:not([data-mce-placeholder],[data-mce-component])'
    });

    editor.addMenuItem('image', {
      icon: 'image',
      text: 'Image',
      onclick: showDialog,
      onPostRender: postRender,
      context: 'insert',
      prependToContext: true
    });

  });

});
