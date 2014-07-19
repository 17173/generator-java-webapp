define(function(require, exports, module) {

'use strict';

// mce 主文件
require('./tinymce/tinymce-debug');

// 定制的主题
require('./theme/pandora');

// 中文语言包
require('./i18n/zhcn');

// TODO: 清理未用插件

// 插件列表
// require('./plugins/wordcount/plugin');
require('./plugins/anchor/plugin');
require('./plugins/autolink/plugin');
require('./plugins/browse/plugin');
require('./plugins/code/plugin');
require('./plugins/component/plugin');
require('./plugins/contextmenu/plugin');
// require('./plugins/dblclick/plugin');
require('./plugins/directionality/plugin');
require('./plugins/fullscreen/plugin');
require('./plugins/gallery/plugin');
require('./plugins/hr/plugin');
require('./plugins/image/plugin');
require('./plugins/link/plugin');
require('./plugins/lists/plugin');
require('./plugins/magic/plugin');
require('./plugins/nonbreaking/plugin');
require('./plugins/pagebreak/plugin');
require('./plugins/paste/plugin');
require('./plugins/preview/plugin');
require('./plugins/save/plugin');
require('./plugins/searchreplace/plugin');
require('./plugins/sidebar/plugin');
require('./plugins/table/plugin');
require('./plugins/template/plugin');
require('./plugins/textcolor/plugin');
// require('./plugins/upload/plugin');
require('./plugins/video/plugin');
require('./plugins/visualblocks/plugin');
require('./plugins/visualchars/plugin');

var settings = require('./settings');

/* global tinymce:true */
module.exports = function (options) {
  // var editor = new tinymce.Editor(
  //   options.selector,
  //   settings,
  //   tinymce.EditorManager);

  var editor = tinymce.EditorManager.createEditor(
    options.selector,
    settings);

  editor.render();

  return editor;
};

/* global tinymce:true */
// tinymce.EditorManager.init(require('./settings'));

});

/**
* default settings
*
{
id: id,
theme: 'modern',
delta_width: 0,
delta_height: 0,
popup_css: '',
plugins: '',
document_base_url: documentBaseUrl,
add_form_submit_trigger: true,
submit_patch: true,
add_unload_trigger: true,
convert_urls: true,
relative_urls: true,
remove_script_host: true,
object_resizing: true,
doctype: '<!DOCTYPE html>',
visual: true,
font_size_style_values: 'xx-small,x-small,small,medium,large,x-large,xx-large',

// See: http://www.w3.org/TR/CSS2/fonts.html#propdef-font-size
font_size_legacy_values: 'xx-small,small,medium,large,x-large,xx-large,300%',
forced_root_block: 'p',
hidden_input: true,
padd_empty_editor: true,
render_ui: true,
indentation: '30px',
inline_styles: true,
convert_fonts_to_spans: true,
indent: 'simple',
indent_before: 'p,h1,h2,h3,h4,h5,h6,blockquote,div,title,style,pre,script,td,ul,li,area,table,thead,' +
  'tfoot,tbody,tr,section,article,hgroup,aside,figure,option,optgroup,datalist',
indent_after: 'p,h1,h2,h3,h4,h5,h6,blockquote,div,title,style,pre,script,td,ul,li,area,table,thead,' +
  'tfoot,tbody,tr,section,article,hgroup,aside,figure,option,optgroup,datalist',
validate: true,
entity_encoding: 'named',
url_converter: self.convertURL,
url_converter_scope: self,
ie7_compat: true
}
*/

// SetupEditor Editor {documentBaseUrl: "http://127.0.0.1:3001/demo/", settings: Object, id: "mce_0", isNotDirty: true, plugins: Object…}
// AddEditor Object {editor: Editor}
// BeforeRenderUI undefined
// PreInit undefined
// PostRender undefined
// BeforeSetContent Object {initial: true, format: "html", load: true, set: true, content: "textarea"}
// SetContent Object {initial: true, format: "html", load: true, set: true, content: "<p>textarea</p>"…}
// VisualAid Object {element: body#tinymce.mce-content-body, hasVisual: true}
// LoadContent Object {initial: true, format: "html", load: true, set: true, content: "<p>textarea</p>"…}
// BeforeGetContent Object {format: "raw", get: true, getInner: true}
// GetContent Object {format: "raw", get: true, getInner: true, type: "beforegetcontent", target: Editor…}
// init undefined
// BeforeAddUndo Object {level: Object, lastLevel: undefined, originalEvent: undefined}
// AddUndo Object {level: Object, lastLevel: undefined, originalEvent: undefined}
// NodeChange Object {element: p, parents: Array[1]}
// ResolveName Object {name: "p", target: p}
// NodeChange Object {element: p, parents: Array[1]}
// ResolveName Object {name: "p", target: p}
// load undefined
// BeforeGetContent Object {format: "raw", get: true, getInner: true}
// GetContent Object {format: "raw", get: true, getInner: true, type: "beforegetcontent", target: Editor…}
