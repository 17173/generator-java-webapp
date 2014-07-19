define(function(require, exports, module) {

'use strict';

var Confirm = require('confirm');

var Panel = require('common/panel/panel'),
    Search = require('common/search/search');

var AddForm = require('component/instance/list/addform');

var Grid = require('./grid');

var DataSelect = Confirm.extend({

  defaults: {
    content: '<div data-role="search-form">' +
      '<form class="form-inline" role="form">' +
        ' <input type="hidden" value="gallery" name="dataType">' +
        ' <input type="text" size="11" class="form-control" name="componentName" placeholder="组件名称">' +
        ' <button type="submit" class="btn btn-default"><i class="fa fa-search"></i> 搜索</button>' +
        ' <button type="button" class="btn btn-default pull-right" data-role="add"><i class="fa fa-plus"></i> 新建</button>' +
      '</form>' +
    '</div>',
    css: {
      position: 'absolute',
      width: 640
    },
    events: {
      render: function () {
        this.initSearch();
        this.initSelect();
      },
      submit: function () {
        this.fire('select', this.grid.getData());
      }
    },
    title: '插入组图'
  },

  initSearch: function () {
    var self = this;

    self.search = new Search({
      delegates: {
        'click [data-role=add]': function () {
          new AddForm({
            dataType: 'gallery',
            events : {
              done: function () {
                self.search.refresh();
              }
            },
            url: 'componentAdd'
          });
        }
      },
      delKey: 'componentId',
      element: self.role('search-form'),
      gridCfg: {
        hasCheckbox: true,
        columnNames: ['组件名称', '创建者', '创建时间'],
        columnKeys: ['componentName', 'createUser', 'createTime'],
        cellTemplates: [null, null, '{{fdate createTime}}'],
        onCheck: function (data, checked) {
          checked ? self.grid.append(data) : self.grid.remove(data);
        },
        onCheckAll: function (datas, checked) {
          datas.forEach(function (data) {
            checked ? self.grid.append(data) : self.grid.remove(data);
          });
        }
      },
      url: 'componentList'
    });
  },


  initSelect: function () {
    var self = this;

    self.grid = new Grid({
      events: {
        remove: function (e, id) {
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

  destroy: function () {
    this.search && this.search.destroy();
    this.grid && this.grid.destroy();
    this.panel && this.panel.destroy();

    DataSelect.superclass.destroy.apply(this);
  }

});

module.exports = DataSelect;

});
