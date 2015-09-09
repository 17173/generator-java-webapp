define(function(require, exports, module) {

  'use strict';

  var Widget = require('widget'),
    io = require('../../common/io'),
    $ = require('$');

  var Selectors = Widget.extend({
    defaults: {
      field: '',
      url: '',
      label: 'name',
      value: 'id',
      decollator: ',',
      values : null, //数组形式的值
      parameter: {},
      template: require('./selectors.handlebars'),
      insert: function() {
        this.field.before(this.element);
      },
      delegates: {
        'click [data-role=checkall]': function(e) {
          this.checkall = !this.checkall;
          this.$('input[type=checkbox]').prop('checked', this.checkall);
          this.updateValue();
          this.updateStatus();
        },
        'change input[type=checkbox]': function() {
          this.updateValue();
          this.updateStatus();
        }
      }
    },

    setup: function() {
      var self = this;
      var field = self.option('field');
      var url = self.option('url');
      var parameter = self.option('parameter');
      var values;

      if (!field) {
        throw new Error('请设置 field');
      }
      // TODO 去掉 $ 包装，防止多个 name 值的情况
      self.field = typeof field === 'string' ? $(field).hide() : field.hide();
      self.decollator = self.option('decollator');
      self.checkall = false;
      values = self.option('values') || self.field.val().split(self.decollator);

      function toViewData(listData) {
        var viewData = [];
        listData.forEach(function(item) {
          var value = '' + item[self.option('value')];
          viewData.push({
            label: item[self.option('label')],
            value: value,
            checked: values.indexOf(value) != -1
          });
        });
        self.data('listData', viewData);
        self.render();
        self.updateStatus();
      }

      if (url) {
        io.get(url, parameter, function() {
          var listData = this.data.listData || this.data;
          toViewData(listData);
        });
      } else {
        var listData = self.data('listData') || [];
        toViewData(listData);
      }
    },

    updateValue: function() {
      var values = [];
      this.$('input:checked').each(function() {
        values.push(this.value);
      });
      this.field.val(values.join(this.decollator));
    },

    updateStatus: function() {
      var button = this.role('checkall');
      var text = button.find('span');
      var icon = button.find('i');
      var checkall = this.checkall = this.$('input:checked').length == this.$('input').length;
      icon.removeClass();
      if (checkall) {
        text.text('全清');
        icon.addClass('fa fa-check-square-o');
      } else {
        text.text('全选');
        icon.addClass('fa fa-square-o');
      }
    }

  });

  module.exports = Selectors;

});
