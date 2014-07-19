define(function(require, exports, module) {

'use strict';

var Select = require('select');

var io = require('common/io');

/**
 * Select
 * 添加异步支持，通过属性配置
 *
 * @class [description]
 * @return {[type]}           [description]
 */
var MySelect = Select.extend({

  defaults: {
    // 请求额外参数
    params: {},
    // 请求地址
    url: null,
    // 有全部选项
    hasOptionAll: true,
    load: function (callback) {
      var self = this;

      io.get(self.option('url'),
        self.option('params'),
        function (data) {
          var values = self.field.val(),
              model,
              key = self.option('key') || {};

          if (this.data.listData === null || this.data === null) {
            model = [];
          } else {
            model = this.data.listData || this.data;
          }
          if (values) {
            values = values.split(self.option('delimiter'));
          }
          self.fire('loadData',model);
          model.forEach(function (item) {
            item.text = '' + item[key.text || 'name'];
            item.value = '' + item[key.value || 'id'];
            if (values && values.indexOf(item.value) !== -1) {
              item.selected = true;
            }
          });

          if (self.option('hasOptionAll')) {
            model.splice(0, 0, {value:'', text: '全部'});
          }

          callback(model);
        });
    }
  },

  setup: function() {
    if (!this.option('url')) {
      this.option('load', null);
    }
    MySelect.superclass.setup.call(this);
  }

});

module.exports = MySelect;

});
