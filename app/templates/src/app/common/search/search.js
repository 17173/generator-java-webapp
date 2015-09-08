define(function(require, exports, module) {

  'use strict';

  var Alert = require('alert');

  var config = require('../config');

  var Core = require('./core');

  require('bootstrap3-grid');

  var buttonBarTemplate =
      '<div class="grid-foot clearfix">' +
        '<div class="btn-group" data-role="gridBar"></div>' +
        '<ul class="pagination pull-right">'+
          '<li {{#if isFirstPage}}class="disabled"{{/if}}><a href="javascript:;" class="first">&laquo;</a></li>' +
          '<li {{#if isFirstPage}}class="disabled"{{/if}}><a href="javascript:;" class="previous">上一页</a></li>' +
            '{{#if pageNumbersEnabled}}' +
              '{{#each pages}}' +
                '{{#if isCurrentPage}}' +
                  '<li class="active"><a href="javascript:;" class="pagenumber" data-pagenumber="{{pageNumber}}">{{displayPageNumber}}</a></li>' +
                '{{/if}}' +
                '{{#unless isCurrentPage}}' +
                  '<li><a href="javascript:;" class="pagenumber" data-pagenumber="{{pageNumber}}">{{displayPageNumber}}</a></li>' +
                '{{/unless}}' +
              '{{/each}}' +
            '{{/if}}' +
          '<li {{#if isLastPage}}class="disabled"{{/if}}><a href="javascript:;" class="next">下一页</a></li>' +
          '<li {{#if isLastPage}}class="disabled"{{/if}}><a href="javascript:;" class="last">&raquo;</a></li>' +
        '</ul>' +
      '</div>';

  /**
   * 带有分页的表格查询
   *
   * @class Search
   * @param  {[type]} )
   * @return {[type]}   [description]
   */
  var Search = Core.extend({
    defaults: {
      classPrefix: 'ue-datagrid',
      classSelected: 'warning',
      delegates: {
        // 'click tbody > tr': 'selectRow'
      },
      // 表单选项
      formCfg: { },
      // element: '#J_Search',
      gridCfg: {
        pageSize: 20,
        tableClass: 'table table-striped table-hover',
        templates: {
          buttonBarTemplate: buttonBarTemplate,
          sortableHeaderTemplate: '<th width="{{width}}">{{title}}<div class="sort-container pull-right"><span class="fa fa-sort-asc sort sort-ascending"></span><span class="fa fa-sort-desc sort sort-descending"></span></div></th>',
          emptyTemplate: '<p class="text-warning">抱歉，没有找到符合条件的信息。</p>'
        },
        sortOrder: 'desc',
        sortable: [],
        cellTemplates: [],
        columnKeys: [],
        columnWidths: [],
        columnNames: []
      },
      gridElement: null,
      // handlebars helpers
      gridHelpers: {

      },
      // 是否显示授权
      hasAuth: false
    },

    refresh: function () {
      this.gridElement.simplePagingGrid('refresh', this.url);
    },

    /**
     * 获取单前页数据
     *
     * @method currentPageData
     * @return {[type]} [description]
     */
    currentPageData: function(index) {
      var api = this.gridElement.data('plugin_simplePagingGrid');
      return index > -1 ? api._pageData[index] : api._pageData;
    },

    renderGrid: function() {
      var self = this,
          form = self.form,
          gridCfg = self.option('gridCfg'),
          sortableIndex;

      if (form) {
        gridCfg.onSort = function (sortOrder, sortColumn, callback) {
          form.name('sortOrder').val(sortOrder);
          form.name('sortColumn').val(sortColumn);
          callback(this._settings.dataUrl);
          //form.submit();
          // self.refresh();
        };

        gridCfg.onFail = function(msg) {
          if (Array.isArray(msg)) {
            msg = msg[0];
          }
          new Alert({
            content: msg || '抱歉，后端数据出错！'
          });
        };

        gridCfg.onLogin = function(msg) {
          if (Array.isArray(msg)) {
            msg = msg[0];
          }

          new Alert({
            content: msg || 'session过期，请重新登录'
          }).submit(function() {
            var loginUrl = window.USER_DATA.IS_PASSPORT_LOGIN ? '/outlogin.html?' : '/login.html?';
            window.location.href = loginUrl + new Date().getTime();
          });
        };

        gridCfg.onPage = function (pageNo, callback) {
          form.name('pageNo').val(pageNo);
          self.fire('gridOnPage', this);
          callback(this._settings.dataUrl);
          //form.submit();
          // self.refresh(true);
        };

        gridCfg.sortOrder = form.name('sortOrder').val();
        gridCfg.sortColumn = form.name('sortColumn').val();
        gridCfg.pageNo = form.name('pageNo').val();
      }

      gridCfg.dataUrl = self.url = config.getUrl(self.option('url'));
      gridCfg.postDataFunction = self.postData.bind(self);
      gridCfg.pageRenderedEvent = self.pageRenderedEvent.bind(self);
      gridCfg.checkTemplate ||
          (gridCfg.checkTemplate =
              '<input type="checkbox" class="checkbox" value="{{' + self.option('delKey') + '}}">');

      gridCfg.sortable = gridCfg.sortable || [];
      sortableIndex = gridCfg.checkTemplate ? 1 : 0;
      if (gridCfg.columns) {
        gridCfg.columns.forEach(function(col, index) {
          gridCfg.columnKeys[index] = col.key || null;
          gridCfg.columnNames[index] = col.name || null;
          gridCfg.columnWidths[index] = col.width || null;
          gridCfg.cellTemplates[index] = col.template || null;
          if(typeof col.sortable !== 'undefined'){
            gridCfg.sortable[sortableIndex + index] = col.sortable;
          }
        });
      }

      gridCfg.parseData = function(data) {
        if (data && data.listData) {
          data.listData.forEach(function(item, index) {
            item['rowIndex'] = index + 1;
            if (self.option('hasAuth')) {
              item['hasAuth'] = data.authIds ? data.authIds.indexOf(item.id) > -1 : false;
            }
          });
        } else {
          data = {
            listData: [],
            pageNo: 1,
            totalCount: 0
          };
        }
        return data;
      };
      self.fire('gridParseData',gridCfg);
      self.gridElement.simplePagingGrid(gridCfg);
    },

    /**
     * 获取已选中的数据
     *
     * @return {[type]} [description]
     */
    getCheckedData: function() {
      var api = this.gridElement.data('plugin_simplePagingGrid');
      return api.getCheckedData();
    },

    pageRenderedEvent: function() {
      this.createButtons();
      this.fire('pageRendered');
    },

    /**
     * 创建底部按钮组
     * @return {[type]} [description]
     */
    createButtons: function() {
      if (!this.option('gridCfg/hasCheckbox')) {
        return;
      }
      var template = require('./btngroup.handlebars');
      var html = template({buttons:this.option('buttons')});
      this.role('gridBar').html(html);
    }

  });

  return Search;

});
