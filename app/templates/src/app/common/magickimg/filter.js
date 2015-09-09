define(function (require, exports, module) {

/**
 * 魔图图片处理
 *
 * @module magickimg
 */

'use strict';

module.exports = {

  filterWidth: function (widthSelect, data) {
    // 限制尺寸选择
    var dataSelect = widthSelect.data('select'),
        selectedFound = false;

    dataSelect.forEach(function (item) {
      var disabled = item.disabled =
          data.width && (+item.value) > data.width;

      if (disabled) {
        item.selected = false;
      } else {
        if (item.selected) {
          selectedFound = true;
        }
      }
    });

    if (!selectedFound) {
      dataSelect[0].selected = true;
    }

    widthSelect.render();
  },

  filterWatermark: function (watermarkSelect, data) {
    // 限制尺寸选择
    var dataSelect = watermarkSelect.data('select'),
        selectedFound = false;

    dataSelect.forEach(function (item) {
      // 过滤掉长或宽超出原图的水印图
      var disabled = item.disabled =
          (data.width && item.width >= data.width) ||
          (data.height && item.height >= data.height);

      if (disabled) {
        item.selected = false;
      } else {
        if (item.selected) {
          selectedFound = true;
        }
      }
    });

    if (!selectedFound) {
      dataSelect[0].selected = true;
    }

    watermarkSelect.render();
  }

};

});
