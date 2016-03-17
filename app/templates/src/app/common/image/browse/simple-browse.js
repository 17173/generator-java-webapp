  'use strict';

  var Gallery = require('../../gallery/simple_gallery');
  var $ = require('jquery');

  /**
   * 图集查询
   *
   * @class Browse
   */
  var Browse = Gallery.extend({

    defaults: {
      delegates: {
        'dblclick .thumbnail': 'preview',
        'change [name=min]': function(e) {
          var target = e.currentTarget,
            value = +target.value,
            maxValue = +target.form.elements.max.value;
          if (maxValue && value > maxValue) {
            target.value = maxValue;
          }
        },
        'change [name=max]': function(e) {
          var target = e.currentTarget,
            value = +target.value,
            minValue = +target.form.elements.min.value;
          if (minValue && value < minValue) {
            target.value = minValue;
          }
        }
      },
      formCfg: {
        data: {
          groups: [
          {
            colspan: null,
            value: '<i class="fa "></i> 场馆图片',
            attrs: {
              type: 'button'
            }
          }]
        }
      },
      // 显示字段更改
      keyMaps: {
        // title: 'title',
        // url: 'url',
        // createTime: 'createDate'
      },
      thumbAffix: '!a-1-160x120.jpg'
    },

    preview: function(e) {
      window.open(e.currentTarget.dataset.url + '?=' + (new Date().getTime()), '', '');
    }

  });

  module.exports = Browse;

