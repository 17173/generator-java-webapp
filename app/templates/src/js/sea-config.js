(function(window) {

  'use strict';

  var GLOBAL = window.USER_DATA,
    appRoot = GLOBAL.APP_ROOT.indexOf('http://') >-1 ? GLOBAL.APP_ROOT : ('http://' + location.host + GLOBAL.APP_ROOT),
    seaRoot = GLOBAL.SEA_ROOT;

  var alias = {
    '$': 'jquery/jquery/2.1.0/jquery',
    'jquery': 'jquery/jquery/2.1.0/jquery',
    'alert': 'pandora/dialog/1.0.0/alert',
    'autorender': 'pandora/widget/1.0.0/autorender',
    'base': 'pandora/base/1.0.0/base',
    'class': 'pandora/class/1.0.0/class',
    'widget': 'pandora/widget/1.0.0/widget',
    'confirm': 'pandora/dialog/1.0.0/confirm',
    'dialog': 'pandora/dialog/1.0.0/dialog',
    'locker': 'pandora/locker/1.0.0/locker',
    'overlay': 'pandora/overlay/1.0.0/overlay',
    'switchable': 'pandora/switchable/1.0.0/switchable',
    'tabs': 'pandora/tabs/1.0.0/tabs',
    'select': 'pandora/select/1.1.0/select',
    'tips': 'pandora/dialog/1.0.0/tips',
    'validate': 'pandora/validate/1.0.0/validate',
    'importstyle': 'pandora/importstyle/1.0.0/importstyle',
    'gallery': 'pandora/gallery/1.0.0/gallery',

    'bootstrap3-grid': 'jquery/bootstrap3-grid/0.6.3/bootstrap3-grid',
    'daterangepicker': 'jquery/daterangepicker/1.3.22/daterangepicker',
    'popover': 'jquery/popover/3.1.1/popover',
    'tooltip': 'jquery/tooltip/3.1.1/tooltip',

    'moment': 'gallery/moment/2.9.0/moment',
    'zeroclipboard': 'gallery/zeroclipboard/1.2.2/zeroclipboard',
    'store': 'gallery/store/1.3.16/store',
    'handlebars': 'gallery/handlebars/1.3.0/handlebars',
    'handlebars-helpers': 'gallery/handlebars-helpers/1.3.0/handlebars-helpers',
    'ztree': 'gallery/ztree/3.5.16/ztree',
    'sifter': 'gallery/sifter/0.3.4/sifter',

    'seajs-style': 'seajs/seajs-style/1.0.2/seajs-style',
    'seajs-debug': 'seajs/seajs-debug/1.1.1/seajs-debug'
  };
  var version = '@VERSION';
  var debug = '@DEBUG';
  var copyright = '@COPYRIGHT';
  var mod;
  if (debug) {
    for (mod in alias) {
      alias[mod] += '-debug';
      if (mod === '$' || mod === 'jquery') {
        alias[mod + '-debug'] = alias[mod];
      }
    }
  }
  seajs.config({
    base: appRoot,
    alias: alias,
    map: [
      function(uri) {
        function tt(uri) {
          return uri.replace(/\.js$/, '.js?' + version);
        }

        // 本地模块，直接加时间戳
        if (!/^(pandora|gallery|jquery)/.test(uri.split(appRoot)[1])) {
          return tt(uri);
        }

        // handlebars，避免引入两个，导致无法正确读取 helpers
        if (uri.indexOf('handlebars-runtime') !== -1) {
          uri = uri.replace('handlebars-runtime', 'handlebars');
        }

        // 返回远程模块地址
        return tt(uri.replace(appRoot, seaRoot));
      }
    ]
  });

  (function(node) {
    node && (node.innerHTML = copyright);
  })(window.document.querySelector('[data-role="copyright"]'));

})(this);
