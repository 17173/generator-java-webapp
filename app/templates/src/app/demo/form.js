  'use strict';

  /**
   * 弹窗表单
   */

  var Tips = require('pandora-tips');

  var io = require('../common/io');
  var DialogForm = require('../common/form/dialogform');

  var Form = DialogForm.extend({
    defaults: {
      isEdit: false,
      formOptions: {
        customRules: {
          code: {
            async: function(callback, el) {
              var self = this;
              var params = {
                code: el.value.trim()
              };
              if (this.option('isEdit')) {
                params.id = this.option('id');
              }
              io.get('userCheck', params, function() {
                callback.call(self, !this.data);
              });
            }
          }
        },
        customMessages: {
          code: {
            async: '工号已存在，请重输！'
          }
        },
        events: {
          done: function() {
            var msg = this.option('isEdit') ? '编辑成功' : '添加成功';
            new　Tips({
              content: msg
            });
          }
        }
      }
    },

    setup: function() {
      this.option('formOptions/isEdit', this.option('isEdit'));
      this.option('formOptions/id', this.option('id'));
      Form.superclass.setup.call(this);
    }
  });

  module.exports = Form;
