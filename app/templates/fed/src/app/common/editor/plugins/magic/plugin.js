define(function (require, exports, module) {

'use strict';

/*global tinymce:true */
tinymce.PluginManager.add('magic', function(editor) {
  var elementsToRemove = 'em,i,font,u,strike,sub,sup,dfn,code,samp,kbd,var,cite,mark,q'/*,
    stylesToRemove = [
      'color',
      'font-family',
      'font-size',
      'font-weight',
      'font-style',
      'font-variant',
      'line-height',
      'background',
      'background-color',
      'background-image',
      'float',
      'display',
      'margin',
      'padding',
      'visibility',
      'position',
      'left',
      'top',
      'right',
      'bottom'
    ]*/;

  editor.on('init', function () {
    editor.formatter.register({
      magicIndent: {
        block: 'p',
        selector: 'p',
        remove: 'all',
        split: true,
        deep: true,

        styles: {textIndent: '2em'},

        onmatch: function() {
          return true;
        },

        onformat: function(elm, fmt, vars) {
          tinymce.each(vars, function(value, key) {
            tinymce.dom.setAttrib(elm, key, value);
          });
        }
      },

      magicRemoveIndent: [
        {
          selector: 'p',
          styles: [
            'text-indent'
          ],
          split: false,
          expand: false,
          deep: true
        }
      ],

      magicRemoveFormat: [
        {/*b,strong,*/
          selector: elementsToRemove,
          remove: 'all',
          split: true,
          expand: false,
          'block_expand': true,
          deep: true
        },
        {
          selector: 'span',
          // styles: stylesToRemove,
          attributes: ['style'],
          // remove: 'empty',
          split: true,
          expand: false,
          deep: true
        },
        {
          selector: '*',
          // styles: stylesToRemove,
          attributes: ['style'],
          split: false,
          expand: false,
          deep: true
        }
      ]
    });
  });

  // 除了文字加粗（特指<strong>、<b>和style="font-weight:bold"）以外，去除所有CSS样式(含颜色）
  function removeFormat (body) {
    Array.prototype.forEach
      .call(body.children, function (node) {
        editor.formatter.remove('magicRemoveFormat', {}, node);
      });
    // tinymce.activeEditor.selection.select(body);
    // editor.formatter.remove('magicRemoveFormat');
    // editor.execCommand('Removeformat');
  }

  // 宽或高超过100px的所有图片予以居中处理
  function centerImages (body) {
    Array.prototype.forEach
      .call(body.getElementsByTagName('img'), function (img) {
        if (img.getAttribute('data-mce-object') ||
            (img.width > 100 || img.height > 100)) {
          editor.formatter.apply('aligncenter', {}, img.parentNode);
          editor.formatter.remove('magicRemoveIndent', {}, img.parentNode);
        }
      });
  }

  // 每一个段落首行缩进两个全角空格
  function indentParams (body) {
    // var re = /(<(?:p|br)[^>]*?>(?!\u3000\u3000))\s*/g,
    //   rp = '$1\u3000\u3000';

    // return content.replace(re, rp);
    Array.prototype.forEach
      .call(body.getElementsByTagName('p'), function (p) {
        editor.formatter.apply('magicIndent', {}, p);
      });
  }

  // 删除文中&nbsp;标签
  function removeSpaces (body) {
    var param = {format: 'raw'},
      content = editor.getContent(param);

    content = content.replace(/(&nbsp;)+/g, ' ');

    editor.setContent(content, param);
  }

  function format () {
    var body = editor.getBody();

    removeFormat(body);
    indentParams(body);
    centerImages(body);
    removeSpaces(body);
  }

  editor.addButton('magic', {
    icon: 'magic',
    tooltip: '一键排版',
    onclick: format
  });

  // editor.addMenuItem('magic', {
  //   icon: 'magic',
  //   text: 'Insert magic',
  //   onclick: format,
  //   context: 'format',
  //   prependToContext: true
  // });

});

});

/*

9、编辑器里的一键排版：
  a、除了文字加粗（特指<strong>、<b>和style="font-weight:bold"）以外，去除所有CSS样式(含颜色）
  b、宽或高超过100px的所有图片予以居中处理
  c、宽和高小于等于100px的图片位置维持不变
  d、删除文中&nbsp;标签
  e、每一个段落（以<p>标签或<br> 标签分隔)的首行缩进，缩进宽度为两个全角空格
  f、一键排版的这些选项一期不支持自定义，点击按钮后直接按照上述规则排版完成。

*/
