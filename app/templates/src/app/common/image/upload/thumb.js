/**
 * 文件上传，HTML5 ONLY
 *
 * @module Upload
 */

'use strict';

var Widget = require('pandora-widget');

/**
 * Thumb
 *
 * @class Thumb
 * @constructor
 */
var Thumb = Widget.extend({

  defaults: {
    classPrefix: 'thumb',
    // image: '',
    thumbWidth: 160,
    thumbHeight: 120
  },

  setup: function () {
    this.drawCanvas();
    this.render();
  },

  drawCanvas: function () {
    // 预览图，canvas（在本地测试中居然比上传还慢）
    var canvas = document.createElement('canvas'),
      ctx2d = canvas.getContext('2d'),
      image = this.option('image'),
      tWidth = this.option('thumbWidth'),
      tHeight = this.option('thumbHeight');

    canvas.width = tWidth;
    canvas.height = tHeight;

    ctx2d.drawImage.apply(ctx2d, computeResizeParams(image, tWidth, tHeight));

    this.element.append(canvas);
  }

});

function computeResizeParams (image, tWidth, tHeight) {
  var wrapRatio = tWidth / tHeight,
    ratio = image.width / image.height,
    w = tWidth, h = tHeight,
    x = 0, y = 0;

    // 太高
    if (wrapRatio > ratio) {
      h = tHeight;
      w = h * ratio;
      x = (tWidth - w) / 2;
    }
    // 太宽
    else if (wrapRatio < ratio){
      w = tWidth;
      h = w / ratio;
      y = (tHeight - h) / 2;
    }

  return [image, x, y, w, h];
}

module.exports = Thumb;

