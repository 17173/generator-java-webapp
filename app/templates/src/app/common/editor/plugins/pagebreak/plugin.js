define(function(require, exports, module) {

  'use strict';

  /*global tinymce:true */

  tinymce.PluginManager.add('pagebreak', function(editor) {

    var pagebreakHtml = '<!--17173PAGE-->',
      pagebreakRegExp = /<!\-\-17173PAGE\-\->/ig,
      placeholderHtml = '<img' +
      ' src="' + tinymce.Env.transparentSrc + '"' +
      ' data-mce-placeholder="pagebreak"' +
      ' data-mce-resize="false"/>';

    editor.addCommand('mcePageBreak', function() {
      // '<p>' + placeholderHtml + '</p>'
      editor.insertContent(pagebreakHtml);
      // 多插入一空行
      editor.insertContent('<p><br></p>');
    });

    editor.on('ResolveName', function(e) {
      var name = e.target.dataset.mcePlaceholder;

      if (name) {
        e.name = name;
      }
    });

    // 替换插入的内容
    editor.on('BeforeSetContent', function(e) {
      e.content = e.content.replace(pagebreakRegExp, placeholderHtml);
    });

    editor.on('PreInit', function() {
      function toTextNode(node) {
        node.name = '#text';
        node.type = 3;
        node.value = pagebreakHtml;
        node.raw = true;
      }

      function handleSiblings(node) {
        var sibling, isPrev = true,
          prevParam, nextParam, parentNode;

        if (!node) {
          return;
        }

        parentNode = node.parent;

        // 第一个节点开始
        sibling = parentNode.firstChild;

        while (sibling) {

          if (sibling === node) {
            isPrev = false;
            sibling = sibling.next;
            continue;
          }

          if (isPrev) {
            if (!prevParam) {
              prevParam = parentNode.clone();
            }
            prevParam.append(sibling);
          } else {
            if (!nextParam) {
              nextParam = parentNode.clone();
            }
            nextParam.append(sibling);
          }

          sibling = parentNode.firstChild;
        }

        if (prevParam) {
          parentNode.parent.insert(prevParam, parentNode, true);
        }

        if (nextParam) {
          parentNode.parent.insert(nextParam, parentNode, false);
        }
      }

      // [data-mce-placeholder=pagebreak] 转为 分页注释
      editor.serializer.addAttributeFilter('data-mce-placeholder', function(nodes, name) {
        var i = nodes.length,
          node, parentNode;

        while (i--) {
          node = nodes[i];

          if (node.attr(name) !== 'pagebreak') {
            continue;
          }

          parentNode = node;

          // 找到顶级父辈对象
          while (parentNode.parent &&
            parentNode.parent.name !== 'body') {
            // 逐级处理兄弟节点（保留节点）
            handleSiblings(parentNode);
            parentNode = parentNode.parent;
          }

          toTextNode(parentNode);
        }
      });
    });

    editor.addButton('pagebreak', {
      title: 'Page break',
      cmd: 'mcePageBreak',
      stateSelector: 'img[data-mce-placeholder=pagebreak]'
    });

    editor.addMenuItem('pagebreak', {
      text: 'Page break',
      icon: 'pagebreak',
      cmd: 'mcePageBreak',
      context: 'insert'
    });

  });

});
