  'use strict';

  var Modifier = require('./modifier'),
    PaneList = require('./panelist');

  /*global tinymce:true */

  tinymce.PluginManager.add('video', function(editor) {

    var sidebar, paneList;

    function getHtml(data){
      return '<p class="p-video" style="text-align: center;">' +
        '<embed' +
        ' src="' + data.src + '"' +
        ' allowFullScreen="true"' +
        ' quality="high"' +
        ' width="' + data.width + '"' +
        ' height="' + data.height + '"' +
        ' align="middle"' +
        ' allowScriptAccess="always"' +
        ' wmode="transparent"' +
        ' type="application/x-shockwave-flash"' +
        '/>' +
        '</p>';
    }

    function insertContent(data) {
      editor.insertContent(getHtml(data));
    }

    function showDialog() {
      var imgElm = editor.selection.getNode();

      if (imgElm.nodeName !== 'IMG' ||
        imgElm.getAttribute('data-mce-placeholder') !== 'video') {
        imgElm = null;
      }

      // 切换到对应侧栏
      //sidebar.slide('#sidebar-video');

      // editor, imgElm
      new Modifier({
        events: {
          change: function(e, data) {
            // 事件传递
            // self.fire.apply(self, arguments);

            if (!imgElm) {
              // 插入到侧栏
              paneList.append(data);
            }else{
              insertContent(data);
            }
          }
        },
        imgElm: imgElm,
        title: imgElm ? '编辑视频' : '插入视频'
      });
    }

    function initPaneList(pane) {
      var statusbar = editor.theme.panel.find('#statusbar')[0];
      var panes = sidebar.role('panes');
      var panesHeight;
      var listBox;
      var EDGE_HEIGHT = 47;

      paneList = sidebar.videoPaneList;

      if (paneList) {
        return;
      }

      paneList = sidebar.videoPaneList = new PaneList({
        element: pane,
        events: {
          select: function(e, data) {
            // 事件传递
            // self.fire.apply(self, arguments);
            //insertContent(data);
            if(data.selected){
              paneList.updateEditor(editor.getDoc(),data);
            }else{
              insertContent(data);
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

      sidebar.fire('createPaneList', 'video');
    }

    // 确保 sidebar 就位
    editor.on('load', function() {

      /*sidebar = editor.sidebar.on({
        tab: function(e, tab, pane) {
          if (!paneList &&
            tab.prop('hash') === '#sidebar-video') {
            initPaneList(pane);
          }
        }
      });*/

      editor.on('change nodechange', function(e) {
        if (paneList) {
          paneList.update(editor.getContent());
        }
      });
    });

    editor.on('ResolveName', function(e) {
      var name,
        target = e.target;

      if (target.nodeType === 1) {
        name = target.getAttribute('data-mce-placeholder');
        if (name) {
          e.name = name;
        }
      }
    });

    /**
     * 以下用于实现视频占位符
     */
    // editor.on('preInit', function() {

    //   // Converts flash videos into placeholder images
    //   editor.parser.addNodeFilter('embed', function(nodes, name) {
    //     var i = nodes.length,
    //       node, placeholder,
    //       ai, attrName, attrValue, attribs;

    //     while (i--) {
    //       node = nodes[i];

    //       placeholder = new tinymce.html.Node('img', 1);
    //       placeholder.shortEnded = true;

    //       // Prefix all attributes except width, height and style since we
    //       // will add these to the placeholder
    //       attribs = node.attributes;
    //       ai = attribs.length;
    //       while (ai--) {
    //         attrName = attribs[ai].name;
    //         attrValue = attribs[ai].value;

    //         if (/^(width|height|style)$/.test(attrName)) {
    //           continue;
    //         }

    //         if (attrName === 'src') {
    //           attrValue = editor.convertURL(attrValue, attrName);
    //         }

    //         placeholder.attr('data-mce-p-' + attrName, attrValue);
    //       }

    //       placeholder.attr({
    //         'data-mce-placeholder': 'video',
    //         width: node.attr('width') || '480',
    //         height: node.attr('height') || '400',
    //         style: node.attr('style'),
    //         src: tinymce.Env.transparentSrc
    //       });

    //       node.replace(placeholder);
    //     }
    //   });

    //   // Replaces placeholder images with real elements for videos
    //   editor.serializer.addAttributeFilter('data-mce-placeholder', function(nodes, name) {
    //     var i = nodes.length,
    //       node, realElm,
    //       ai, attribs, attrName;

    //     while (i--) {
    //       node = nodes[i];

    //       if (node.attr(name) !== 'video') {
    //         continue;
    //       }

    //       realElm = new tinymce.html.Node('embed', 1);

    //       realElm.attr({
    //         width: node.attr('width'),
    //         height: node.attr('height'),
    //         style: node.attr('style')
    //       });

    //       // Unprefix all placeholder attributes
    //       attribs = node.attributes;
    //       ai = attribs.length;
    //       while (ai--) {
    //         attrName = attribs[ai].name;

    //         if (attrName.indexOf('data-mce-p-') === 0) {
    //           realElm.attr(attrName.substr(11), attribs[ai].value);
    //         }
    //       }

    //       node.replace(realElm);
    //     }
    //   });
    // });

    editor.addButton('video', {
      icon: 'video',
      tooltip: 'Video',
      onclick: showDialog,
      stateSelector: 'img[data-mce-placeholder=video]'
    });

    // editor.addMenuItem('video', {
    //   icon: 'video',
    //   text: 'Insert video',
    //   onclick: showDialog,
    //   context: 'insert',
    //   prependToContext: true
    // });

  });

