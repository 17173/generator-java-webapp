define(function(require, exports, module) {

  'use strict';

  var Select = require('select');

  var io = require('../io');
  var util = require('../util');

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
      load: function(callback) {
        var self = this;
        var params = self.option('params');
        var pageSize = self.option('pageSize') || 1000;

        pageSize && util.mixin(params, {pageSize: pageSize});

        io.get(self.option('url'), params, function(data) {
          var model;

          if (this.data === null) {
            model = [];
          } else if (Array.isArray(this.data)) {
            model = this.data;
          } else if (this.data.listData) {
            model = this.data.listData || [];
          }

          model = self.transformModel(model);

          callback(model);
        });
      }
    },

    setup: function() {
      if (!this.option('url')) {
        this.option('load', null);
      }

      MySelect.superclass.setup.call(this);
    },

    // 转换 model
    transformModel: function(model) {
      var key = this.option('key') || {};

      model.forEach(function(item) {
        item.text = '' + item[key.text || 'name'];
        item.value = '' + item[key.value || 'id'];
      });
      return model;
    }

  });

  module.exports = MySelect;

});
