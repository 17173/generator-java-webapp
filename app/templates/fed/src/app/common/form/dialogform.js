define(function (require, exports, module) {

/**
 * 表单提交
 *
 * @module Form
 */

'use strict';

var $ = require('$'),
    Confirm = require('confirm');

var NarrowForm = require('./narrowform');

/**
 * DialogForm
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
    formData: { },
    formOptions: { }
  },

  setup: function () {
    var self = this,
      form,
      formOptions = self.option('formOptions');

    $.extend(true, formOptions, {
      formData: self.option('formData'),
      events: {
        all: function (e) {
          self.fire.apply(self, arguments) &&
            (e.type === 'done') && self.close();
        }
      }
    });

    form = new NarrowForm(formOptions);

    self.option('children', [form]);

    self.on({
      submit: function () {
        form.submit();
        return false;
      }
    });

    DialogForm.superclass.setup.apply(self);
  }

});

module.exports = DialogForm;

});
