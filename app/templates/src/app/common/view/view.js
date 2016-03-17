  'use strict';

  /**
   * 弹出框 查看单条数据信息
   */

  var Confirm = require('pandora-confirm');

  var io = require('../../common/io');
  var util = require('../../common/util');

  var View = module.exports = Confirm.extend({
    defaults: {
      title: '查看',
      data: {
        submit: '<span class="btn btn-primary">返回</span>',
        cancel: null
      },
      css: {
        width: 800
      },

      viewOptions: {
        url: null,
        /**
         * 数据配置
         * @example {[type]}
         *
         *
         */
        fields: null,
        template: require('./view.handlebars')
      }
    },
    setup: function() {
      View.superclass.setup.call(this);

      var self = this;
      var url = this.option('viewOptions/url');
      var params = this.option('viewOptions/params') || {};
      var fields = this.option('viewOptions/fields');

      if (!url) {
        throw new Error('viewOptions/url is invalid!');
      }

      if (!fields) {
        throw new Error('viewOptions/fields is invalid!');
      }

      io.get(url, params, function() {
        var template = self.option('viewOptions/template'),
          views = [],
          data = this.data;

        if (Array.isArray(fields)) {
          fields.forEach(function(item) {
            var value = data[item.name];
            if (typeof value !== 'undefined') {
              value = util.escape(value + '').replace(/\n/g, '<br/>');
              views.push({
                label: item.label,
                name: item.name,
                value: item.renderer ? item.renderer(value, self) : value
              });
            }

          });
          self.role('content').html(template({
            views: views
          }));
        }
      });
    }

  });


