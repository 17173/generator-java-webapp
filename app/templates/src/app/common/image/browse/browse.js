  'use strict';

  var Gallery = require('../../gallery/gallery');

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
          groups: [{
            colspan: null,
            attrs: {
              type: 'select',
              name: 'userUploaded'
            },
            options: [{
              value: 'true',
              text: '我上传的',
              selected: true
            }, {
              value: 'false',
              text: '全部'
            }]
          }, {
            // label: '图片名称',
            colspan: null,
            attrs: {
              type: 'text',
              name: 'name',
              size: 11,
              maxlength: 20,
              placeholder: '图片名称'
            }
          }, {
            colspan: null,
            attrs: {
              type: 'select',
              name: 'type'
            },
            options: [{
              value: '1',
              text: '宽',
              selected: true
            }, {
              value: '2',
              text: '高'
            }]
          }, {
            colspan: null,
            attrs: {
              type: 'text',
              name: 'min',
              size: 3,
              maxlength: 4,
              digits: 'digits',
              min: 0,
              max: 3000,
              placeholder: '最小'
            }
          }, {
            colspan: null,
            value: '-',
            attrs: {
              type: 'static'
            }
          }, {
            colspan: null,
            attrs: {
              type: 'text',
              name: 'max',
              size: 3,
              maxlength: 4,
              digits: 'digits',
              min: 0,
              max: 3000,
              placeholder: '最大'
            }
          }, {
            colspan: null,
            value: '<i class="fa fa-search"></i> 搜索',
            attrs: {
              type: 'submit'
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

