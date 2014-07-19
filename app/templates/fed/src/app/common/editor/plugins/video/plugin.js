define(function (require, exports, module) {

'use strict';

var Modifier = require('./modifier'),
    PaneList = require('./panelist');

/*global tinymce:true */

tinymce.PluginManager.add('video', function (editor) {

  var sidebar, paneList;

  function insertContent (data) {
    editor.insertContent('<p style="text-align:center">' +
        '<embed' +
          ' src="' + data.src + '"' +
          ' allowFullScreen="true"' +
          ' quality="high"' +
          ' width="' + data.width + '"' +
          ' height="' + data.height + '"' +
          ' align="middle"' +
          ' allowScriptAccess="always"' +
          ' type="application/x-shockwave-flash"' +
          '/>' +
      '</p>');
  }

  function showDialog() {
    var imgElm = editor.selection.getNode();

    if (imgElm.nodeName !== 'IMG' ||
        imgElm.getAttribute('data-mce-placeholder') !== 'video') {
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
          }

          insertContent(data);
        }
      },
      imgElm: imgElm,
      title: imgElm ? '编辑视频' : '插入视频'
    });

    // 切换到对应侧栏
    sidebar.slide('#sidebar-video');
  }

  function initPaneList (pane) {
    paneList = sidebar.videoPaneList;

    if (paneList) {
      return;
    }

    paneList = sidebar.videoPaneList = new PaneList({
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
            tab.prop('hash') === '#sidebar-video') {
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

  editor.on('ResolveName', function (e) {
    var name,
      target = e.target;

    if (target.nodeType === 1) {
      name = target.getAttribute('data-mce-placeholder');
      if (name) {
        e.name = name;
      }
    }
  });

  editor.on('preInit', function () {
    // Make sure that any messy HTML is retained inside these
    // var specialElements = editor.schema.getSpecialElements();
    // tinymce.each('video audio iframe object'.split(' '), function(name) {
    //   specialElements[name] = new RegExp('<\/' + name + '[^>]*>','gi');
    // });

    // Allow elements
    //editor.schema.addValidElements('object[id|style|width|height|classid|codebase|*],embed[id|style|width|height|type|src|*],video[*],audio[*]');

    // Set allowFullscreen attribs as boolean
    var boolAttrs = editor.schema.getBoolAttrs();

    // ['webkitallowfullscreen', 'mozallowfullscreen', 'allowfullscreen']
    // .forEach(function (name) {
    //   boolAttrs[name] = {};
    // });
    boolAttrs.allowfullscreen = {};

    // Converts flash videos into placeholder images
    editor.parser.addNodeFilter('embed', function (nodes, name) {
      var i = nodes.length, node, placeholder,
          ai, attrName, attrValue, attribs;

      while (i--) {
        node = nodes[i];

        placeholder = new tinymce.html.Node('img', 1);
        placeholder.shortEnded = true;

        // Prefix all attributes except width, height and style since we
        // will add these to the placeholder
        attribs = node.attributes;
        ai = attribs.length;
        while (ai--) {
          attrName = attribs[ai].name;
          attrValue = attribs[ai].value;

          if (attrName === 'width' ||
              attrName === 'height' ||
              attrName === 'style') {
            continue;
          }

          if (attrName === 'src') {
            attrValue = editor.convertURL(attrValue, attrName);
          }

          placeholder.attr('data-mce-p-' + attrName, attrValue);
        }

        placeholder.attr({
          // 'class': 'mce-placeholder mce-placeholder-video',
          'data-mce-placeholder': 'video',
          width: node.attr('width') || '480',
          height: node.attr('height') || '300',
          style: node.attr('style'),
          src: tinymce.Env.transparentSrc
        });

        node.replace(placeholder);
      }
    });

    // Replaces placeholder images with real elements for videos
    editor.serializer.addAttributeFilter('data-mce-placeholder', function (nodes, name) {
      var i = nodes.length, node, realElm,
          ai, attribs, attrName;

      while (i--) {
        node = nodes[i];

        if (node.attr(name) !== 'video') {
          continue;
        }

        realElm = new tinymce.html.Node('embed', 1);

        realElm.attr({
          width: node.attr('width'),
          height: node.attr('height'),
          style: node.attr('style')
        });

        // Unprefix all placeholder attributes
        attribs = node.attributes;
        ai = attribs.length;
        while (ai--) {
          attrName = attribs[ai].name;

          if (attrName.indexOf('data-mce-p-') === 0) {
            realElm.attr(attrName.substr(11), attribs[ai].value);
          }
        }

        node.replace(realElm);
      }
    });
  });

  editor.addButton('video', {
    icon: 'video',
    tooltip: 'Insert\/edit video',
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

});
