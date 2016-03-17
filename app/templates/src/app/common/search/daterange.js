  'use strict';

  var $ = require('jquery'),
    Widget = require('pandora-widget'),
    moment = require('moment');

  require('jquery-daterangepicker')($);

  var DateRange = Widget.extend({

    defaults: {
      classPrefix: 'datepicker',
      // 是否可以清空时间
      hasClear: true,
      // 统计的结束时间 减 1 秒
      isTJ: false,
      element: '<input class="form-control" type="text" placeholder="开始时间至结束时间" readonly/>',
      startTimeName: 'startTime',
      endTimeName: 'endTime'
    },

    setup: function() {
      this.render();
      this.initPicker();
    },

    initPicker: function() {
      var self = this,
        startTime, endTime,
        startTimeVal, endTimeVal,
        placeholder = this.option('placeholder'),
        startTimeName = this.option('startTimeName'),
        endTimeName = this.option('endTimeName');

      startTime = self.element.closest('form').find('[name=' + startTimeName + ']');
      endTime = self.element.closest('form').find('[name=' + endTimeName + ']');

      if (!startTime.length) {
        startTime = $('<input type="hidden" name="' + startTimeName + '">').insertAfter(this.element);
      }

      if (!endTime.length) {
        endTime = $('<input type="hidden" name="' + endTimeName + '">').insertAfter(this.element);
      }

      self.element.after(' ');

      if (placeholder && placeholder !== '') {
        self.element.attr('placeholder', placeholder);
      }

      if (this.option('startDate') && this.option('endDate')) {
        var endTimestamp = this.option('endDate').endOf('day').valueOf();
        if (this.option('isTJ')) {
          endTimestamp = endTimestamp - 999;
        }
        startTime.val(this.option('startDate').startOf('day').valueOf());
        endTime.val(endTimestamp);
      }

      startTimeVal = startTime.val();
      endTimeVal = endTime.val();

      if (startTimeVal && endTimeVal) {
        self.element.val(moment(+startTimeVal).format('YYYY-MM-DD') +
          '至' + moment(+endTimeVal).format('YYYY-MM-DD'));
      }

      var ranges = {
        '今天': [moment(), moment()],
        '昨天': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
        '近7天': [moment().subtract(6, 'days'), moment()],
        '近30天': [moment().subtract(29,'days'), moment()],
        '当月': [moment().startOf('month'), moment().endOf('month')],
        '上个月': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
      };

      self.element.daterangepicker({
        //minDate: moment().subtract(1, 'years'),
        maxDate: self.option('maxDate') || moment(),
        startDate: self.option('startDate'),
        endDate: self.option('endDate'),
        opens: self.option('opens'),
        format: 'YYYY-MM-DD',
        separator: '至',
        showDropdowns: true,
        ranges: self.option('ranges') || ranges,
        locale: {
          applyLabel: '确定',
          cancelLabel: self.option('hasClear') ? '清除' : '取消',
          fromLabel: '开始',
          toLabel: '结束',
          customRangeLabel: '自定义',
          daysOfWeek: ['日', '一', '二', '三', '四', '五', '六'],
          monthNames: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
          firstDay: 0
        }
      }).on('apply.daterangepicker', function(ev, picker) {
        var handleOk = self.option('handleOk')
        if (typeof handleOk === 'function') {
          if (!handleOk(picker, moment(+startTime.val()), moment(+endTime.val()) )) {
            return false;
          }
        }
        var timestamp = picker.endDate.endOf('day').valueOf();
        if (self.option('isTJ')) {
          timestamp = timestamp - 999;
        }
        startTime.val(picker.startDate.startOf('day').valueOf());
        endTime.val(timestamp);
      }).on('cancel.daterangepicker', function(ev, picker) {
        if (self.option('hasClear')) {
          startTime.val('');
          endTime.val('');
          picker.element.val('');
          /*picker.startDate = moment();
          picker.endDate = moment();
          picker.updateCalendars();*/
        }

      });

      self.picker = self.element.data('daterangepicker');
      self.picker.updateCalendars();
    },

    setStartTime: function(startTime) {
      this.picker.setStartDate(startTime);
    },

    setEndTime: function(endTime) {
      this.picker.setEndDate(endTime);
    },

    destroy: function() {
      this.picker && this.picker.remove();

      DateRange.superclass.destroy.apply(this);
    }

  });

  module.exports = DateRange;

