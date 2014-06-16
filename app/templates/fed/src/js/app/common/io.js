define(function(require, exports, module) {

  var $ = require('jquery');

  var config = require('./config');

  module.exports = {

    processor: function (json, callback) {
      var msg,
        success,
        error,
        input;

      //全局异常处理(login|error)
      /*if ( json.result === 'login' ) {
       //登录页跳转
       window.location.href = io.$cfg('page_login');
       }*/
      if (json.result === 'error') {
        //异常提示
        console.error(json.messages);
        return;
      }

      /**
       * 业务相关回调,参数中包含业务的成功失败消息
       * 1. success(message)|failure(message)
       *
       * 表单验证
       * 2. input(fieldErrors)
       */
      if (['success', 'failure'].indexOf(json.result) !== -1) {
        msg = json.messages;

        if (Array.isArray(msg)) {
          msg = msg.join('<br>').replace('\n', '<br>');
        }

        success = callback['success'] || callback;

        error = callback['error'] || function(msg) {
          // TODO:
          // util.showError(msg);
          //$.error(msg).modal();
        };

        (json.result === 'success' ? success : error).call(json, msg);

      } else if (json.result === 'input') {

        if (!$.isEmptyObject(json['fieldErrors'])) {

          $.each(json['fieldErrors'], function(field, v) {

            msg = (v.shift && v.shift()) || v;

            input = callback['input'];

            input && input[field] && input[field].call(json, msg);
          });

        } else {

          msg = json.messages.shift() || json.messages;

          (callback['input'] || console.log).call(json, msg);
        }
      }
    },

    post: function (url, data, callback) {
      if (typeof callback === 'undefined') {
        callback = data;
        data = {};
      }

      return this.ajax({
        url: url,
        data: data,
        callback: callback,
        type: 'post'
      });
    },

    syncPost: function (url, data, callback) {
      if (typeof callback === 'undefined') {
        callback = data;
        data = {};
      }

      return this.ajax({
        async: false,
        url: url,
        data: data,
        callback: callback,
        type: 'post'
      });
    },

    get: function (url, data, callback) {
      if (typeof callback === 'undefined') {
        callback = data;
        data = {};
      }

      return this.ajax({
        url: url,
        data: data,
        callback: callback,
        type: 'get'
      });
    },

    syncGet: function (url, data, callback) {
      if (typeof callback === 'undefined') {
        callback = data;
        data = {};
      }

      return this.ajax({
        async: false,
        url: url,
        data: data,
        callback: callback,
        type: 'get'
      });
    },

    ajax: function (cfg) {
      var self = this,
        url = cfg.url;

      return $.ajax({
        async: cfg.async !== false,
        url: config.getUrl(url),
        dataType: 'json',
        traditional: true,
        // cache: false,
        type: cfg.type,
        data: cfg.data,
        success: function (json) {
          //callback(json);
          json && self.processor(json, cfg.callback);
        },
        error: function () {
          console.warn('server error: ' + url, arguments);
        }
      });
    }
  };

});
