define(function (require, exports, module) {

/**
 * 表单提交
 *
 * @module Form
 */

'use strict';

var $ = require('$'),
    Validate = require('validate');

var XHR = require('../xhr');

var Core = require('./core'),
    Data = require('./data');

/**
 * Form
 *
 * @class Form
 * @constructor
 */
var Form = Core.extend({

  type: 'form',

  defaults: {
    url: '',
    method: 'POST',
    enctype: XHR.ENC_APPLI,
    // validating on values change
    eventType: 'change',
    data: {
      novalidate: true,
      buttons: [
        {
          type: 'submit',
          cls: 'btn-primary',
          value: '确定'
        },
        {
          type: 'reset',
          value: '取消'
        }
      ]
    },
    // 事件代理
    delegates: {
      'submit': function (e) {
        e.preventDefault();
        this.submit();
      }
    },
    formData: { },
    // 添加表单验证
    validate: true,
    // 包含 XHR 提交
    xhr: true
  },

  setup: function () {
    var self = this;

    if (self.option('validate')) {
      self.on('render', function () {
        self.initValidate();
      });
    }

    self.on('render', function () {
      self.$('[autofocus]').focus();
    });

    Form.superclass.setup.apply(self);
  },

  submit: function () {
    var self = this;
    if (self.validate && !self.option('skipValidate')) {
      self.validate.submit();
    } else {
      self.option('xhr') && self.xhrSend();
    }
  },

  initValidate: function () {
    var self = this;

    self.validate = new Validate({
      element: self.element,//.role('form'),
      events: {
        all: function (e) {
          self.fire.apply(self, arguments);
        },
        valid: function () {
          self.option('xhr') && self.xhrSend();
          return false;
        }
      },

      eventType: self.option('eventType'),
      wrapHook: function (elem) {
        var wrap = elem.data('validate-wrap');

        if (!wrap) {
          wrap = elem.parent();

          elem.data('validate-wrap', wrap);
        }

        return wrap;
      },
      helpHook: function (elem) {
        var wrap,
            help = elem.data('validate-help');

        if (!help) {
          wrap = elem.data('validate-wrap');
          help = wrap.find('.help-block');

          if (help.length === 0) {
            help = $('<span class="help-block"></span>').appendTo(wrap);
          }

          help.on('click', function () {
            elem.trigger('mousedown');
            elem.focus();
          });

          elem.data('validate-help', help);
        }

        return help;
      },
      customRules: self.option('customRules') || {},
      customMessages: self.option('customMessages') || {}
    });
  },

  initXHR: function () {
    var self = this;

    self.xhr = new XHR({
      url: self.option('url'),
      method: self.option('method'),
      enctype: self.option('enctype'),
      events: {
        all: function (e, data) {
          if (e.type === 'done') {
            if (data.result === 'failure') {
              e.type = 'fail';
              data = data.messages;
            } else {
              data = data.data;
            }
          }

          self.fire.apply(self, arguments);
        },
        // done 与 fail 后，都会触发 load
        load: function (e) {
          self.role('submit').attr('disabled', false);
        }
      }
    });
  },

  initFormData: function () {
    var self = this,
      form = self.role('form'),
      formData,
      optionFormData = self.option('formData'),
      key;

    // TODO: 排除文件域为空的情况
    if (form.find(':file[name]').length) {
      self.xhr.option('enctype', XHR.ENC_MULTI);
      formData = new FormData(form[0]);
    } else {
      formData = new Data(form.prop('elements'));
    }

    for (key in optionFormData) {
      formData.append(key, optionFormData[key]);
    }

    self.formData = formData;
  },

  xhrSend: function () {
    var self = this,
      formData;

    if (!self.xhr) {
      self.initXHR();
    }

    self.initFormData();

    if (self.fire('formData') === false) {
      return;
    }

    formData = self.formData;

    if (typeof formData.paramify === 'function') {
      formData = formData.paramify();
    }

    self.role('submit').attr('disabled', true);
    self.fire('beforeSubmit');
    self.xhr.submit(formData);
  }

});

module.exports = Form;

});
