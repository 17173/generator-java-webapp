define(function(require, exports, module) {
  var $ = require('$');
  var Confirm = require('confirm');

  var config = require('../config');
  var io = require('../io');
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
      // element: '#J_Search',
      gridCfg: {
        pageSize: 20,
        tableClass: 'table table-striped table-hover',
        templates: {
          buttonBarTemplate: buttonBarTemplate,
          emptyTemplate: '<p class="text-warning">抱歉，没有找到符合条件的信息。请重新搜索或者查看全部信息！</p>'
        },
        sortOrder: 'desc',
        cellTemplates: null,
        columnKeys: null,
        columnNames: null
      },
      gridElement: null,
      // handlebars helpers
      gridHelpers: {
        
      }
    },

    refresh: function() {
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
      var gridCfg = this.option('gridCfg');
      var $form = this.$('form');
      var url = config.getUrl(this.option('url'));
      gridCfg.dataUrl = this.url = url;
      gridCfg.postDataFunction = this.postData.bind(this);
      gridCfg.pageRenderedEvent = this.pageRenderedEvent.bind(this);
      gridCfg.checkTemplate = gridCfg.checkTemplate || '<input type="checkbox" class="checkbox" value="{{' + this.option('delKey') + '}}">';
      this.gridElement.simplePagingGrid(gridCfg);
    },

    /**
     * 获取已选中的数据
     *
     *
     * @return {[type]} [description]
     */
    getCheckedData: function() {
      var api = this.gridElement.data('plugin_simplePagingGrid');
      return api.getCheckedData();
    },

    pageRenderedEvent: function() {
      var api = this.gridElement.data('plugin_simplePagingGrid');
      if (api._pageData.length) {
        this.createPageSizeHtml();
      }
      this.createButtons();
      this.fire('pageRendered');
    },

    /**
     * 创建底部按钮组
     * @return {[type]} [description]
     */
    createButtons: function() {
      var template = require('./btngroup.handlebars');
      var html = template({buttons:this.option('buttons')});
      this.role('gridBar').html(html);
    }

  });

  return Search;

  // TODO 表单改为可用 js 配置的
});
