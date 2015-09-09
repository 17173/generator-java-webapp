define(function(require, exports, module) {

  'use strict';

  var $ = require('$');

  var uniqueId = (function() {
    var ids = {};
    return function() {
      var id = Math.random().toString(36).substr(2);
      if (ids[id]) {
        return uniqueId();
      }
      ids[id] = true;
      return id;
    };
  })();

  function isArr(obj) {
    return Object.prototype.toString.call(obj) === '[object Array]';
  }

  function isObj(obj) {
    return obj &&
      Object.prototype.toString.call(obj) === '[object Object]' &&
      obj.constructor &&
      obj.constructor.prototype.hasOwnProperty('isPrototypeOf');
  }

  var util = {

    transparentSrc: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',

    isArr: isArr,
    isObj: isObj,

    isEmptyObject: function(obj) {
      var p;
      for (p in obj) {
        return false;
      }
      return true;
    },

    /**
     * 复制对象
     * @param  {object} target      目标对象
     * @param  {object} source      待复制对象
     * @param  {boolean} [override] 是否直接替换
     * @return {object}             目标对象
     */
    copy: function(target, source, override) {
      var p, obj, src, copyIsArray, clone;

      for (p in source) {
        obj = source[p];

        if (target === obj) {
          continue;
        }

        src = target[p];

        if (!override &&
          ((copyIsArray = isArr(obj)) || isObj(obj))) {

          clone = copyIsArray ?
            (src && isArr(src) ? src : []) :
            (src && isObj(src) ? src : {});

          target[p] = this.copy(clone, obj, false);
        } else if (typeof obj !== 'undefined') {
          target[p] = obj;
        }
      }

      return target;
    },

    mixin: function(src, dist) {
      var p;

      if (dist) {
        for (p in dist) {
          // if (dist.hasOwnProperty(p)) {
            src[p] = dist[p];
          // }
        }
      }

      return src;
    },

    queryToJson: function(str, sep, eq) {
      var ret = {},
        decode = window.decodeURIComponent;

      sep || (sep = '&');
      eq || (eq = '=');

      str.split(sep).forEach(function(pair) {
        var key, val;

        pair = pair.split(eq);

        key = decode(pair[0]).replace(/\[\]$/g, '');

        try {
          val = decode(pair[1] || '');
        } catch (e) {
          console.log(e + 'decodeURIComponent error : ' + pair[1], 'error');
          val = pair[1] || '';
        }

        val = val.trim();

        if (ret.hasOwnProperty(key)) {
          if (Array.isArray(ret[key])) {
            ret[key].push(val);
          } else {
            ret[key] = [ret[key], val];
          }
        } else {
          ret[key] = val;
        }
      });

      return ret;
    },

    urlParams: function() {
      return this.queryToJson(window.location.search.replace(/^\?/, ''));
    },

    urlHash: function() {
      return this.queryToJson(window.location.hash.replace(/^\#/, ''));
    },

    addParams: function(url, params) {
      return url + (url.indexOf('?') !== -1 ? '&' : '?') + params;
    },

    escape: function(str) {
      var replacements = {
        '<': 'lt',
        '>': 'gt',
        '&': 'amp',
        '"': 'quot',
        '\'': 'apos',
        '…':'hellip'
      };
      return str.replace(/<|>|&|"|'|…/g, function($0) {
        return '&' + replacements[$0] + ';';
      });
    },

    unescape: function(str) {
      var replacements = {
        'lt': '<',
        'gt': '>',
        'amp': '&',
        'quot': '"',
        'apos': '\'',
        'hellip':'…'
      };
      return str.replace(/&(lt|gt|amp|quot|apos|hellip);/g, function(character, $1) {
        return replacements[$1];
      });
    },

    /**
     * 处理缩略图
     * @param  {[type]} imgPath [description]
     * @param  {[type]} affix   [description]
     * @return {[type]}         [description]
     */
    transThumb: function(imgPath, affix) {
      // 非 CDN
      if (!/(i\d\.17173cdn\.com)|(i\d\.cdn\.test\.17173\.com)/.test(imgPath)) {
        return imgPath;
      }

      if (typeof affix === 'undefined') {
        affix = '!a-1-160x120.jpg';
      }

      // 含魔图后缀
      if (imgPath.indexOf('!a-') !== -1) {
        return imgPath.replace(/!a-\d-\d*x\d*\.jpg/, affix);
      }

      return imgPath.replace(/(\.(?:jpg|png|gif))(\?[\w\W]*)?/, '$1' + affix + '$2');
    },

    /**
     * 激活菜单
     * 不用在组件管理页
     *
     * @param  {[type]} index1 头部菜单索引
     * @param  {[type]} index2 边栏菜单索引
     * @param  {[type]} index3 边栏菜单索引2
     * @return {[type]}        [description]
     */
    activeMenu: function(index1, index2, index3) {
      /*if (typeof index3 === 'undefined') {
        index3 = index2;
        index2 = 0;
      }*/
      // 顶部
      //document.querySelector('.navbar-nav li:nth-child(' + (index1 + 1) + ')').classList.add('active');
      // 边栏
      //document.querySelector('.nav-sidebar:nth-child(' + (index2 + 1) * 2 + ') li:nth-child(' + (index3 + 1) + ')').classList.add('active');
    },

    /**
     * 按地址路径激活边栏菜单
     *
     * @param  {[type]} pathname [description]
     * @return {[type]}          [description]
     */
    activeNav: function(pathname) {
      $('.nav-sidebar').find('a').each(function() {
        if ($(this).attr('href').indexOf(pathname) > -1 ) {
          $(this).parent().addClass('active');
          return false;
        }
      });
    },

    uniqueId: uniqueId
  };

  // 预注册 handlebars helper
  var Handlebars = require('handlebars'),
    helpers = require('handlebars-helpers');

  util.mixin(helpers, {

    fthumb: function(url, type, affix) {
      var classError = 'thumb-error',
        backgroundImage = url ? 'background-size:cover;background-image:url(' + url + ');' : '',
        className = 'thumb-160x120 thumb-160x120-' + (type || 'default');

      if (url && typeof affix === 'string') {
        url += affix;
      }

      if (!url) {
        className += ' ' + classError;
      }
      return '<div style="' + backgroundImage + '" class="' + className + '" data-url="' + url + '"></div>';
    }

  });

  var p;

  for (p in helpers) {
    Handlebars.registerHelper(p, helpers[p]);
  }

  util.Handlebars = Handlebars;

  module.exports = util;

});
