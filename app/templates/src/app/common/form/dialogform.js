define(function(require, exports, module) {

  /**
   * 表单提交
   *
   * @module Form
   */

  'use strict';

  var Confirm = require('confirm');

  var util = require('../util');

  var FixedForm = require('./fixedform');
  var buttonTemplate = require('./dialog-buttons.handlebars');

  /**
   * 表单位于对话框内
   *
   * @class DialogForm
   * @constructor
   * @extends {Class} Confirm
   */
  var DialogForm = Confirm.extend({

    type: 'dialog',

    defaults: {
      css: {
        position: 'absolute',
        width: 640
      },
      formData: {},
      formOptions: {},
      maskFixed: true
    },

    setup: function() {
      var self = this,
        form,
        formOptions = self.option('formOptions');

      util.copy(formOptions, {
        formData: self.option('formData')
      });

      form = self.form = new FixedForm(formOptions);
      self.option('children', [form]);
      self.once('render', function() {
        var buttonHtml;
        var buttonData = self.option('buttons');
        if (buttonData) {
          buttonHtml = buttonTemplate({buttons: buttonData});
          self.role('submit').after(buttonHtml);
        }
      });
      DialogForm.superclass.setup.apply(self);

      self.submit(function() {
        form.submit();
        return false;
      });

      self.on('done', function() {
        self.close();
      });
    }

  });

  module.exports = DialogForm;

});
