<script src="${ctx}/fed/sea-modules/jquery/jquery/2.1.0/jquery-debug.js"></script>
<script src="${ctx}/fed/sea-modules/seajs/seajs/2.2.1/sea.js"></script>
<script src="${ctx}/fed/sea-modules/seajs/seajs-text/1.0.2/seajs-text.js"></script>
<script src="${ctx}/fed/sea-modules/seajs/seajs-style/1.0.2/seajs-style.js"></script>
<script>
  <#if DEBUG?? && DEBUG>
    window.GLOBAL.SEA_BASE = '${ctx}/fed/sea-modules/';
  seajs.config({
    base: window.GLOBAL.SEA_BASE,
    paths: {
      'common': '${appRoot}/common',
      'component': '${appRoot}/component'
    },
    map: [

      //[/(\/sea\-modules\/[^(\-debug)]+?)\.js/, '$1-debug.js']
      function(uri) {
        if (!/\-debug\.(js|css)+/g.test(uri) && uri.indexOf('/app/') == -1) {
          uri = uri.replace(/\/(.*)\.(js|css)/g, "/$1-debug.$2")
        }
        return uri
      }
    ],
    alias: {
      '$':          'jquery/jquery/2.1.0/jquery',
      '$-debug':    'jquery/jquery/2.1.0/jquery-debug',
      'jquery':          'jquery/jquery/2.1.0/jquery',
      'jquery-debug':    'jquery/jquery/2.1.0/jquery-debug',
      'alert':      'pandora/dialog/1.0.0/alert',
      'base':      'pandora/base/1.0.0/base',
      'class':      'pandora/class/1.0.0/class',
      'widget':     'pandora/widget/1.0.0/widget',
      'confirm':    'pandora/dialog/1.0.0/confirm',
      'dialog':     'pandora/dialog/1.0.0/dialog',
      // 'draggable':  'pandora/dragdrop/1.0.0/draggable',
      'locker':     'pandora/locker/1.0.0/locker',
      'overlay':     'pandora/overlay/1.0.0/overlay',
      'tabs':       'pandora/tabs/1.0.0/tabs',
      'select':       'pandora/select/1.0.0/select',
      'tips':       'pandora/dialog/1.0.0/tips',
      'validate':   'pandora/validate/1.0.0/validate',

      'bootstrap3-grid': 'jquery/bootstrap3-grid/0.6.2/bootstrap3-grid',
      "daterangepicker": "jquery/daterangepicker/1.3.5/daterangepicker",
      "daterangepicker.css": "jquery/daterangepicker/1.3.5/daterangepicker.css",
      "popover": "jquery/popover/3.1.1/popover",
      "tooltip": "jquery/tooltip/3.1.1/tooltip",

      'moment':     'gallery/moment/2.5.1/moment',
      'zeroclipboard': 'gallery/zeroclipboard/1.2.2/zeroclipboard',
      'store':     'gallery/store/1.3.16/store',
      'handlebars': 'gallery/handlebars/1.0.2/handlebars',
      'handlebars-helpers': 'gallery/handlebars-helpers/1.3.0/handlebars-helpers',
      'ztree': 'gallery/ztree/3.5.15/ztree'
    },
    debug: true
  });
  <#else>
  seajs.config({
    base: '${jsRoot}'
  });
  </#if>
</script>