define(function (require, exports, module) {

/**
 * 文件上传，HTML5 ONLY
 *
 * @module Upload
 */

'use strict';

var Widget = require('widget');

/**
 * Button
 *
 * @class Button
 * @constructor
 */
var Button = Widget.extend({

  type: 'Button',

  defaults: {
    // 样式前缀
    classPrefix: 'btn btn-default',
    data: {
      icon: 'upload',
      label: '确定上传'
    },
    disabled: true,
    element: '<button></button>',
    // 模板
    template: require('./button.handlebars')
  },

  setup: function () {
    this.render();
    this.enable(!this.option('disabled'));
  },

  enable: function (enabled) {
    this.element.attr('disabled', !enabled);
  }

});

module.exports = Button;

});
