define(function(require, exports, module) {

'use strict';

var $ = require('$');

var io = require('common/io');
var SearchCore = require('common/search/core');

/**
 * 图集查询
 *
 * @class Browse
 * @param  {[type]} )
 * @return {[type]}   [description]
 */
var Browse = SearchCore.extend({
  defaults: {
    classPrefix: 'ue-gallery',
    // 显示字段更改
    key: {
      // title: 'title',
      // url: 'url',
      // id: 'id'
    },
    delegates: {
      'click .thumbnail': 'select',
      'dblclick .thumbnail': 'preview',
      'click .previous': 'prev',
      'click .next': 'next',
      'click .pagination [data-index]': 'switchTo'
    },
    pageSize: 100,
    pageNo: 1,
    numberOfPageLinks: 10,
    selectable: 'single',
    // selects: {
    //   enable: false,
    //   multiple: false,
    //   selectName: 'gallery-select',
    //   selectLabel: '选择'
    // },
    // buttons: [
    //   {
    //     text: '选择',
    //     role: 'select'
    //   }
    // ],
    gridHelpers: {
      timestamp: function (val, affix) {
        return affix ? val : (val + '?' + new Date().getTime());
      }
    },
    gridTemplate: require('./browse.handlebars'),
    gridTemplateOptions: {
      partials: {
        pagemodel: require('./pagemodel.handlebars')
      }
    }
  },

  select: function(e) {
    var self = this,
        selectable = self.option('selectable'),
        classList;

    if (!selectable) {
      return;
    }

    classList = e.currentTarget.classList;
    if (classList.contains('selected')) {
      // if (selectable !== 'single') {
        classList.remove('selected');
      // }
      self.fire('diselect');
    } else {
      classList.add('selected');
      if (selectable === 'single') {
        $(e.currentTarget).siblings('.selected').removeClass('selected');
      }
      self.fire('select', self.getDataByIndex(e.currentTarget.dataset.index));
    }
  },

  preview: function(e) {
    window.open(e.currentTarget.dataset.url, '', '');
  },

  prev: function(e) {
    var pageNo = this.option('pageNo');

    if (e.currentTarget.classList.contains('disabled')) {
      return false;
    }

    if (pageNo > 1) {
      pageNo--;
      this.option('pageNo', pageNo);
    }

    this.renderGrid();

    return false;
  },

  next: function(e) {
    var pageNo = this.option('pageNo');
    var totalPage = getTotalPages(this.totalCount, this.option('pageSize'));

    if (e.currentTarget.classList.contains('disabled')) {
      return false;
    }

    if (pageNo < totalPage) {
      pageNo++;
      this.option('pageNo', pageNo);
    }

    this.renderGrid();

    return false;
  },

  switchTo: function(e) {
    var target = e.currentTarget;

    if (!target.classList.contains('active')) {
      this.option('pageNo', target.dataset.index);
      this.renderGrid();
    }

    return false;
  },

  /**
   * 刷新表格
   *
   * @method refresh
   * @return {[type]} [description]
   */
  refresh: function() {
    this.option('pageNo', 1);
    this.renderGrid();
  },

  renderGrid: function() {
    if (typeof this.option('gridTemplate') !== 'function') {
      return;
    }

    var self = this;
    var param = self.getParams();

    param.pageNo = self.option('pageNo');
    param.pageSize = self.option('pageSize');

    io.get(self.option('url'), param, function() {
      var data = this.data;

      self.totalCount = data.totalCount;
      self.listData = data.listData;

      self.gridElement.html(self.template(data));

      self.fire('load');
    });
  },

  /**
   * 根据索引获取数据
   *
   *
   * @param  {[type]} index [description]
   * @return {[type]}       [description]
   */
  getDataByIndex: function(index) {
    return this.listData ? this.listData[index] : {};
  },

  getSelectedData: function () {
    var self = this,
        data = [];

    this.$('.thumbnail.selected').each(function () {
      data.push(self.getDataByIndex(this.dataset.index));
    });

    return data;
  },

  template: function (data) {
    var key = this.option('key');

    data.listData.forEach(function (n) {
      var p, match;

      for (p in key) {
        n[p] || (n[p] = n[key[p]]);
      }

      // 修复魔图未提供图片类型
      if (!n.type && n.remotePath) {
        match = n.remotePath.match(/^.+\.(jpg|png|gif)$/);
        n.type = match ? match[1] : 'unknown';
      }
    });

    return this.option('gridTemplate')({
      selectable: this.option('selectable'),
      buttons: this.option('buttons'),
      thumbAffix: this.option('thumbAffix'),
      gallery: data.listData,
      pageModel: this.getPageModel(data)
    }, this.option('gridTemplateOptions'));
  },

  /**
   * 获取分页模型数据
   *
   * @method getPageModel
   * @param  {[type]} data [description]
   * @return {[type]}      [description]
   */
  getPageModel: function(data) {
    var pageNo = this.option('pageNo');
    var totalCount = data.totalCount;
    var totalPages = getTotalPages(totalCount, this.option('pageSize'));
    var pagers = [];
    var pageRange = this.getPageRange(totalPages);

    for (var i = pageRange.firstPage; i <= pageRange.lastPage; i++) {
      var active = pageNo == i;
      pagers.push({
        number: i,
        active: active
      });
    }

    return {
      first: pageNo == 1,
      pagers: pagers,
      last: pageNo == totalPages
    };
  },

  /**
   * 获取分页数范围
   *
   * @method getPageRange
   * @param  {[type]} totalPages [description]
   * @return {[type]}            [description]
   */
  getPageRange: function(totalPages) {
    var firstPage;
    var lastPage;
    var pageNo = this.option('pageNo');
    var numberOfPageLinks = this.option('numberOfPageLinks');
    firstPage = pageNo + 1 - numberOfPageLinks / 2;
    if (firstPage < 1) {
      firstPage = 1;
      lastPage = numberOfPageLinks;
      if (lastPage > totalPages) {
        lastPage = totalPages;
      }
    } else {
      lastPage = pageNo + 1 + numberOfPageLinks / 2 - 1;
      if (lastPage > totalPages) {
        lastPage = totalPages;
        firstPage = lastPage - numberOfPageLinks + 1;
        if (firstPage < 1) {
          firstPage = 1;
        }
      }
    }
    return {
      firstPage: firstPage,
      lastPage: lastPage
    };
  }

});

module.exports = Browse;

function getTotalPages (totalCount, pageSize) {
  return parseInt((totalCount + pageSize - 1) / pageSize, 10);
}

});
