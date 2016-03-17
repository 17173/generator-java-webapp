  'use strict';

  /**
   * 文件查询
   */

  var $ = require('jquery');

  var io = require('../io');
  var SearchCore = require('./core');

  var noop = function() {};

  var FileSearch = SearchCore.extend({
    mixins: [require('./helper')],
    defaults: {
      tableTemplate: null,

      delegates: {
        // 查看
        'click [data-role=view]': 'view',
        'click [data-role=edit]': 'edit',
        'click [data-role=addFolder]': 'addFolder',
        'click [data-role=uploadFile]': 'uploadFile',
        'click [data-column]': 'setSort'
      }
    },

    view: noop,
    edit: noop,
    /**
     * 创建文件夹
     *
     * @method addFolder
     */
    addFolder: noop,
    uploadFile: noop,

    refresh: function() {
      this.renderGrid();
    },

    // 设置排序
    setSort: function(e) {
      var $target = $(e.currentTarget);

      this.setParam('sortColumn', $target.data('column'));
      this.setParam('sortOrder', this.getParam('sortOrder') === 'asc' ? 'desc' : 'asc');
      this.cellIndex = $target.closest('th').index() + 1;
      this.refresh();
    },

    renderGrid: function() {
      var template = this.option('tableTemplate');

      if (typeof template != 'function') {
        return;
      }
      var self = this;

      io.get(this.option('url'), this.disposeParam(), function() {
        var data = self.disposeData(this.data);
        var html = self.template(data);
        self.gridElement.html(html);

        if (self.cellIndex) {
          var $asc = self.$('.sort-ascending').eq([self.cellIndex -1]);
          var $desc = self.$('.sort-descending').eq([self.cellIndex -1]);
          if (self.getParam('sortOrder') === 'asc') {
            $asc.addClass('active');
            $desc.removeClass('active');
          } else {
            $asc.removeClass('active');
            $desc.addClass('active');
          }
          self.sortTarget = null;
        }

        self.fire('load', this.data);
      });
    },

    disposeParam: function() {
      return this.getParams();
    },

    /**
     * 处理文件列表数据
     *
     * @param  {[type]} data [description]
     * @return {[type]}      [description]
     */
    disposeData: function(data) {
      return data ? data.listData || data : [];
    },

    template: function(data) {
      var template = this.option('tableTemplate');

      var html = template({
        listData: data
      });

      return html;
    }

    // TODO 进度条的显示
    // TODO 文件上传 可以不去判断同名，同名的话直接后面加个 (N),或提示重名会进行覆盖
    // TODO 根据不同文件格式 显示相应的图标
  });

  module.exports = FileSearch;
