  'use strict';

  var $ = require('jquery'),
    Alert = require('pandora-alert');

  var config = require('./config');

  // TODO 支持 Promises/A
  module.exports = {

    process: function(json, callback) {

      function handleSuccess() {
        if (callback) {
          (callback.success || callback).call(json);
        }
      }

      function handleFailure() {
        var msg = json.messages;

        if (Array.isArray(msg)) {
          msg = msg.join('<br>').replace(/\n+/g, '<br>');
        }

        if (callback && callback.error) {
          callback.error.call(null, msg);
        } else {
          new Alert({
            content: msg || '亲，后台异常啦！',
            title: '错误提示'
          });
        }
      }

      function handleInput() {
        var msg,
          field,
          fieldEmpty = true,
          fieldErrors = json.fieldErrors;

        if (!callback || !(callback = callback.input)) {
          return;
        }

        for (field in fieldErrors) {
          fieldEmpty = false;
          msg = fieldErrors[field];
          msg = (msg.shift && msg.shift()) || msg;
          if (callback[field]) {
            callback[field].call(json, msg);
          }
        }

        if (fieldEmpty) {
          msg = json.messages.shift() || json.messages;
          callback.call(json, msg);
        }
      }

      if (!json.result) {
        throw new Error('返回值未包含 `result` ！');
      }

      switch (json.result) {
        case 'success':
          handleSuccess();
          break;
        case 'failure':
          handleFailure();
          break;
        case 'input':
          handleInput();
          break;
        case 'login':
          var loginUrl = window.CMS_USER_DATA.IS_PASSPORT_LOGIN ? '/outlogin.html?' : '/login.html?';
          window.location.href = loginUrl + new Date().getTime();
          break;
        case 'error':
          throw new Error(json.messages || '返回值异常');
        default:
          break;
      }
    },

    post: function(url, data, callback) {
      if (typeof callback === 'undefined' &&
        typeof data === 'function') {
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

    syncPost: function(url, data, callback) {
      if (typeof callback === 'undefined' &&
        typeof data === 'function') {
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

    get: function(url, data, callback) {
      if (typeof callback === 'undefined' &&
        typeof data === 'function') {
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

    syncGet: function(url, data, callback) {
      if (typeof callback === 'undefined' &&
        typeof data === 'function') {
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

    ajax: function(cfg) {
      var self = this,
        url = cfg.url;

      return $.ajax({
        async: cfg.async !== false,
        url: config.getUrl(url),
        dataType: 'json',
        // traditional: true,
        cache: false,
        type: cfg.type,
        data: cfg.data,
        success: function(json) {
          json && self.process(json, cfg.callback);
        },
        error: function() {
          console.warn('server error: ' + url, arguments);
        }
      });
    },

    form: function(cfg, data) {
      var form = document.createElement('form'),
        key, elem;

      form.method = cfg.method || 'POST';
      form.action = config.getUrl(cfg.url);
      form.target = cfg.target || '_self';

      for (key in data) {
        // 保留换行
        elem = document.createElement('textarea');
        elem.name = key;
        elem.value = data[key];
        form.appendChild(elem);
      }

      form.submit();
    }
  };

