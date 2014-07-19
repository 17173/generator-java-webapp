define(function (require, exports, module) {

'use strict';

var Confirm = require('confirm');

var Search = require('common/search/search');

var AddForm = require('component/instance/list/addform');

var DataSelect = Confirm.extend({

  defaults: {
    content: require('./form.tpl'),
    css: {
      position: 'absolute',
      width: 640
    },
    events: {
      render: function () {
        this.initSearch();
      },
      submit: function () {
        var search = this.search;

        if (search.selectedRow) {
          this.fire('select', search.currentPageData(search.selectedRow.rowIndex - 1));
        }

      }
    },
    title: '插入自定义组件'
  },

  initSearch: function () {
    var self = this;

    self.search = new Search({
      delegates: {
        'click tbody > tr': function (e) {
          if (this.selectedRow) {
            this.selectedRow.classList.remove('warning');
          }

          e.currentTarget.classList.add('warning');
          this.selectedRow = e.currentTarget;
        },
        'click [data-role=add]': function () {
          new AddForm({
            //dataType: 'html',
            typeList : ['html','gallery'],
            defaultSelect : 'html',
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
        // hasCheckbox: true,
        columnNames: ['组件名称', '创建者', '创建时间'],
        columnKeys: ['componentName', 'createUser', 'createTime'],
        cellTemplates: [null, null, '{{fdate createTime}}']
      },
      url: 'componentList'
    });
  },

  destroy: function () {
    this.search && this.search.destroy();

    DataSelect.superclass.destroy.apply(this);
  }

});

module.exports = DataSelect;

});
