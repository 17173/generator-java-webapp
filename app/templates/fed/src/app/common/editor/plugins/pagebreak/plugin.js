define(function (require, exports, module) {

'use strict';

/*global tinymce:true */

tinymce.PluginManager.add('pagebreak', function (editor) {

  var separatorHtml = '<!--17173PAGE-->',
      separatorRegExp = /<!\-\-17173PAGE\-\->/ig,
      placeholderHtml = '<p>' +
          '<img' +
          ' src="' + tinymce.Env.transparentSrc + '"'+
          ' data-mce-placeholder="pagebreak"' +
          ' data-mce-resize="false" />' +
        '</p>';

  editor.addCommand('mcePageBreak', function () {
    editor.insertContent(placeholderHtml);
  });

  editor.on('ResolveName', function (e) {
    var name,
      target = e.target;

    // if (target.nodeType === 1) {
      name = target.dataset.mcePlaceholder;
      if (name) {
        e.name = name;
      }
    // }
    // var target = e.target;

    // if (target.dataset.mcePlaceholder === 'pagebreak') {
    //   e.name = 'pagebreak';
    // }
  });

  // editor.on('click', function (e) {
  //   var target = e.target;

  //   if (target.dataset.mcePlaceholder === 'pagebreak') {
  //     editor.selection.select(target);
  //   }
  // });

  editor.on('BeforeSetContent', function (e) {
    e.content = e.content.replace(separatorRegExp, placeholderHtml);
  });

  editor.on('PreInit', function () {
    var blockElements = editor.schema.getBlockElements();

    function toTextNode (node) {
      node.name = '#text';
      node.type = 3;
      node.value = separatorHtml;
      node.raw = true;
    }

    // [class=mce-pagebreak] 转为 分页注释
    editor.serializer.addAttributeFilter('data-mce-placeholder', function (nodes, name) {
      var i = nodes.length, node, prevNode, nextNode, parentNode;

      while (i--) {
        node = nodes[i];

        if (node.attr(name) !== 'pagebreak') {
          continue;
        }

        parentNode = node.parent;

        if (blockElements[parentNode.name]) {
          toTextNode(parentNode);
          node.remove();
          continue;
        }

        toTextNode(node);
      }
    });
  });

  editor.addButton('pagebreak', {
    title: 'Page break',
    cmd: 'mcePageBreak',
    stateSelector: 'img[data-mce-placeholder=pagebreak]'
  });

  // editor.addMenuItem('pagebreak', {
  //   text: 'Page break',
  //   icon: 'pagebreak',
  //   cmd: 'mcePageBreak',
  //   context: 'insert'
  // });

});

});
