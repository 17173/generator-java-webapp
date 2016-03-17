  // TODO: grid 模块独立文件

  'use strict';

  var io = require('../io'),
    Search = require('../search/core');

  /**
   * 图集查询
   *
   * @class Gallery
   */
  var Gallery = Search.extend({

    defaults: {
      classPrefix: 'ue-gallery',
      // 显示字段更改
      // keyMaps: { },
      delegates: {
        'click .first': 'goFirst',
        'click .last': 'goLast',
        'click .previous': 'goPrev',
        'click .next': 'goNext',
        'click .thumbnail': 'select',
        'click .pagination [data-index]': 'switchTo'
      },
      pageSize: 100,
      pageNo: 1,
      numberOfPageLinks: 10,
      selectable: 'single',
      gridTemplate: require('./gallery.handlebars'),
      gridTemplateOptions: {
        partials: {
          pagination: require('./pagination.handlebars')
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
        self.fire('diselect', self.getDataByIndex(e.currentTarget.dataset.index));
      } else {
        classList.add('selected');
        if (selectable === 'single') {
          this.$(e.currentTarget).siblings('.selected').removeClass('selected');
        }
        self.fire('select', self.getDataByIndex(e.currentTarget.dataset.index));
      }
    },

    // 回首页
    goFirst: function(e) {
      if (e.currentTarget.classList.contains('disabled')) {
        return false;
      }

      this.setPageNo(1);
      this.goPage();

      return false;
    },

    // 回末页
    goLast: function(e) {
      if (e.currentTarget.classList.contains('disabled')) {
        return false;
      }

      this.setPageNo(parseInt(e.currentTarget.dataset.value, 10));
      this.goPage();

      return false;
    },

    // 上一页
    goPrev: function(e) {
      var pageNo = this.getPageNo();

      if (e.currentTarget.classList.contains('disabled')) {
        return false;
      }

      if (pageNo > 1) {
        this.setPageNo(--pageNo);
      }

      this.goPage();

      return false;
    },

    // 下一页
    goNext: function(e) {
      var pageNo = this.getPageNo();
      var totalPage = getTotalPages(this.totalCount, this.option('pageSize'));

      if (e.currentTarget.classList.contains('disabled')) {
        return false;
      }

      if (pageNo < totalPage) {
        this.setPageNo(++pageNo);
      }

      this.goPage();

      return false;
    },

    switchTo: function(e) {
      var target = e.currentTarget;

      if (!target.classList.contains('active')) {
        this.setPageNo(parseInt(target.dataset.index, 10));
        this.goPage();
      }

      return false;
    },

    goPage: function() {
      var form = this.form;

      if (form) {
        form.submit();
      } else {
        this.renderGrid();
      }
    },

    /**
     * 刷新表格
     *
     * @method refresh
     * @return {[type]} [description]
     */
    refresh: function() {
      this.renderGrid();
    },

    setPageNo: function(val) {
      return this.form ?
        this.form.name('pageNo').val(val) :
        this.option('pageNo', val);
    },

    getPageNo: function() {
      return this.form ?
        parseInt(this.form.name('pageNo').val(), 10) :
        parseInt(this.option('pageNo'), 10);
    },

    renderGrid: function() {
      if (typeof this.option('gridTemplate') !== 'function') {
        return;
      }
      var self = this,
        param = self.postData();

      param.pageNo = self.getPageNo();
      param.pageSize = self.option('pageSize');
      param._ = new Date().getTime();

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

    getSelectedData: function() {
      var self = this,
        data = [];

      this.$('.thumbnail.selected').each(function() {
        data.push(self.getDataByIndex(this.dataset.index));
      });

      return data;
    },

    template: function(data) {
      var keyMaps = this.option('keyMaps');

      data.listData.forEach(function(n) {
        var p, match;

        for (p in keyMaps) {
          n[p] || (n[p] = n[keyMaps[p]]);
        }

        // 修复魔图未提供图片类型
        // TODO: 业务与基础耦合，需要剥离
        if (!n.type && n.remotePath) {
          match = n.remotePath.match(/^.+\.(jpg|png|gif|bmp)$/);
          n.type = match ? match[1] : 'unknown';
        }
      });

      return this.option('gridTemplate')({
        selectable: this.option('selectable'),
        buttons: this.option('buttons'),
        thumbAffix: this.option('thumbAffix'),
        gallery: data.listData,
        pagination: this.getPagination(data)
      }, this.option('gridTemplateOptions'));
    },

    /**
     * 获取分页模型数据
     *
     * @method getPagination
     * @param  {[type]} data [description]
     * @return {[type]}      [description]
     */
    getPagination: function(data) {
      var pageNo = this.getPageNo();
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
        visible: totalPages > 1,
        first: pageNo == 1,
        pagers: pagers,
        totalPages: totalPages,
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
      var pageNo = this.getPageNo();
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

  module.exports = Gallery;

  function getTotalPages(totalCount, pageSize) {
    return parseInt((totalCount + pageSize - 1) / pageSize, 10);
  }

