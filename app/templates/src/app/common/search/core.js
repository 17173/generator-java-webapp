  'use strict';

  var $ = require('jquery');
  var Handlebars = require('handlebars')['default'];
  var Widget = require('pandora-widget');
  var Confirm = require('pandora-confirm');
  var Tips = require('pandora-tips');

  var util = require('../util');
  var io = require('../io');
  var Form = require('../form/form');
  var FormData = require('../form/data');

  var DateRange = require('./daterange');

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
      // 时间选项
      dateCfg: {
        // 时间显示的位置 left or right
        opens: 'left',
        startTimeName: 'startTime',
        endTimeName: 'endTime'
      },

      dateCfg2: {
        disabled: true
      },
      showForm: true,
      // 表单选项
      formCfg: {
        // 隐藏域
        hiddens: {
          // startTime: '',
          // endTime: '',
          sortOrder: 'desc',
          sortColumn: '',
          pageNo: 1
        },
        data: {
          layout: 'inline',
          buttons: null,
          groups: []
        },
        xhr: false
      },
      gridElement: null,
      // handlebars helpers
      gridHelpers: {
        ellipsis: function(val, size) {
          if (!val) {
            return '';
          } else {
            val = val.length <= size ? val : ('<span title="' + val + '">' + val.slice(0, size) + '&hellip;' + '</span>');
            return val;
          }
        }
      },
      keepHistory: true,
      // 列表请求地址
      url: null,
      // 等待删除的加载
      hasWaitingDelete: false,
      // 删除行请求地址
      delUrl: null,
      // 删除时的提示信息
      delMsg: '确定删除？',
      // 删除的请求参数,默认为id
      delKey: 'id',
      delegates: {
        'click :submit': function() {
          if (this.form) {
            this.form.name('pageNo').val(1);
          }
        },
        // 进入专题文件
        'click [data-role=enter]': 'enter',
        // 返回根目录
        'click [data-role=root]': 'root',
        // 返回上一级目录
        'click [data-role=prev]': 'prev',
        'submit': 'onSearch',
        'click [data-role=del]': 'delRow'
      }
    },

    setup: function() {
      var self = this;
      self.render();

      if (!this.option('url')) {
        throw new Error('请设置 url');
      }

      this.initForm();
      this.initDate();
      this.initDate2();
      this.fire('formRender');

      this.initGrid();
    },

    initForm: function() {
      var self = this,
        formCfg,
        dateCfg,
        groups,
        hiddens,
        buttons,
        key;

      // 兼容写在 ftl 里的 form
      self.formElement = self.$('form');

      if (!self.formElement.length) {
        formCfg = self.option('formCfg');

        if (self.option('keepHistory')) {
          formCfg.values = util.queryToJson(window.location.hash.substring(1));
        }

        formCfg.container = self.element;

        // 添加默认隐藏域
        groups = formCfg.data.groups;
        hiddens = formCfg.hiddens,
        buttons = formCfg.buttons;

        if (typeof formCfg.hiddens === 'function') {
          hiddens = formCfg.hiddens.call(self);
        }

        if (typeof formCfg.buttons === 'function') {
          buttons = formCfg.buttons.call(self);
        }

        // 添加 date 隐藏域
        dateCfg = self.option('dateCfg');
        if (!dateCfg.disabled) {
          hiddens[dateCfg.startTimeName] = '';
          hiddens[dateCfg.endTimeName] = '';
        }

        for (key in hiddens) {
          groups.unshift({
            hidden: true,
            colspan: null,
            attrs: {
              type: 'hidden',
              name: key,
              value: hiddens[key]
            }
          });
        }

        if (buttons) {
          buttons.forEach(function(button) {
            groups.unshift(button);
          });
        }

        self.form = new Form(formCfg);
        self.form.$parent = self;
        self.formElement = self.form.element;
        self.form.on('valid', function() {
          self.fire('formValid');
          self.refresh();
        });
      }

      self.formElement.addClass('grid-head clearfix');
      if (!this.option('showForm')) {
        this.role('form').hide();
      }
    },

    initGrid: function() {
      if (!this.gridElement) {
        this.gridElement = $(this.option('gridElement'));
      }

      if (!this.gridElement.length) {
        this.gridElement = $('<div/>').insertAfter(this.formElement);
      }

      this.gridElement.addClass('grid-body table-responsive');
      this.gridElement.before('<div class="grid-info clearfix" data-role="gridInfo"></div>');

      this.initHelper();
      this.renderGrid();
    },

    delRow: function(e) {
      var self = this;

      e.stopPropagation();

      var param = {};

      param[self.option('delKey')] = e.currentTarget.dataset.id;
      param = util.mixin(param, self.option('delParam'));

      this.deleteRow(param, function() {
        self.fire('deleteRow', e.currentTarget);
      });

    },

    deleteRow: function(param, callback) {
      var self = this;

      if (!self.option('delUrl')) {
        throw new Error('请设置 delUrl');
      }

      new Confirm({
        content: self.option('delMsg')
      }).submit(function() {
        if (self.option('hasWaitingDelete')) {
          self.waitingDelete = new Tips({
            timeout: 0,
            content: '<i class="fa fa-spinner"></i> 数据删除中...'
          });
        }

        io.post(self.option('delUrl'), param, function() {

          typeof callback === 'function' && callback();

          if (self.waitingDelete) {
            self.waitingDelete.role('content').html('删除成功！');
            window.setTimeout(function() {
              self.waitingDelete.destroy();
            }, 2000);
          } else {
            new Tips({
              content: '删除成功！'
            });
          }

          // TODO: 改成 FORM SUBMIT
          self.setParam('pageNo', 1);
          self.refresh();
        });
      });
    },

    onSearch: function(e) {
      if (e) {
        e.preventDefault();
      }

      if (!this.form) {
        this.renderGrid();
      }

      return false;
    },

    refresh: function() {},

    initHelper: function() {
      var gridHelpers = this.option('gridHelpers'),
        p;

      for (p in gridHelpers) {
        Handlebars.registerHelper(p, gridHelpers[p]);
      }
    },

    renderGrid: function() {},

    postData: function() {
      var postData = this.option('postData');
      if (typeof postData === 'function') {
        return postData.call(this, this.getParams());
      } else {
        return this.getParams();
      }
    },

    getParams: function() {
      var formData = this.formData = new FormData(this.$('form').prop('elements'));
      if (this.option('keepHistory')) {
        window.location.hash = formData.paramify(true);
      }
      return formData.toJSON();
    },

    setParam: function(key, value) {
      this.form.name(key).val(value);
    },

    getParam: function(key) {
      return this.form.name(key).val();
    },

    /**
     * 创建时间
     *
     * @method initDate
     * @return {[type]} [description]
     */
    initDate: function() {
      var dateCfg = this.option('dateCfg');

      if (dateCfg.disabled) {
        return;
      }

      dateCfg.container = this.$(':submit');
      dateCfg.insert = function() {
        this.container.before(this.element);
      };

      this.dateRange = new DateRange(dateCfg);
    },

    /**
     * 创建第二个时间
     *
     * @return {[type]} [description]
     */
    initDate2: function() {
      var dateCfg = this.option('dateCfg2');

      if (dateCfg.disabled) {
        return;
      }

      dateCfg.container = this.dateRange.element;
      dateCfg.insert = function() {
        this.container.before(this.element);
      };

      this.dateRange2 = new DateRange(dateCfg);
    },

    destroy: function(callback) {
      if (callback) {
        return this.on('destroy', callback);
      }

      this.dateRange && this.dateRange.destroy();

      Core.superclass.destroy.apply(this);
    }

  });

  module.exports = Core;
