define(function(require, exports, module) {

var urlmap = require('./urlmap');

var ctx = (window.ctx || '') + '/',
  reSkip = /^(https?:)?\/\/?/;

module.exports = {

  /**
   * 获取真实URL地址
   *
   * @param  {String} key
   * @return {String} URL地址
   */
  getUrl: function (key) {
    if (!key || reSkip.test(key)) {
      return key;
    }

    if (urlmap.hasOwnProperty(key)) {
      return ctx + urlmap[key];
    } else {
      console.warn('the key `' + key + '` is NOT exist');
    }
  }

};

});