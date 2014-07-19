define(function (require, exports, module) {

/**
 * 上传
 *
 * @module Upload
 */

'use strict';

var $ = require('$'),
    Dialog = require('dialog');

var Core = require('./core'),
    Button = require('./button');

/**
 * CoreDialog
 *
 * @class CoreDialog
 * @constructor
 * @extends {Class} Dialog
 */
var CoreDialog = Dialog.extend({

  type: 'Dialog',

  defaults: {
    mask: true,
    title: '上传',
    css: {
      position: 'absolute'
    },
    // 额外的form数据
    formData: { },
    uploadOptions: { },
    buttonOptions: { }
  },

  setup: function () {
    var self = this;

    self.initCore();
    self.initButton();

    self.option('children', [self.core, self.button]);

    CoreDialog.superclass.setup.apply(this);
  },

  initCore: function () {
    var self = this,
        uploadOptions = self.option('uploadOptions');

    $.extend(true, uploadOptions, {
      formData: self.option('formData'),
      fileName: self.option('fileName'),
      events: {
        all: function (e) {
          return self.fire.apply(self, arguments);
        }
      }
    });

    self.core = new Core(uploadOptions);
  },

  initButton: function () {
    var self = this,
        buttonOptions = self.option('buttonOptions');

    $.extend(true, buttonOptions, {
      data: {
        icon: 'times',
        label: '关闭窗口'
      },
      delegates: {
        'click': function () {
          self.close();
        }
      },
      disabled: false
    });

    self.button = new Button(buttonOptions);
  },

  destroy: function () {
    this.upload.destroy();
    this.button.destroy();

    CoreDialog.superclass.destroy.apply(this);
  }

});

module.exports = CoreDialog;

});
