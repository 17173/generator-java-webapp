define(['jquery', 'common/class', 'common/grid', 'common/select','common/form','moment','bootstrap-daterangepicker','jquery.validate'], function($, Class, Grid, Select, Form, moment) {
    "use strict";

    /**
     * 搜索类
     *
     * @class Search
     */
    var Search = Class.create({
        initialize: function(options) {
            this.options = $.extend(true, {}, defaults, options);
            this.$form = $(this.options.formCfg.formId);

            this._init();
        },

        _init: function() {
            var options = this.options;
            var self = this;
            this._parseElement();
            //this._initDatepicker();
            this._initDaterangepicker();
            this.select = new Select();
            this.grid = new Grid(options.gridCfg);

            this.options.formCfg.onSuccess = function() {
                //self.render();
            }
            this.form = new Form(this.options.formCfg);
            this._bindEvents();
        },

        _initDaterangepicker: function() {
            var $datepicker = this.$form.find('[data-role=daterange]');
            if (!$datepicker.length) {
                return;
            }
            var startDate = moment().subtract('months', 1);
            var endDate = moment();
            var $val = $datepicker.find('span').html(startDate.format('YYYY-MM-DD') + ' 至 ' + endDate.format('YYYY-MM-DD'));
            $datepicker.daterangepicker(
                {
                    startDate: startDate,
                    endDate: endDate,
                    minDate: '2012-1-01',
                    maxDate: '2014-12-29',
                    dateLimit: { days: 60 },
                    showDropdowns: true,
                    showWeekNumbers: true,
                    timePicker: false,
                    timePickerIncrement: 1,
                    timePicker12Hour: true,
                    ranges: {
                        'Today': [moment(), moment()],
                        'Yesterday': [moment().subtract('days', 1), moment().subtract('days', 1)],
                        'Last 7 Days': [moment().subtract('days', 6), moment()],
                        'Last 30 Days': [moment().subtract('days', 29), moment()],
                        'This Month': [moment().startOf('month'), moment().endOf('month')],
                        'Last Month': [moment().subtract('month', 1).startOf('month'), moment().subtract('month', 1).endOf('month')]
                    },
                    opens: 'left',
                    buttonClasses: ['btn'],
                    applyClass: 'btn-small btn-primary',
                    cancelClass: 'btn-small',
                    format: 'YYYY-MM-DD',
                    separator: ' to ',
                    locale: {
                        applyLabel: 'Submit',
                        fromLabel: '开始时间',
                        toLabel: '结束时间',
                        customRangeLabel: 'Custom Range',
                        daysOfWeek: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr','Sa'],
                        monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
                        firstDay: 1
                    }
                },
                function(start, end) {
                    $val.html(start.format('YYYY-MM-DD') + ' 至 ' + end.format('YYYY-MM-DD'));
                }
            )
        },

        _initDatepicker: function() {
            var $datepicker = this.$form.find('.date');
            if (!$datepicker.length) {
                return;
            }
            $.fn.datepicker.dates['zh-CN'] = {
                days: ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期日"],
                daysShort: ["周日", "周一", "周二", "周三", "周四", "周五", "周六", "周日"],
                daysMin:  ["日", "一", "二", "三", "四", "五", "六", "日"],
                months: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
                monthsShort: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
                today: "今日",
                format: "yyyy年mm月dd日",
                weekStart: 1
            };
            var $startTime = $datepicker.eq(0).find('input');
            var $endTime = $datepicker.eq(1).find('input');
            $startTime.val(moment().subtract('months', 1).format('YYYY-MM-DD'));
            $endTime.val(moment().format('YYYY-MM-DD'));

            this.$form.find('.date').datepicker({
                language: "zh-CN",
                format: 'yyyy-mm-dd',
                calendarWeeks: true,
                autoclose: true,
                todayHighlight: true
            })
        },

        render: function() {
            this.grid.refresh();
        },

        _parseElement: function() {
            var options = this.options;
            var url = options.formCfg.url || options.gridCfg.dataUrl;
            this.options.formCfg.url = url;
            this.options.gridCfg.dataUrl = url;
        },

        _bindEvents: function() {

        }
    });

    var formCfg = $.extend(true, {}, Form.defaults, {alertError: true});
    var defaults = {
        /**
         * 表单配置
         *
         * @property formCfg
         */
        formCfg: formCfg,
        gridCfg: null
    };

    return Search;
})