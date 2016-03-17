(function(window) {

  'use strict';

  var VERSION = '@VERSION';
  var DEBUG = '@DEBUG';
  var COPYRIGHT = '@COPYRIGHT';

  var GLOBAL = window.USER_DATA,
    isAbsolute = GLOBAL.APP_ROOT.indexOf('127.0.0.1') > -1 || GLOBAL.APP_ROOT.indexOf('http://') > -1,
    appRoot = isAbsolute ? GLOBAL.APP_ROOT : ('http://' + location.host + GLOBAL.APP_ROOT),
    seaRoot = GLOBAL.SEA_ROOT;

  var alias = {
    'jquery': 'jquery/2.1.1/jquery',
    'pandora-alert': 'pandora-alert/1.1.2/index',
    'pandora-base': 'pandora-base/1.1.0/base',
    'pandora-events': 'pandora-events/1.1.0/events',
    'pandora-class': 'pandora-class/1.1.0/class',
    'pandora-widget': 'pandora-widget/1.1.0/widget',
    'pandora-confirm': 'pandora-confirm/1.1.1/index',
    'pandora-dialog': 'pandora-dialog/1.1.1/dialog',
    'pandora-locker': 'pandora-locker/1.1.0/locker',
    'pandora-overlay': 'pandora-overlay/1.1.0/overlay',
    'pandora-tabs': 'pandora-tabs/1.1.0/tabs',
    'pandora-switchable': 'pandora-switchable/1.0.0/index',
    'pandora-select': 'pandora-select/1.1.1/index',
    'pandora-tips': 'pandora-tips/1.1.1/index',
    'pandora-validate': 'pandora-validate/1.1.0/validate',
    'pandora-importstyle': 'pandora-importstyle/1.1.0/importstyle',
    'import-style': 'import-style/1.0.0/index',
    'importstyle': 'import-style/1.0.0/index',
    'pandora-gallery': 'pandora-gallery/1.0.0/gallery',

    'bootstrap3-grid': 'bootstrap3-grid/0.6.3/index',
    'jquery-daterangepicker': 'jquery-daterangepicker/1.3.22/index',
    'jquery-popover': 'jquery-popover/3.1.2/index',
    'jquery-tooltip': 'jquery-tooltip/3.1.2/index',

    'moment': 'moment/2.10.3/moment',
    'zeroclipboard': 'zeroclipboard/2.2.0/dist/ZeroClipboard',
    'store': 'store/1.3.16/store',
    'handlebars': 'handlebars/1.3.0/dist/cjs/handlebars',
    'handlebars-runtime': 'handlebars-runtime/1.3.0/dist/cjs/handlebars.runtime',
    'cms3-handlebars-helpers': 'cms3-handlebars-helpers/1.3.0/index',
    'ztree-v3': 'ztree-v3/3.5.17/js/jquery.ztree.all-3.5',
    'sifter': 'sifter/0.3.6/sifter',

    'seajs-style': 'seajs-style/1.0.2/seajs-style',
    'seajs-debug': 'seajs-debug/1.1.1/seajs-debug'
  };
  var mod, values = [];

  for (mod in alias) {
    values.push(alias[mod] + '.js');
    alias[mod] = seaRoot + alias[mod];
  }
  seajs.config({
    base: appRoot,
    alias: alias,
    map: [
      function(uri) {
        uri = uri.replace('jquery/1.11.1/jquery', 'jquery/2.1.1/jquery')
                .replace('jquery/2.1.0/jquery', 'jquery/2.1.1/jquery')
                .replace('handlebars-runtime/1.3.0/dist/cjs/handlebars.runtime','handlebars/1.3.0/dist/cjs/handlebars')
                .replace('moment/2.9.0/moment', 'moment/2.10.3/moment');

        var curValue = uri.replace(appRoot, '');

        function tt(uri) {
          return uri.replace(/\.js$/, '.js?' + VERSION);
        }
        if (uri.indexOf('jquery/2.1') > -1 || uri.indexOf('jquery/jquery') > -1) {
          return GLOBAL.JS_ROOT + 'jquery.js' + (DEBUG ? '?nowrap' : '');
        }

        if (values.indexOf(curValue) > -1 || uri.indexOf('app/pandora-') > -1) {
          return uri.replace(appRoot, seaRoot);
        }
        if (uri.indexOf(seaRoot) > -1) {
          return uri;
        }
        return tt(uri);

        // 返回远程模块地址
        //return tt(uri.replace(appRoot, seaRoot));
      }

    ]
  });

  (function(node) {
    node && (node.innerHTML = COPYRIGHT);
  })(window.document.querySelector('[data-role="copyright"]'));

})(this);
