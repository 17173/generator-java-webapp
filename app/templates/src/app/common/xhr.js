  /**
   * XMLHttpRequest
   *
   * @module XHR
   */

  'use strict';

  var Base = require('pandora-base');

  var util = require('./util'),
    config = require('./config');

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

    initialize: function() {
      XHR.superclass.initialize.apply(this, arguments);

      // 初始化 XMLHttpRequest
      this.setup();
    },

    defaults: {
      url: '',
      method: 'POST',
      enctype: ENC_APPLI,
      async: true
    },

    setup: function() {
      var self = this,
        xhr = self.xhr = new XMLHttpRequest();

      xhr.addEventListener('error', function(e, error) {
        console.error(e, error);
      }, false);

      xhr.addEventListener('load', function(e) {
        var response;
        if (e.target.status === 200) {
          response = e.target.responseText.trim();
          if (/^(\{[\w\W]*\})$/.test(response)) {
            var data = JSON.parse(response);
            if (data.result === 'success') {
              self.fire('done', data.data);
            } else {
              self.fire('fail', data.messages[0]);
            }
          } else {
            self.fire('done', response);
          }
        } else {
          self.fire('fail', e.target.statusText);
        }

        self.fire('load');
      }, false);

      // 只有文件上传，才有progress
      if (self.option('enctype') === XHR.ENC_MULTI) {
        // 上传表单，增加upload的progress事件侦听
        xhr.upload.addEventListener('progress', function(e) {
          if (e.lengthComputable) {
            self.fire('progress', e.loaded / e.total);
          }
        }, false);
      }
    },

    submit: function(formData) {
      var self = this,
        xhr = self.xhr,
        method = self.option('method'),
        url = config.getUrl(self.option('url')),
        enctype = self.option('enctype');

      if (formData && method === 'GET') {
        url = util.addParams(url, formData);
        formData = null;
      }

      xhr.open(method, url, self.option('async'));

      xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');

      (enctype !== XHR.ENC_MULTI) && xhr.setRequestHeader('Content-Type', enctype);

      xhr.send(formData || null);
    },

    destroy: function() {
      this.xhr.abort();

      XHR.superclass.destroy.apply(this);
    }

  });

  XHR.ENC_MULTI = ENC_MULTI;
  XHR.ENC_APPLI = ENC_APPLI;

  module.exports = XHR;

