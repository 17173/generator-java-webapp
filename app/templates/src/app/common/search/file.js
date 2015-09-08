define(function(require, exports, module) {

  'use strict';

  /**
   * 文件查询
   */

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
        'click [data-role=uploadFile]': 'uploadFile'
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
});
