define(function (require, exports, module) {

/**
 * XMLHttpRequest
 *
 * @module XHR
 */

'use strict';

var Base = require('base');

var config = require('./config');

var ENC_MULTI = 'multipart/form-data';
var ENC_APPLI = 'application/x-www-form-urlencoded';

/**
 * XHR
 *
 * 使用 XMLHttpRequest，事件流程为先上传后下载
 *
 * @class XHR
 * @constructor
 */
var XHR = Base.extend({

  initialize: function () {
    XHR.superclass.initialize.apply(this, arguments);

    // 初始化 XMLHttpRequest
    this.setup();
  },

  defaults: {
    url: '',
    method: 'POST',
    enctype: ENC_APPLI
  },

  setup: function () {
    var self = this;

    self.xhr = new XMLHttpRequest();

    self.xhr.addEventListener('error', function (e) {
      console.error(e, arguments[1]);
    }, false);

    self.xhr.addEventListener('load', function (e) {
      var target = e.target;

      if (target.status === 200) {
        self.fire('done', JSON.parse(target.responseText));
      } else {
        self.fire('fail', target.statusText);
      }

      self.fire('load');
    }, false);

    if (self.option('enctype') === XHR.ENC_MULTI) {
      // 上传表单，增加upload的progress事件侦听
      self.xhr.upload.addEventListener('progress', function (e) {
        if (e.lengthComputable) {
          self.fire('progress', e.loaded / e.total);
        }
      }, false);
    }

    // ['abort', 'error', 'load', 'progress', 'timeout']
    //   .forEach(function (type) {
    //     // 主进程/下载进程
    //     self.xhr.addEventListener('load', function (e) {
    //       self.fire(type, e);
    //     }, false);
    //     // 上传进程
    //     self.xhr.upload.addEventListener(type, function (e) {
    //       self.fire('upload' + type.replace(/^[a-z]/, function (w) {
    //         return w.toUpperCase();
    //       }), e);
    //     }, false);
    //   });
  },

  submit: function (formData) {
    var self = this,
      xhr = self.xhr,
      enctype = self.option('enctype');

    xhr.open(self.option('method'),
      config.getUrl(self.option('url')), true);

    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');

    if (enctype !== XHR.ENC_MULTI) {
      xhr.setRequestHeader('Content-Type', self.option('enctype'));
    }

    xhr.send(formData || null);
  },

  destroy: function () {
    this.xhr.abort();

    XHR.superclass.destroy.apply(this);
  }

});

XHR.ENC_MULTI = ENC_MULTI;
XHR.ENC_APPLI = ENC_APPLI;

module.exports = XHR;

});
