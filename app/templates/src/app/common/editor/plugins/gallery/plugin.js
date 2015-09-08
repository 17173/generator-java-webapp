define(function (require, exports, module) {

'use strict';

var $ = require('$');
var DataSelect = require('./dataselect'),
    PaneList = require('./panelist'),
    preview = require('./preview');

/*global tinymce:true */

tinymce.PluginManager.add('gallery', function (editor) {

  var TR_ATTR_NAME = 'data-mce-p-cms-component-id';
  var sidebar, paneList;

  function getHtml (data){
    return '<div' +
        ' cms-data-type="gallery"' +
        ' cms-component-id="' + data.id + '"' +
        ' cms-component-path="' + data.componentPath + '"' +
        // ' cms-css-id="' + data.templateCss.id + '"' +
        // ' class="component component-gallery"' +
        ' title="' + data.componentName + '"></div>';
  }

  function insertContent (data) {
    editor.insertContent(getHtml(data));
  }

  function showDialog () {
    // var imgElm = editor.selection.getNode();

    // if (imgElm.nodeName !== 'IMG' ||
    //     imgElm.getAttribute('data-mce-component') !== 'gallery') {
    //   imgElm = null;
    // }

    // TODO: 选中单个，编辑组件

    // 切换到对应侧栏
    sidebar.slide('#sidebar-gallery');

    new DataSelect({
      events: {
        select: function (e, datas) {
          datas.forEach(function (data) {
            paneList.append(data);

            //insertContent(data);
          });
        }
      }
    });
  }

  function fireInsertGallery(id){
    setTimeout(function(){
      editor.fire('insertGallery', {
        id : id
      });
    },20);
  }

  function initPaneList (pane) {

    var statusbar = editor.theme.panel.find('#statusbar')[0];
    var panes = sidebar.role('panes');
    var panesHeight;
    var listBox;
    var EDGE_HEIGHT = 47;

    paneList = sidebar.galleryPaneList;

    if (paneList) {
      return;
    }

    paneList = sidebar.galleryPaneList = new PaneList({
      element: pane,
      events: {
        select: function (e, data) {
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

    sidebar.fire('createPaneList', 'gallery');

    editor.on('change nodechange', function (e) {
      paneList.update(editor.getContent());
    });
  }

  // 确保 sidebar 就位
  editor.on('load', function () {

    sidebar = editor.sidebar.on({
      tab: function (e, tab, pane) {
        if (!paneList &&
            tab.prop('hash') === '#sidebar-gallery') {
          initPaneList(pane);
        }
      }
    });

  });

  editor.on('ResolveName', function (e) {
    var name,
      target = e.target;

    if (target.nodeType === 1) {
      name = target.getAttribute('data-mce-component');
      if (name) {
        e.name = name;
      }
    }
  });

  editor.on('insertGallery',function(e){
    var dom = $('['+ TR_ATTR_NAME +'='+ e.id +']', editor.getDoc())[0];
    preview(dom, e.id);
  });

  editor.on('preInit', function () {

    // Converts component tag into component images
    editor.parser.addAttributeFilter('cms-data-type', function (nodes, name) {
      var i = nodes.length, node, parentNode, placeholder,
          attribs, ai, attrName, attrValue;

      while (i--) {
        node = nodes[i];

        if (node.attr(name) !== 'gallery') {
          continue;
        }

        parentNode = new tinymce.html.Node('p', 1);

        placeholder = new tinymce.html.Node('input', 1);
        placeholder.shortEnded = true;

        attribs = node.attributes;
        ai = attribs.length;
        while (ai--) {
          attrName = attribs[ai].name;
          attrValue = attribs[ai].value;

          placeholder.attr('data-mce-p-' + attrName, attrValue);
        }

        placeholder.attr({
          // 'class': 'mce-component mce-component-gallery',
          'data-mce-component': 'gallery',
          'data-mce-resize': 'false',
          src: tinymce.Env.transparentSrc,
          style: node.attr('style'),
          title: node.attr('title'),
          disabled : 'true'
        });

        parentNode.append(placeholder);

        node.replace(parentNode);

        fireInsertGallery(placeholder.attr(TR_ATTR_NAME));
      }
    });

    // Replaces component images with real elements component
    editor.serializer.addAttributeFilter('data-mce-component', function (nodes, name) {
      var i = nodes.length, node, realElm, parentNode,
          ai, attribs, attrName;

      while (i--) {
        node = nodes[i];

        if (node.attr(name) !== 'gallery') {
          continue;
        }

        parentNode = node.parent;

        realElm = new tinymce.html.Node('div', 1);

        realElm.attr({
          style: node.attr('style'),
          title: node.attr('title')
        });

        // Unprefix all component attributes
        attribs = node.attributes;
        ai = attribs.length;
        while (ai--) {
          attrName = attribs[ai].name;

          if (attrName.indexOf('data-mce-p-') === 0) {
            realElm.attr(attrName.substr(11), attribs[ai].value);
          }
        }

        if (parentNode.name !== 'body') {
          parentNode.parent.insert(realElm, parentNode, true);
          node.remove();
        } else {
          node.replace(realElm);
        }

        // 清除空白的 P 节点
        if (!parentNode.firstChild) {
          parentNode.remove();
        }
      }
    });
  });

  editor.addButton('gallery', {
    icon: 'gallery',
    tooltip: 'Gallery',
    onclick: showDialog,
    stateSelector: 'img[data-mce-component=gallery]'
  });

  // editor.addMenuItem('gallery', {
  //   icon: 'gallery',
  //   text: 'Insert gallery',
  //   onclick: showDialog,
  //   context: 'insert',
  //   prependToContext: true
  // });

});

});
