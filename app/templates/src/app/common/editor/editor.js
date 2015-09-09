define(function(require, exports, module) {

  'use strict';

  // mce 主文件
  require('common/editor/tinymce/tinymce');

  // 定制的主题
  require('./theme/pandora');

  // 中文语言包
  require('./i18n/zhcn');

  require('./plugins/all');

  // 插件列表
  // require('./plugins/sidebar/plugin');
  // require('./plugins/anchor/plugin');
  // require('./plugins/autolink/plugin');
  // require('./plugins/browse/plugin');
  // require('./plugins/code/plugin');
  // require('./plugins/component/plugin');
  // require('./plugins/contextmenu/plugin');
  // require('./plugins/directionality/plugin');
  // require('./plugins/fullscreen/plugin');
  // require('./plugins/gallery/plugin');
  // require('./plugins/hr/plugin');
  // require('./plugins/image/plugin');
  // require('./plugins/link/plugin');
  // require('./plugins/lists/plugin');
  // require('./plugins/magic/plugin');
  // require('./plugins/nonbreaking/plugin');
  // require('./plugins/pagebreak/plugin');
  // require('./plugins/paste/plugin');
  // require('./plugins/preview/plugin');
  // require('./plugins/save/plugin');
  // require('./plugins/searchreplace/plugin');
  // require('./plugins/table/plugin');
  // require('./plugins/template/plugin');
  // require('./plugins/textcolor/plugin');
  // require('./plugins/video/plugin');
  // require('./plugins/visualblocks/plugin');
  // require('./plugins/visualchars/plugin');

  var settings = require('./settings');
  var simpleSet = require('./simpleset');

  /* global tinymce:true */
  module.exports = function(options) {
    var config = options.simpleMode ? simpleSet : settings;
    config.sidebarList = options.sidebarList;
    var editor = tinymce.EditorManager.createEditor(
      options.selector,
      config);

    editor.render();

    return editor;
  };

});
