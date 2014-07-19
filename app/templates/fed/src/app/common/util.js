define(function(require, exports, module) {

'use strict';

var $ = require('$');

var uniqueId = (function () {
  var ids = {};
  return function () {
    var id = Math.random().toString(36).substr(2);
    if (ids[id]) {
      return uniqueId();
    }
    ids[id] = true;
    return id;
  };
})();

module.exports = {

  mixin: function (src, dist) {
    var p;

    if (dist) {
      for (p in dist) {
        src[p] = dist[p];
      }
    }

    return src;
  },

  queryToJson: function (str, sep, eq) {
    var ret = {},
      decode = decodeURIComponent;

    sep || (sep = '&');
    eq || (eq = '=');

    str.split(sep).forEach(function (pair) {
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

  urlParams: function () {
    return this.queryToJson( window.location.search.replace(/^\?/, '') );
  },

  // TODO: 需要重新整理
  // packForm: function (form, escape) {
  //   var $form = typeof form === 'string' ? $(form) : form;
  //   var a = $form.serializeArray();
  //   var o = {};

  //   escape = (typeof escape == 'undefined') ? true : false;

  //   $.each(a, function() {
  //     var value = this.value;

  //     this.value = value === 'null'?null:this.value;

  //     if (typeof o[this.name] !== 'undefined') {
  //       if (!o[this.name].push) {
  //         o[this.name] = [o[this.name]];
  //       }
  //       o[this.name].push(escape ? util.escape(this.value) : $.trim(this.value));
  //     } else {
  //       o[this.name] = (escape) ? util.escape(this.value) : $.trim(this.value);
  //     }
  //   });
  //   return o;
  // },

  escape: function (str) {
    var replacements = {
      '<': 'lt',
      '>': 'gt',
      '&': 'amp',
      '"': 'quot',
      '\'': 'apos'
    };
    return str.replace(/<|>|&|"|'/g, function($0) {
      return '&' + replacements[$0] + ';';
    });
  },

  unescape: function (str) {
    var replacements = {
      'lt': '<',
      'gt': '>',
      'amp': '&',
      'quot': '"',
      'apos': '\''
    };
    return str.replace(/&(?:lt|gt|amp|quot|apos);/g, function(character, $1) {
      return replacements[$1];
    });
  },

  toQueryPair: function (key, value) {
    if (typeof value === 'undefined'){
      return key;
    }

    return key + '=' + encodeURIComponent(value === null ? '' : value);
  },

  /**
   * 激活菜单
   * 不用在组件管理页
   *
   * @param  {[type]} index1 头部菜单索引
   * @param  {[type]} index2 边栏菜单索引
   * @return {[type]}        [description]
   */
  activeMenu: function(index1, index2) {
    $('.navbar-nav').find('li').eq(index1).addClass('active');
    $('.nav-sidebar').find('li').eq(index2).addClass('active');
  },

  uniqueId: uniqueId
};

});
