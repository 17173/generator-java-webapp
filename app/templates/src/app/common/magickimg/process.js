  /**
   * 魔图图片处理
   *
   * @module magickimg
   */

  'use strict';

  var Base = require('pandora-base');

  var XHR = require('../xhr'),
    FormData = require('../form/data');

  function getType(url) {
    return 'jpg';
    // return url.substring(url.lastIndexOf('.') + 1);
  }

  // 可以缩略图，sourceData/width未设置说明入口处已作限制
  function canSmallsize(width, toWidth) {
    return toWidth && (!width || width > toWidth);
  }

  // 可以加水印，sourceData未设置说明入口处已作限制
  function canWatermark(sourceData, watermarkData) {
    return !watermarkData || (
      sourceData.width >= watermarkData.width &&
      sourceData.height >= watermarkData.height);
  }

  var Process = Base.extend({

    initialize: function() {
      Process.superclass.initialize.apply(this, arguments);

      this.process();
    },

    defaults: {
      url: 'imageAddWatermark'
    },

    process: function() {
      var self = this,
        xhr, formData,
        thumbUrl = self.option('imageUrl'),
        settings = self.option('settings');

      if (settings) {
        if (canSmallsize(self.option('sourceData/width'), +settings.width)) {
          thumbUrl += '!a-3-' + settings.width +
            'x.' + getType(thumbUrl);
        }

        if (settings.watermark &&
          canWatermark(self.option('sourceData'), self.option('watermarkData'))) {
          xhr = new XHR({
            url: self.option('url'),
            events: {
              done: function(e, data) {
                self.fire('complete', data);
              },
              fail: function(e, error) {
                self.fire('error', error);
              }
            }
          });

          formData = new FormData(null, {
            sourceImage: thumbUrl,
            gravity: settings.gravity,
            watermark: settings.watermark
          });

          xhr.submit(formData.paramify());
        } else {
          self.fire('complete', thumbUrl);
        }
      } else {
        self.fire('complete', thumbUrl);
      }
    }

  });

  module.exports = Process;

