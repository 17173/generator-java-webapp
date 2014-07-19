define(function (require, exports, module) {

'use strict';

var DataSelect = require('./dataselect'),
    PaneList = require('./panelist');

/*global tinymce:true */

tinymce.PluginManager.add('gallery', function (editor) {

  var sidebar, paneList;

  function showDialog () {
    // var imgElm = editor.selection.getNode();

    // if (imgElm.nodeName !== 'IMG' ||
    //     imgElm.getAttribute('data-mce-component') !== 'gallery') {
    //   imgElm = null;
    // }

    // TODO: 选中单个，编辑组件

    new DataSelect({
      events: {
        select: function (e, datas) {
          datas.forEach(function (data) {
            paneList.append(data);
          });
        }
      }
    });

    // 切换到对应侧栏
    sidebar.slide('#sidebar-gallery');
  }

  function initPaneList (pane) {
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
          editor.insertContent('<div' +
            ' cms-data-type="gallery"' +
            ' cms-component-id="' + data.id + '"' +
            ' class="component component-gallery"' +
            ' title="' + data.name + '"></div>');
        }
      }
    });

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

        placeholder = new tinymce.html.Node('img', 1);
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
          title: node.attr('title')
        });

        parentNode.append(placeholder);

        node.replace(parentNode);
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
