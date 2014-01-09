define([
    'jquery',
    'common/util', 
    'common/class', 
    'common/grid', 
    'common/select',
    'moment',
    'bootbox',
    'bootstrap-daterangepicker',
    'jquery.validate'
], function($, util, Class, Grid, Select, moment, bootbox) {
    "use strict";

    /**
     * 搜索类
     *
     * @class Search
     */
    var Search = Class.create({
        initialize: function(options) {
            this.options = $.extend(true, {}, defaults, options);

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

            this._initValidator();
            this._bindEvents();
        },

        _initValidator: function() {
            if (!this.$form) {
                return;
            }
            var self = this;
            var options = this.options;

            this.$form.validate({
                rules: options.rules,
                messages: options.messages,
                errorElement: "span",
                errorClass: "help-inline has-error",
                errorPlacement: function(e, t) {
                    return t.append(e);
                },
                highlight: function(e) {
                    return $(e).parents('.form-group').removeClass("has-error has-success").addClass('has-error');
                },
                success: function(e) {
                    return e.parents(".form-group").removeClass("has-error");
                },
                submitHandler: $.proxy(this.onSubmit, this)
            })
        },

        onSubmit: function() {
            this.render();
        },

        _initDaterangepicker: function() {
            var self = this;
            if (!this.$form) {
                return;
            }
            var $datepicker = this.$form.find('[data-role=daterange]');
            if (!$datepicker.length) {
                return;
            }
            this.$fromDate = this.$form.find('[name=fromDate]');
            this.$toDate = this.$form.find('[name=toDate]');
            var startDate = moment().subtract('months', 1);
            var endDate = moment();
            var $val = $datepicker.find('span').html(startDate.format('YYYY-MM-DD') + ' 至 ' + endDate.format('YYYY-MM-DD'));
            this.$fromDate.val(startDate.format('YYYY-MM-DD'));
            this.$toDate.val(endDate.format('YYYY-MM-DD'));
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
                    self.$fromDate.val(start.format('YYYY-MM-DD'));
                    self.$toDate.val(end.format('YYYY-MM-DD'));
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
            var self = this;
            var options = this.options;
            var url = options.formCfg.url || options.gridCfg.dataUrl;
            this.options.formCfg.url = url;
            this.options.gridCfg.dataUrl = url;
            this.$form = $(this.options.formCfg.formId);
            if (this.$form) {
                this.options.gridCfg.postDataFunction = function() {
                    var data = util.packForm(self.$form);
                    return data;
                };
                this.$fdStatus = this.$form.find('[name=fdStatus]');
            }
            
            this.$grid = $(this.options.gridCfg.element);
            this.$gridBar = $(this.options.gridCfg.barElement);

        },

        _bindEvents: function() {
            this.$form && this.$form.on('click','[data-role=fdStatus]', $.proxy(this.toggleStatus, this));
            this.$grid.on('click', '[data-role=delete]', $.proxy(this.delete, this));
            this.$grid.on('click', '[data-role=edit]', $.proxy(this.edit, this));
            this.$grid.on('click', '[data-role=resetpwd]', $.proxy(this.resetPwd, this));

        },

        edit: function(e) {
            var $target = $(e.currentTarget);
            var source = $('#tpl-RoleDialog').html();
            var template = Handlebars.compile(source);
            var data = {
                isEdit: true,
                fdId: $target.data('id'),
                fdName:$target.data('display')
            };
            var html = template(data);
            var cfg = {
                title: '编辑权限',
                content: html
            }
            this.openDialog(cfg);
        },
        openDialog: function(cfg) {
            bootbox.dialog({
                message: cfg.content,
                title: cfg.title,
                buttons: {
                    danger: {
                        label: "取消",
                        className: "btn"
                    },
                    main: {
                        label: "确定",
                        className: "btn-primary",
                        callback: function() {
                           typeof cfg.handle == 'function' && cfg.handle()
                        }
                    }
                },
                onShown: function() {
                    typeof cfg.onShown == 'function' && cfg.onShown()
                }
            });

        },

        resetPwd: function(e) {
            var $target = $(e.currentTarget);
            var display = $target.data('display');
            var msg = '确定将' + display + '的密码重置吗？';
            var url = CUI.getUrl($target.data('url'));

            bootbox.confirm(msg, function(result) {
                if (result) {
                    util.post(url, {fdId: $target.data('id')}, function() {
                        bootbox.alert('密码重置成功！');
                    })
                }
            })
        },

        delete: function(e) {
            var self = this;
            var gridCfg = self.options.gridCfg;
            var $target = $(e.currentTarget);
            var id = $target.data('id');
            var msg = $target.data('display') ? ('确定将' + $target.data('display') + '删除') : gridCfg.deleteMsg;
            bootbox.confirm(msg, function(result) {
                if (result) {
                    util.post(gridCfg.deleteUrl, {fdId: id, fdStatus: '21'}, function() {
                        self.render();
                    })
                }
            })
            

        },

        toggleStatus: function(e) {
            var $target = $(e.target);
            var val = $target.data('value');
            $target.addClass('btn-primary').siblings().removeClass('btn-primary');
            this.$fdStatus.val(val);
        }
    });

    var gridCfg = $.extend(true, {}, Grid.defaults, {
        deleteMsg: '确定删除？',
        deleteUrl: null
    })
    var defaults = {
        /**
         * 表单配置
         *
         * @property formCfg
         */
        formCfg: {
            formId: '#J_Form',
            rule: {},
            messages: {}
        },
        gridCfg: gridCfg
    };

    return Search;
})