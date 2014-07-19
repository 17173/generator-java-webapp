define(function (require, exports, module) {

/**
 * 上传
 *
 * @module Upload
 */

'use strict';

var $ = require('$'),
    Dialog = require('dialog');

var BaseButton = require('../base/button');

var Core = require('./core');

/**
 * ImageDialog
 *
 * @class ImageDialog
 * @constructor
 */
var ImageDialog = Dialog.extend({

  defaults: {
    title: '上传图片',
    fileName: 'imageFile',
    // 魔图设置
    process: true,
    uploadOptions: {
      classPrefix: 'image-upload',
      url: 'imageUpload',
      queueOptions: { },
      selectOptions: {
        accept: 'image/*',
        label: '添加图片',
        // 1M
        maxSize: 5 * 1024 * 1024
      },
      buttonOptions: { }
    },
    buttonOptions: { }
  },

  setup: function () {
    var self = this;

    self.initCore();
    self.initButton();

    self.option('children', [self.core, self.button]);

    ImageDialog.superclass.setup.apply(this);
  },

  initCore: function () {
    var self = this,
        uploadOptions = self.option('uploadOptions');

    $.extend(true, uploadOptions, {
      formData: self.option('formData'),
      fileName: self.option('fileName'),
      process: self.option('process'),
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

    self.button = new BaseButton(buttonOptions);
  }

});

module.exports = ImageDialog;

});
