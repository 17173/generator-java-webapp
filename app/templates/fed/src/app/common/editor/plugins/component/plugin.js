define(function (require, exports, module) {

'use strict';

var DataSelect = require('./dataselect');

/*global tinymce:true */

tinymce.PluginManager.add('component', function (editor) {

  function showDialog () {
    // var imgElm = editor.selection.getNode();

    // if (imgElm.nodeName !== 'IMG' ||
    //     imgElm.getAttribute('data-mce-component') !== 'html') {
    //   imgElm = null;
    // }

    // TODO: 选中单个，编辑组件

    /*
    <div
      cms-data-type="list-news"
      class="component cms-fa cms-fa-list"
      data-widget-uid="ptnnjjifcctsm7vi"
      draggable="true"
      cms-css-id="117"
      cms-component-id="318"
      cms-component-path="/inc/20140715164632411252.inc">
    </div>
     */
    new DataSelect({
      events: {
        select: function (e, data) {
          editor.insertContent('<div' +
            ' cms-data-type="html"' +
            ' cms-component-id="' + data.id + '"' +
            ' cms-component-path="' + data.componentPath + '"' +
            // ' class="component component-html"' +
            ' title="' + data.componentName + '"></div>');
        }
      }
    });
  }

  editor.on('ResolveName', function (e) {
    var name,
        target = e.target;

    // if (target.nodeType === 1) {
      name = target.dataset.mceComponent;
      if (name) {
        e.name = name;
      }
    // }
  });

  // SSI to HTML
  // editor.on('BeforeSetContent', function (e) {
  // });

  // // HTML to SSI
  // editor.on('GetContent', function (e) {
  // });

  editor.on('preInit', function () {

    // Converts component tag into component images
    editor.parser.addAttributeFilter('cms-data-type', function (nodes, name) {
      var i = nodes.length, node, parentNode, placeHolder,
          attribs, ai, attrName, attrValue;

      while (i--) {
        node = nodes[i];

        if (node.attr(name) !== 'html') {
          continue;
        }

        parentNode = new tinymce.html.Node('p', 1);

        placeHolder = new tinymce.html.Node('img', 1);
        placeHolder.shortEnded = true;

        attribs = node.attributes;
        ai = attribs.length;
        while (ai--) {
          attrName = attribs[ai].name;
          attrValue = attribs[ai].value;

          placeHolder.attr('data-mce-p-' + attrName, attrValue);
        }

        placeHolder.attr({
          'data-mce-component': 'html',
          'data-mce-resize': 'false',
          src: tinymce.Env.transparentSrc,
          style: node.attr('style'),
          title: node.attr('title')
        });

        parentNode.append(placeHolder);

        node.replace(parentNode);
      }
    });

    // Replaces component images with real elements component
    editor.serializer.addAttributeFilter('data-mce-component', function (nodes, name) {
      var i = nodes.length, node, realElm, parentNode,
          ai, attribs, attrName;

      while (i--) {
        node = nodes[i];

        if (node.attr(name) !== 'html') {
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

  editor.addButton('component', {
    icon: 'component',
    tooltip: 'Component',
    onclick: showDialog,
    stateSelector: 'img[data-mce-component=html]'
  });

  // editor.addMenuItem('component', {
  //   icon: 'component',
  //   text: 'Insert component',
  //   onclick: showDialog,
  //   context: 'insert',
  //   prependToContext: true
  // });

});

});
