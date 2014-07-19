define({
  // 语言包
  language: 'zh_CN',
  // 'toolbar_items_size': 'small',
  // 皮肤
  // skin: 'pandora',
  // skin_url: '',
  // 主题
  theme: 'pandora',
  // 不显示菜单栏
  menubar: false,
  // contextmenu: 'link image inserttable | tableprops row column deletetable',
  // sidepanel: true,
  // 插件
  plugins: [
    // 'dblclick',
    'anchor',
    'autolink',
    'browse',
    'code',
    'component',
    'contextmenu',
    'directionality',
    'fullscreen',
    'gallery',
    'hr',
    'image',
    'link',
    'lists',
    'magic',
    'nonbreaking',
    'pagebreak',
    'paste',
    'preview',
    'save',
    'searchreplace',
    'sidebar',
    'table',
    'template',
    'textcolor',
    // 'upload',
    'video',
    'visualblocks',
    'visualchars'
  ],
  toolbar: [
    'preview code fullscreen visualblocks' +
    ' | undo redo' +
    ' | searchreplace removeformat magic' +
    ' | formatselect table' +
    ' | forecolor backcolor' +
    ' | bold italic',
    // 锚点 链接 图片 媒体 | 分页符 表格
    'alignleft aligncenter alignright alignjustify' +
    ' | bullist numlist' +
    ' | anchor link hr pagebreak' +
    ' | browse image video' +
    ' | gallery component' +
    ' | sidebar'
  ],
  width: 908,
  height: 600,
  'block_formats': 'Paragraph=p;' +
                   'Heading 1=h1;' +
                   'Heading 2=h2;' +
                   'Heading 3=h3;' +
                   'Heading 4=h4;' +
                   'Heading 5=h5;' +
                   'Heading 6=h6',
  // 'file_browser_callback': function () {
  //   console.log(arguments);
  // },
  // image_list: [
  //     {title: 'My image 1', value: 'http://www.tinymce.com/my1.gif'},
  //     {title: 'My image 2', value: 'http://www.moxiecode.com/my2.gif'}
  // ],
  // image_advtab: true,
  // 分页符，来自CMS2.0
  // 'pagebreak_separator': '<hr 17173page />',
  // 'pagebreak_split_block': true,
  'forced_root_block': 'p',
  // 'object_resizing': 'table,img,div,object',
  // 'verify_html': false,
  // 允许空白标签、特殊标签、特殊属性
  'valid_elements': '*[*]',
  // 'extended_valid_elements': '*[*]',
  'convert_urls': false,
  'relative_urls': false,
  'ie7_compat': false
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
