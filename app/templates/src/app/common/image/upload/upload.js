  /**
   * 上传
   *
   * @module ImageUpload
   */

  'use strict';

  var Upload = require('../../upload/upload');

  var Thumb = require('./thumb');

  /**
   * ImageUpload
   *
   * @class ImageUpload
   * @constructor
   */
  var ImageUpload = Upload.extend({

    defaults: {
      fileName: 'imageFile',
      hasWatermark: true,
      classPrefix: 'image-upload',
      url: 'imageUpload',
      queueOptions: {},
      selectOptions: {
        accept: 'image/*',
        label: '添加图片',
        // 最大尺寸：5M
        maxSize: 5 * 1024 * 1024
      },
      buttonOptions: {}
    },

    setup: function() {
      this.on({
        render: function(e) {
          var target = e.target;
          if (target.type === 'File') {
            // 显示预览图
            this.initFileThumb(target);
          }
        },
        destroy: function(e) {
          var target = e.target;
          if (target.type === 'File') {
            // 删除预览图
            target.thumb && target.thumb.destroy();
          }
        }
      });

      ImageUpload.superclass.setup.apply(this);
    },

    initFileThumb: function(file) {
      var reader = new FileReader();

      reader.onload = function(e) {
        var image = new Image();

        image.onload = function() {
          // 尺寸信息
          file.role('width').text(this.width);
          file.role('height').text(this.height);
          file.role('dimens').show();

          // 预览图
          file.thumb = new Thumb({
            container: file.element,
            image: image
          });

          // 回设
          file.data({
            width: this.width,
            height: this.height
          });
        };

        image.src = e.target.result;
      };

      reader.readAsDataURL(file.option('file'));
    }

  });

  module.exports = ImageUpload;

