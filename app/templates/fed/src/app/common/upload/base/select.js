define(function (require, exports, module) {

/**
 * 文件上传，HTML5 ONLY
 *
 * @module Upload
 */

'use strict';

var Widget = require('widget');

/**
 * Select
 *
 * @class Select
 * @constructor
 */
var Select = Widget.extend({

  type: 'Select',

  defaults: {
    // 默认允许上传所有格式的文件
    accept: '*/*',
    // 样式前缀
    classPrefix: 'select',
    // 事件代理
    delegates: {
      'change': 'change'
    },
    element: '<form></form>',
    label: '选择',
    // 1M
    maxSize: 1 * 1024 * 1024,
    multiple: true,
    // 模板
    template: require('./select.handlebars')
  },

  setup: function () {
    // 设置模板数据
    this.data({
      accept: this.option('accept'),
      label: this.option('label'),
      multiple: this.option('multiple')
    });

    this.render();

    this.initCfg();
  },

  initCfg: function () {
    // 文件框
    this.field = this.$('input');

    // accept
    this.accept = this.option('accept')
      .replace(/\*/g, '').toLowerCase().split(',')
      .map(function (item) {
        item = item.trim().split(/[\/\.]/);
        (item[1] === 'jpg') && (item[1] = 'jpeg');
        return item;
      });

    // max size
    this.maxSize = this.option('maxSize');
  },

  // 设置上传队列
  change: function () {
    var self = this,
      files = self.field.prop('files');

    if (files.length === 0) {
      return;
    }

    Array.prototype.forEach.call(files, function (file) {
      if (!isTypeValid(file, self.accept)) {
        // 通知文件类型不合要求
        self.fire('error', Select.TYPE_INVALID, file);
      } else if (!isSizeValid(file, self.maxSize)) {
        // 通知文件尺寸不合要求
        self.fire('error', Select.SIZE_EXCEED, file);
      } else {
        if (self.fire('change', file) === false) {
          self.fire('error', '', file);
        } else {
          self.fire('valid', file);
        }
      }
    });

    // 重置
    self.field.val('');
  },

  enable: function (enabled) {
    this.$('label').attr('disabled', !enabled);
  }

});

function getFileType (file) {
  var type = file.type, index;

  if (!type && (index = file.name.lastIndexOf('.')) !== -1) {
    type = file.name.substring(index + 1).toLowerCase();
  }

  return type;
}

function isTypeValid (file, accept) {
  var type, isValid = false;

  if (!(accept[0][0] || accept[0][1])) {
    return true;
  }

  if ((type = getFileType(file))) {
    type = type.split(/[\.\/]/);
    accept.forEach(function (accept) {
      if ((!type[0] || !accept[0] || type[0] === accept[0]) &&
          (!type[1] || !accept[1] || type[1] === accept[1])) {
        isValid = true;
        return false;
      }
    });
  }

  return isValid;
}

function isSizeValid (file, maxSize) {
  return file.size && file.size <= maxSize;
}

Select.TYPE_INVALID = 1;
Select.SIZE_EXCEED = 2;

module.exports = Select;

});
