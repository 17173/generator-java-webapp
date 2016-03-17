  /**
   * 上传
   *
   * @module Upload
   */

  'use strict';

  var $ = require('jquery'),
    Dialog = require('pandora-dialog');

  var Upload = require('./upload'),
    Button = require('../button/button');

  /**
   * UploadDialog
   *
   * @class UploadDialog
   * @constructor
   * @extends {Class} Dialog
   */
  var UploadDialog = Dialog.extend({

    type: 'Dialog',

    defaults: {
      buttonOptions: {},
      css: {
        position: 'absolute'
      },
      // 额外的form数据
      formData: {},
      mask: true,
      maskFixed: true,
      title: '上传',
      uploadOptions: {}
    },

    setup: function() {
      var self = this;

      self.initUpload();
      self.initButton();

      self.option('children', [self.upload, self.button]);

      UploadDialog.superclass.setup.apply(this);
    },

    initUpload: function() {
      var self = this,
        uploadOptions = self.option('uploadOptions');

      $.extend(true, uploadOptions, {
        formData: self.option('formData'),
        fileName: self.option('fileName')
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
    },

    destroy: function() {
      this.upload.destroy();
      this.button.destroy();

      UploadDialog.superclass.destroy.apply(this);
    }

  });

  module.exports = UploadDialog;

