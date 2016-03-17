  'use strict';

  var urlmap = require('./urlmap');

  var ctx = (window.USER_DATA.CTX || '') + '/',
    reSkip = /^(https?:)?\/\/?/;

  module.exports = {

    /**
     * 获取真实URL地址
     *
     * @param  {String} key
     * @return {String} URL地址
     */
    getUrl: function(key) {
      if (!key || reSkip.test(key)) {
        return key;
      }

      key = key.split('?');

      if (urlmap.hasOwnProperty(key[0])) {
        return ctx + urlmap[key[0]] + (key[1] ? ('?' + key[1]) : '');
      } else {
        console.warn('the key `' + key[0] + '` is NOT exist');
      }
    }

  };

