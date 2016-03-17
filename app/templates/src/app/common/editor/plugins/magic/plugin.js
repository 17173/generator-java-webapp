  'use strict';

  /**
   * 如果有更新 tinymce 基础代码，记得：
   * 关联修改： /tinymce/js/tinymce/classes/Formatter.js
   */

  /*global tinymce:true */
  /*jshint maxparams:5 */

  tinymce.PluginManager.add('magic', function(editor) {
    var blockElements,
      elementsToAlign = 'figure,p,h1,h2,h3,h4,h5,h6,td,th,tr,div,ul,ol,li',
      elementsToRemove = 'em,i,font,u,strike,sub,sup,dfn,code,samp,kbd,var,cite,mark,q';

    // 图片或视频
    function getAlignObject(node) {
      var match = null,
        placeholder;

      if (node && node.nodeName === 'IMG') {
        placeholder = node.getAttribute('data-mce-placeholder');
        match = !placeholder ? 'image' : placeholder === 'video' ? placeholder : null;
      }

      return match;
    }

    editor.on('init', function() {
      editor.formatter.register({

        // 修改默认的格式
        alignleft: [{
          selector: elementsToAlign,
          styles: {
            textAlign: 'left'
          },
          defaultBlock: 'div',
          onformat: function(elm, fmt, vars, node, selected) {
            var match = getAlignObject(selected);
            if (match) {
              fmt.styles = {
                'float': 'left'
              };
              fmt.attributes = {
                'class': 'p-' + match + ' p-float'
              };
            }
          }
        }, {
          selector: 'table',
          collapsed: false,
          styles: {
            'float': 'left'
          }
        }],

        aligncenter: [{
          selector: elementsToAlign,
          styles: {
            textAlign: 'center'
          },
          defaultBlock: 'div',
          onformat: function(elm, fmt, vars, node, selected) {
            console.log(elm, fmt, vars, node, selected);
            var match = getAlignObject(selected);
            if (match) {
              fmt.styles = {
                'float': ''
              };
              fmt.attributes = {
                'class': 'p-' + match
              };
            }
          }
        }, {
          selector: 'table',
          collapsed: false,
          styles: {
            marginLeft: 'auto',
            marginRight: 'auto'
          }
        }],

        alignright: [{
          selector: elementsToAlign,
          styles: {
            textAlign: 'right'
          },
          defaultBlock: 'div',
          onformat: function(elm, fmt, vars, node, selected) {
            var match = getAlignObject(selected);
            if (match) {
              fmt.styles = {
                'float': 'right'
              };
              fmt.attributes = {
                'class': 'p-' + match + ' p-float'
              };
            }
          }
        }, {
          selector: 'table',
          collapsed: false,
          styles: {
            'float': 'right'
          }
        }],

        alignimagecenter: [{
          selector: elementsToAlign,
          styles: {
            'text-align': 'center'
          },
          attributes: {
            'class': 'p-image'
          },
          defaultBlock: 'div'
        }],

        alignvideocenter: [{
          selector: elementsToAlign,
          styles: {
            'text-align': 'center'
          },
          attributes: {
            'class': 'p-video'
          },
          defaultBlock: 'div'
        }],

        magicNoIndent: [{
          selector: 'p',
          classes: ['p-noindent', 'p-image', 'p-video', 'p-float'],
          split: false,
          expand: false,
          deep: true
        }],

        magicRemoveFormat: [{
          selector: elementsToRemove,
          remove: 'all',
          split: true,
          expand: false,
          'block_expand': true,
          deep: true
        }, {
          selector: 'span',
          attributes: ['style'],
          split: true,
          expand: false,
          deep: true
        }, {
          selector: '*',
          attributes: ['style'],
          split: false,
          expand: false,
          deep: true
        }]
      });

      blockElements = editor.schema.getBlockElements();
    });

    editor.on('newblock', function(e) {
      var classList = e.newBlock.classList;
      // 移除新换行（段落）的特殊样式
      ['p-image', 'p-video'].forEach(function(className) {
        classList.remove(className);
      });
    });

    function prepend(parentNode, childNode) {
      if (parentNode.firstChild) {
        parentNode.insertBefore(childNode, parentNode.firstChild);
      } else {
        parentNode.appendChild(childNode);
      }
    }

    // 逆序以保证无遗漏
    function appendChildNodes(parentNode, childNodes, skipCallback) {
      var n = childNodes.length,
        child;
      while (n--) {
        child = childNodes[n];
        if (skipCallback && skipCallback(child)) {
          continue;
        }
        prepend(parentNode, child);
      }
    }

    // 替换 CENTER 标签
    function removeCenter(body, doc) {
      var nodes = body.getElementsByTagName('CENTER'),
        n = nodes.length,
        node, p;

      while (n--) {
        node = nodes[n];
        p = doc.createElement('p');
        p.style.textAlign = 'center';
        appendChildNodes(p, node.childNodes);
        node.parentNode.insertBefore(p, node);
        node.remove();
      }
    }

    // 除了文字加粗（特指<strong>、<b>和style="font-weight:bold"）以外，去除所有CSS样式(含颜色）
    function removeFormat(body, doc) {
      Array.prototype.forEach
        .call(body.children, function(node) {
          editor.formatter.remove('magicRemoveFormat', null, node);
        });
    }

    function fixPageBreak(body, doc) {

      // 哥哥节点插入到父对象前
      // 弟弟节点插入到父对象后
      function handleSiblings(node) {
        var sibling, isPrev = true,
          prevParam, nextParam, parentNode;

        if (!node) {
          return;
        }

        parentNode = node.parentNode;

        // 第一个节点开始
        sibling = parentNode.firstChild;

        while (sibling) {

          if (sibling === node) {
            isPrev = false;
            sibling = sibling.nextSibling;
            continue;
          }

          if (isPrev) {
            if (!prevParam) {
              prevParam = parentNode.cloneNode();
            }
            prevParam.appendChild(sibling);
          } else {
            if (!nextParam) {
              nextParam = parentNode.cloneNode();
            }
            nextParam.appendChild(sibling);
          }

          sibling = parentNode.firstChild;
        }

        if (prevParam) {
          parentNode.parentNode.insertBefore(prevParam, parentNode);
        }

        if (nextParam) {
          if (parentNode.nextSibling) {
            parentNode.parentNode.insertBefore(nextParam, parentNode.nextSibling);
          } else {
            parentNode.parentNode.appendChild(nextParam);
          }
        }
      }

      Array.prototype.forEach
        .call(body.querySelectorAll('[data-mce-placeholder="pagebreak"]'), function(node) {
          var parentNode = node,
            p;

          if (parentNode.parentNode.nodeName === 'BODY') {
            return true;
          }

          // 找到顶级父辈对象
          while (parentNode.parentNode.nodeName !== 'BODY') {
            // 逐级处理兄弟节点（保留节点）
            handleSiblings(parentNode);
            parentNode = parentNode.parentNode;
          }

          // 根节点替换为（P包裹的）分页符
          p = doc.createElement('p');
          p.appendChild(node);
          parentNode.parentNode.insertBefore(p, parentNode);
          parentNode.remove();
        });
    }

    // 视频及宽或高超过 100px 的图片，居中
    function centerObject(body, doc) {
      var p,
        parentNode,
        childNode,
        isBodyTag;

      function applyObjCenter(node, type) {
        editor.formatter.apply('align' + type + 'center', null, node);
      }

      function isNeedCentered(img) {
        var placeholder = img.getAttribute('data-mce-placeholder');

        return !placeholder &&
          (img.width > 100 || img.height > 100) ||
          placeholder === 'video';
      }

      function getParentNode(childNode) {
        parentNode = childNode.parentNode;

        // 找块级父辈
        while (parentNode &&
          !blockElements[parentNode.nodeName] &&
          parentNode !== body) {
          childNode = parentNode;
          parentNode = parentNode.parentNode;
        }

        return parentNode;
      }

      function render(img) {
        // 视频，或尺寸大于100*100的图片
        if (isNeedCentered(img)) {

          childNode = img;
          parentNode = getParentNode(childNode);

          isBodyTag = parentNode.nodeName === 'BODY';

          p = doc.createElement('p');

          if (isBodyTag) {
            parentNode.insertBefore(p, childNode);
          } else {
            parentNode.parentNode.insertBefore(p, parentNode);
          }

          // 移动块级父辈的子元素
          appendChildNodes(p, parentNode.childNodes, function(child) {
            // 如果下一个对象也是图片，停止插入
            return child !== childNode &&
              child.nodeName === 'IMG' &&
              isNeedCentered(child);
          });

          applyObjCenter(p, img.tagName.toLowerCase() === 'img' ? 'image' : 'video');

          if (!isBodyTag &&
            parentNode.childNodes.length === 0) {
            parentNode.remove();
          }
        }
      }

      Array.prototype.forEach
        .call(body.getElementsByTagName('img'), render);
      Array.prototype.forEach
        .call(body.getElementsByTagName('embed'), render);
    }

    // 段落首行缩进（CSS控制，此处移除class p-noindent）
    function indentParams(body, doc) {
      Array.prototype.forEach
        .call(body.getElementsByTagName('p'), function(p) {
          editor.formatter.remove('magicNoIndent', null, p);
        });
    }

    // 删除文中&nbsp;标签
    // 删除段前全角空格
    function removeSpaces(body, doc) {
      var param = {
          format: 'raw'
        },
        content = editor.getContent(param);

      content = content
      // non-break space
      .replace(/(&nbsp;)+/g, ' ')
      // 全角空格
      .replace(/<p([^>]*?)>\u3000+/g, '<p$1>');

      editor.setContent(content, param);
    }

    function format() {
      var doc = editor.getDoc(),
        body = editor.getBody();

      removeCenter(body, doc);
      removeFormat(body, doc);
      fixPageBreak(body, doc);
      indentParams(body, doc);
      centerObject(body, doc);
      removeSpaces(body, doc);
    }

    editor.addButton('magic', {
      icon: 'magic',
      tooltip: 'Auto format',
      onclick: format
    });

    editor.addMenuItem('magic', {
      icon: 'magic',
      text: 'Auto format',
      onclick: format,
      context: 'format'
    });

  });

