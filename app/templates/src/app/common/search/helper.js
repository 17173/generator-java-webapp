  'use strict';

  /**
   * 查询额外按钮操作
   */

  module.exports = {
    // 进入
    enter: function(e) {
      var dataset = e.currentTarget.dataset;

      this.curParentId = dataset.id;
      this.setParam('parentId', dataset.id);
      this.setParam('siblingId', '');
      this.fire('enter', dataset);
      this.updateList();
    },
    // 返回根目录
    root: function(e) {
      this.setParam('parentId', 0);
      this.setParam('siblingId', '');
      this.fire('root');
      this.updateList();
    },

    // 返回上一级目录
    prev: function(e) {
      this.setParam('siblingId', this.curParentId);
      this.setParam('parentId', '');
      this.fire('prev');
      this.updateList();
    },

    updateList: function() {
      this.setParam('pageNo', 1);
      this.refresh();
    }
  };
