define(function (require, exports, module) {

/**
 * 魔图图片处理
 *
 * @module magickimg
 */

'use strict';

var Widget = require('widget'),
    Select = require('select');

var io = require('../io'),
    Tags = require('../tags/tags');

var filter = require('./filter');

var cachedWatermarkList;

function getDataFromNewWidth(toWidth, filterData) {
  var data;

  if (toWidth) {
    data = {
      width: toWidth,
      height: (filterData.height / filterData.width) * toWidth
    };
  } else {
    data = {
      width: filterData.width,
      height: filterData.height
    };
  }

  return data;
}

/**
 * Setting
 *
 * @class Setting
 * @constructor
 */
var Setting = Widget.extend({

  mixins: [filter],

  defaults: {
    classPrefix: 'setting',
    // 显示水印
    hasWatermark: true,
    defaultWidth : 0, //480
    delegates: {
      'change': 'change'
    },
    element: '<form></form>',
    template: require('./setting.handlebars')
  },

  setup: function () {
    var self = this;

    self.data('hasWatermark', self.option('hasWatermark'));
    self.data('hasLink', self.option('hasLink'));
    self.data('simplex', self.option('simplex'));

    self.filterData = self.option('filterData');

    if (this.option('hasWatermark')) {
      this.renderWatermark();
    } else {
      this.render();
      this.initTag();
    }

  },

  initTag: function() {
    var tagField = this.$('[name=tags]');
    if (tagField.length && !tagField.prop('readonly')) {
      new Tags({
        field: tagField
      });
    }
  },

  renderWatermark: function() {
    var self = this;
    function render () {
      var widthDom ;
      self.render();
      widthDom = self.$('[name=width]').val(self.option('defaultWidth'));
      self.widthSelect = new Select({
        field: widthDom,
        hasOptionAll: false,
        minWidth: 30,
        events: {
          change: function () {
            self.filterWatermark(self.watermarkSelect,
                getDataFromNewWidth(+this.value, self.filterData));
          }
        }
      });

      self.gravitySelect = new Select({
        field: self.$('[name=gravity]'),
        hasOptionAll: false
      });

      self.watermarkSelect = new Select({
        field: self.$('[name=watermark]'),
        hasOptionAll: false,
        minWidth: 180,
        maxWidth: 180,
        model: cachedWatermarkList
      });

      // 过滤不符合条件的宽度选项与水印选项
      self.filter();

      self.initTag();
    }

    if (cachedWatermarkList) {
      render();
      return;
    }

    io.get('watermarkList', {
      userUploaded: false,
      pageSize: 1000
    }, function () {
      var model = this.data || this.data.listData;

      model.unshift({
        name: '无',
        remotePath: '',
        selected: true
      });

      model.forEach(function (item) {
        item.value = item.remotePath;
        item.text = item.name;
      });

      cachedWatermarkList = model;

      render();
    });
  },

  filter: function (data) {
    var self = this;

    if (data) {
      self.filterData = data;
    } else {
      data = self.filterData;
    }

    if (data && self.option('hasWatermark')) {
      self.filterWidth(self.widthSelect, data);
      self.filterWatermark(self.watermarkSelect,
          getDataFromNewWidth(+self.widthSelect.value, data));
    }
  },

  change: function () {
    this.fire('change', this.get());
  },

  get: function () {
    var settings = {};

    this.$('[name]').each(function (i, item) {
      settings[item.name] =
        (item.type === 'checkbox') ? item.checked : item.value;
    });

    return settings;
  },

  set: function (settings) {
    var self = this,
        name, item;

    self.element[0].reset();

    for (name in settings) {
      item = self.$('[name=' + name + ']');
      if (item.prop('type') === 'checkbox') {
        item.prop('checked', settings[name] || self.data(name));
      } else {
        item.val(settings[name] || self.data(name));
      }
    }

    return self;
  }

});

module.exports = Setting;

});
