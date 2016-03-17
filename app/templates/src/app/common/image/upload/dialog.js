  /**
   * 上传
   *
   * @module Upload
   */

  'use strict';

  var $ = require('jquery'),
    Dialog = require('pandora-dialog');

  var Button = require('../../button/button');

  var Upload = require('./upload');

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
      maskFixed: true,
      // 魔图设置
      process: true,
      uploadOptions: {
        classPrefix: 'image-upload',
        url: 'imageUpload',
        queueOptions: {},
        selectOptions: {
          accept: 'image/*',
          label: '添加图片',
          // 1M
          maxSize: 5 * 1024 * 1024
        },
        buttonOptions: {}
      },
      buttonOptions: {}
    },

    setup: function() {
      var self = this;

      self.initUpload();
      self.initButton();

      self.option('children', [self.upload, self.button]);

      ImageDialog.superclass.setup.apply(this);
    },

    initUpload: function() {
      var self = this,
        uploadOptions = self.option('uploadOptions');

      $.extend(true, uploadOptions, {
        formData: self.option('formData'),
        fileName: self.option('fileName'),
        process: self.option('process')
      });

      self.upload = new Upload(uploadOptions);
    },

    initButton: function() {
      var self = this,
        buttonOptions = self.option('buttonOptions');

      $.extend(true, buttonOptions, {
        data: {
          icon: 'times',
          label: '关闭窗口'
        },
        delegates: {
          'click': function() {
            self.close();
          }
        },
        disabled: false
      });

      self.button = new Button(buttonOptions);
    }

  });

  module.exports = ImageDialog;

