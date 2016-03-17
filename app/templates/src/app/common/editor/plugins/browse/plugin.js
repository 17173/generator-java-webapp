  'use strict';

  //var $ = require('jquery');

  var Dialog = require('./dialog');

  var PaneList = require('../image/panelist');

  /*global tinymce:true */

  tinymce.PluginManager.add('browse', function(editor) {

    var sidebar, paneList;

    function getHtml(data){
      var content = '<img' +
        ' src="' + data.src + '"' +
        ' width="' + data.width + '"' +
        ' height="' + data.height + '"' +
        ' alt="' + data.alt + '"' +
        '/>';

      if (data.linkOriginal && data.originalSrc) {
        content = '<a href="' + data.originalSrc +
          '" title="' + data.alt +
          '" target="_blank">' +
          content + '</a>';
      }

      if (data.width > 100 || data.height > 100) {
        content = '<p class="p-image" style="text-align: center;">' + content + '</p>';
      }
      return content;
    }

    function insertContent(data) {
      editor.insertContent(getHtml(data));
    }

    function showDialog() {
      var imgaeList = [];
      new Dialog({
        hasLink: true,
        galleryOptions: {
          selectable: 'multiple'
        },
        needDimens: true,
        events: {
          // 从图库中选择或上传
          processPic: function(e, data, fromUpload) {
            if (fromUpload) {
              return;
            }

            imgaeList.push({
              src: data.thumbUrl,
              width: data.width,
              height: data.height,
              alt: data.remark || data.name || data.thumbUrl,
              originalSrc: data.remotePath,
              linkOriginal: data.linkOriginal,
              sequence : data.sequence
            });

          },
          confirmAppend: function(e, files) {
            files.forEach(function(file) {
              // console.log();
              var data = file.data();
              paneList.append({
                src: data.thumbUrl,
                width: data.thumbWidth || data.width,
                height: data.thumbHeight || data.height,
                alt: data.remark || data.name || data.thumbUrl,
                originalSrc: data.remotePath,
                linkOriginal: data.linkOriginal
              });
            });
            this.close();
          },
          close : function(){
            if(imgaeList.length){
              imgaeList.sort(function(a, b){
                return b.sequence - a.sequence;
              });
            }
            for (var i = 0 ; i<imgaeList.length; i++) {
              paneList.append(imgaeList[i]);
            }
          }
        }
      });

      // 切换到对应侧栏
      //sidebar.slide('#sidebar-image');
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
            // 事件传递
            // self.fire.apply(self, arguments);
            if(data.selected){
              paneList.updateEditor(editor.getDoc(),data);
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

    // 确保 sidebar 就位
    /*editor.on('load', function() {

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

    });*/

    editor.addButton('browse', {
      icon: 'browse',
      tooltip: 'Browse',
      onclick: showDialog
    });

  });

