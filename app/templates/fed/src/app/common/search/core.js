define(function(require, exports, module) {
  var $ = require('$');
  var Widget = require('widget');
  var Handlebars = require('handlebars');
  var moment = require('moment');
  var Confirm = require('confirm');
  var Tips = require('tips');
  var Alert = require('alert');

  // require('daterangepicker.css');
  require('daterangepicker');

  var io = require('../io');
  var FormData = require('../form/data');

  /**
   * 分页查询核心
   *
   * @class Core
   * @param  {[type]} )
   * @return {[type]}   [description]
   */
  var Core = Widget.extend({
    defaults: {
      element: '#J_Search',
      container: null,
      gridElement: null,
      // handlebars helpers
      gridHelpers: {
        fdate: function(createTime) {
          return createTime ? moment(createTime).format('YYYY-MM-DD') : '';
        },
        ellipsis: function(val, size) {
          if (!val) {
            return '';
          } else {
            var len = val.length;
            val = len <= size ? val : val.slice(0, size) + '&hellip;';

            return val;
          }
        }
      },
      // 显示创建时间条件
      showTime: true,
      // 时间显示的位置 left or right
      opens: 'left',
      // 列表请求地址
      url: null,
      // 删除行请求地址
      delUrl: null,
      // 删除时的提示信息
      delMsg: '确定删除？',
      // 删除的请求参数,默认为id
      delKey: 'id',
      // 配置分页显示条数
      createPageSize: false,
      delegates: {
        'click :submit': 'onSearch',
        'click [data-role=del]': 'delRow'
      }
    },

    setup: function() {
      this.render();

      if (!this.option('url')) {
        throw new Error('请设置galleryOption/url');
      }

      this.$('form').addClass('grid-head clearfix');

      this.gridElement = $(this.option('gridElement'));
      if (!this.gridElement.length) {
        this.gridElement = $('<div/>').insertAfter(this.$('form'));
      }
      this.gridElement.addClass('grid-body');

      this.createTime();

      this.initHelper();

      this.renderGrid();
    },

    delRow: function(e) {
      var self = this;

      if (!self.option('delUrl')) {
        throw new Error('please set delUrl!');
      }

      new Confirm({
        content: self.option('delMsg')
      }).submit(function () {
        var param = {};

        param[self.option('delKey')] = e.currentTarget.dataset.id;

        io.post(self.option('delUrl'), param, {
          success: function () {
            new Tips({
              content: '删除成功！'
            }).destroy(function () {
              self.refresh();
            });
          },
          error: function (msg) {
            new Alert({
              title: '错误信息',
              content: msg
            });
          }
        });
      });
    },

    onSearch: function(e) {
      e.preventDefault();
      this.renderGrid();

      return false;
    },

    refresh: function() {
    },

    initHelper: function () {
      var helpers = this.option('gridHelpers'), p;

      for (p in helpers) {
        Handlebars.registerHelper(p , helpers[p]);
      }
    },

    renderGrid: function() {
    },

    postData: function() {
      var postData = this.option('postData');
      if (typeof postData === 'function') {
        return postData.call(this, this.getParams());
      } else {
        return this.getParams();
      }
    },

    getParams: function() {
      return (new FormData(this.$('form').prop('elements'))).toJSON();
    },

    // 创建分页的设置
    createPageSizeHtml: function() {
      if (!this.option('createPageSize') || this.renderedPageSize) {
        return;
      }
      var self = this;
      var html = [];
      var options = '';
      var SIZE = [10, 20, 30, 50, 100];
      var len = SIZE.length;
      var i = 0;

      html.push('<div class="form-inline">');
      html.push('<label>每页显示：</label>');
      html.push('<select data-role="pageSize" data-label="分页条数" class="form-control">');

      for (;i < len;i++) {
        var size = SIZE[i];
        options += '<option value="' + size + '">' + size + '条</option>';
      }
      html.push(options);

      html.push('</select></div>');

      html = html.join('');
      $(html).insertAfter(this.gridElement);

      this.role('pageSize').off('change').on('change', function() {
        self.option('gridCfg/pageSize', $(this).val());
        self.renderGrid();
      });
      self.renderedPageSize = true;

    },

    /**
     * 创建时间
     *
     * @method createTime
     * @return {[type]} [description]
     */
    createTime: function() {
      if (!this.option('showTime')) {
        return;
      }

      var self = this;
      var html = [];
      // var now = moment();

      // html.push('<div class="form-group"><label>创建时间：</label>');
      html.push('<input type="text" class="form-control datepicker" placeholder="开始时间至结束时间" readonly>');
      html.push('<input type="hidden" name="startTime">');
      html.push('<input type="hidden" name="endTime"> ');
      html = html.join('');

      this.$('[type=submit]').before(html);

      this.$('.datepicker').daterangepicker({
        //endDate: moment(),
        maxDate: moment(),
        opens:self.option('opens'),
        format: 'YYYY-MM-DD',
        separator:'至',
        showDropdowns: true,
        ranges: {
           '今天': [moment(), moment()],
           '昨天': [moment().subtract('days', 1), moment().subtract('days', 1)],
           '近7天': [moment().subtract('days', 6), moment()],
           '近30天': [moment().subtract('days', 29), moment()],
           '当月': [moment().startOf('month'), moment().endOf('month')],
           '上个月': [moment().subtract('month', 1).startOf('month'), moment().subtract('month', 1).endOf('month')]
        },
        locale: {
          applyLabel: '确定',
          cancelLabel: '取消',
          fromLabel: '开始',
          toLabel: '结束',
          customRangeLabel: '自定义',
          daysOfWeek: ['日', '一', '二', '三', '四', '五', '六'],
          monthNames: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
          firstDay: 0
        }
      }).on('apply.daterangepicker', function(ev, picker) {
        self.$('[name=startTime]').val(picker.startDate.valueOf());
        self.$('[name=endTime]').val(picker.endDate.valueOf());
      });
    },
    destroy: function() {
      this.option('showTime') && this.$('.datepicker').each(function() {
        var daterangepicker = $(this).data('daterangepicker');
        if (daterangepicker) {
          daterangepicker.remove();
        }
      });
      Core.superclass.destroy.call(this);
    }

  });

  return Core;
});
