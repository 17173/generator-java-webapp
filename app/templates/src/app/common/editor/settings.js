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
   contextmenu: 'link unlink image component vote pagebreak | inserttable tableprops row column deletetable',
  // sidepanel: true,
  // 插件
  plugins: [
    'sidebar',
    // 'dblclick',
    'anchor',
    'autolink',
    'browse',
    'code',
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
    'table',
    'template',
    'textcolor',
    'video',
    'visualblocks',
    'visualchars',
  ],
  toolbar: [
    'preview code fullscreen visualblocks' +
    ' | undo redo' +
    ' | searchreplace removeformat magic' +
    ' | formatselect table' +
    ' | forecolor backcolor' +
    ' | bold italic' +
    ' | sidebar',
    // 锚点 链接 图片 媒体 | 分页符 表格
    'alignleft aligncenter alignright alignjustify' +
    ' | bullist numlist' +
    ' | anchor link hr pagebreak' +
    ' | browse image video' +
    ' | gallery'
  ],
  width: 930,
  height: 600,
  'block_formats': 'Paragraph=p;' +
  // 'Heading 1=h1;' +
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
  'forced_root_block': 'p,span',
  // 'object_resizing': 'table,img,div,object',
  'verify_html': false,
  // 允许空白标签、特殊标签、特殊属性
  'valid_elements': '*[*]',
  'extended_valid_elements': 'a[*|href=javascript:;]',
  // 'extended_valid_elements': '*[*]',
  'convert_urls': false,
  'relative_urls': false,
  'ie7_compat': false,
  'schema' : 'html5',
  'valid_children' : '+a[p|div|h1|h2|h3|h4|h5|h6|section|article|aside|header|nav|canvas],+body[style|script|span]'
});
