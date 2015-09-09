define(function(require, exports, module) {

  'use strict';

  var Confirm = require('confirm');

  var Panel = require('../../../panel/panel'),
    Search = require('../../../search/search');

  var Grid = require('./grid');

  var DataSelect = Confirm.extend({

    defaults: {
      css: {
        position: 'absolute',
        width: 640
      },
      events: {
        render: function() {
          this.initSearch();
          this.initSelect();
        },
        submit: function() {
          this.fire('select', this.grid.getData());
        }
      },
      title: '插入组图'
    },

    initSearch: function() {
      var self = this;

      self.search = new Search({
        formCfg: {
          // 隐藏域
          hiddens: {
            channelId: window.USER_DATA.CHANNEL_ID,
            dataType: 'gallery'
          },
          buttons: [{
            colspan: null,
            'class': 'pull-right',
            value: '<i class="fa fa-plus"></i> 新建组件',
            attrs: {
              type: 'button',
              'data-role': 'add'
            }
          }],
          data: {
            groups: [{
              // label: '组件名称',
              colspan: null,
              attrs: {
                type: 'text',
                name: 'componentName',
                size: 11,
                maxlength: 50,
                placeholder: '组件名称'
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
        keepHistory: false,
        delegates: {
          'click [data-role=add]': function() {

          }
        },
        element: self.role('content'),
        gridCfg: {
          hasCheckbox: true,
          columnNames: ['组件名称', '创建者', '创建时间'],
          columnKeys: ['componentName', 'createUserName', 'createTime'],
          cellTemplates: [null, null, '{{dateFormat createTime "yyyy-MM-dd"}}'],
          onCheck: function(data, checked) {
            checked ? self.grid.append(data) : self.grid.remove(data);
          },
          onCheckAll: function(datas, checked) {
            datas.forEach(function(data) {
              checked ? self.grid.append(data) : self.grid.remove(data);
            });
          }
        },
        url: 'componentList'
      });
    },


    initSelect: function() {
      var self = this;

      self.grid = new Grid({
        events: {
          remove: function(e, id) {
            self.search.$('[value="' + id + '"]').prop('checked', false);
          }
        }
      });

      self.panel = new Panel({
        container: self.role('content'),
        children: [self.grid],
        title: '已选择'
      });
    },

    destroy: function() {
      this.search && this.search.destroy();
      this.grid && this.grid.destroy();
      this.panel && this.panel.destroy();

      DataSelect.superclass.destroy.apply(this);
    }

  });

  module.exports = DataSelect;

});
