define(['jquery','common/util', 'common/class', 'bootstrap-grid'], function ($, util, Class) {
    "use strict";

    var Grid = Class.create({
        initialize: function(options) {
            this.options = $.extend({}, defaults, options);
            var options = this.options;
            this.$element = $(options.element);
            this.$gridBar = $(options.barElement);

            this._init();
        },
        _init: function() {
            this._processOptions();
            this.render();
            //this._bindEvents();
        },
        _processOptions: function() {
            var self = this;
            var options = this.options;
            var checkColumnIndex = options.checkColumnIndex;
            var cellTemplates = [];
            var headerTemplates = [];
            var CHECK_ALL_HTML = '<th width="30px"><input type="checkbox" class="checkbox" id="' + options.checkAllId + '"/></th>';
            var CHECK_ITEM_HTML = '<input type="checkbox" class="checkbox">';
            if (checkColumnIndex) {
                var colSize = options.columnNames.length + 1;

                if (options.cellTemplates !== null) {
                    this.options.cellTemplates.splice(checkColumnIndex, 0, CHECK_ITEM_HTML);
                } else {
                    for(var i = 0; i < colSize; i++) {
                        if (i == checkColumnIndex) {
                            cellTemplates[i] = CHECK_ITEM_HTML;
                        } else {
                            cellTemplates[i] = null;
                        }
                    }
                    this.options.cellTemplates = cellTemplates;
                }

                if (options.headerTemplates !== null) {
                    this.options.headerTemplates.splice(checkColumnIndex, 0, CHECK_ALL_HTML);
                } else {
                    for(var j = 0; j < colSize; j++) {
                        if (j == checkColumnIndex) {
                            headerTemplates[j] = CHECK_ALL_HTML;
                            break;
                        } else {
                            headerTemplates[j] = null;
                        }
                    }
                    this.options.headerTemplates = headerTemplates;
                }

                this.options.columnNames.splice(checkColumnIndex, 0, '');
                this.options.columnKeys.splice(checkColumnIndex, 0, null);
                this.options.pageRenderedEvent = $.proxy(this.pageRenderedEvent, this);
                this.options.postDataFunction = function() {
                    return util.packForm(options.formElement);
                }
            }
        },
        postData: function() {

        },
        pageRenderedEvent: function() {
            this._parseElement();
            this.initGridBar();
            this._bindEvents();
            this.options.gridRendered && this.options.gridRendered();
        },
        $: function(el) {
            return this.$element.find(el);
        },
        initGridBar: function() {
            this.$gridBar.find('[data-role=multiCheck]').prop('disabled', true).addClass('disabled');
            this.$gridBar.find('[data-role=edit]').prop('disabled', true).addClass('disabled');
            this.$checkAll.prop('checked', false);
        },
        _parseElement: function() {
            this.$checkAll = $(this.options.checkAllId);
            this.$tbody = this.$('tbody');
        },
        _bindEvents: function() {
            this._bindRowEvent();
            this._bindCheckEvents();
        },
        _bindRowEvent: function() {
            var self = this;
            var options = self.options;
            this.$tbody.on('dblclick', 'tr', function() {
                var $row = $(this);
                var $check = $row.find('input[type=checkbox]');

                self.$element.find('input[type=checkbox]').prop('checked',false);
                $check.prop('checked', true);
                options.onDblClickRow && options.onDblClickRow.call(self.$gridBar);
            });
        },
        _bindCheckEvents: function() {
            var self = this;
            var options = self.options;
            var $checks = self.$tbody.find('input[type=checkbox]');
            //console.log(this.$checkAll)

            self.$element.on('click', 'input[type=checkbox]', function() {
                var $self = $(this);
                var $checks = self.$tbody.find('input[type=checkbox]');
                if ($self.attr('id') == self.options.checkAllId) {
                    $checks.prop('checked', $self.prop('checked'));
                    options.onCheckAll && options.onCheckAll.call(self.$gridBar, $self.prop('checked'));
                } else {
                    var len = $checks.length;
                    var checkedLen = self.$tbody.find(':checked').length;

                    self.$checkAll.prop('checked', checkedLen === len?true:false);
                    options.onCheck && options.onCheck.call(self.$gridBar, checkedLen, len);
                }
            })
        },

        /**
         * 获取单页checked的id集合
         * @return {Array}
         */
        getCheckedIds: function() {
            var ret = [];
            var self = this;

            this.$element.simplePagingGrid('currentPageData', function(data) {
                self.$tbody.find(':checkbox').each(function(i) {
                    $(this).prop('checked') && data[i] && ret.push(data[i].id);
                });
            });
            return ret;
        },

        /**
         * 获取单条checked的数据
         * @return {{}}
         */
        getSingleData: function() {
            var ret = {};
            var self = this;

            this.$element.simplePagingGrid('currentPageData', function(data) {
                self.$tbody.find(':checkbox').each(function(i) {
                    if ($(this).prop('checked')) {
                        ret = data[i];
                        return false;
                    }
                });
            });
            return ret;
        },
        render: function() {
            var self = this;
            var options = this.options;

            this.$element.simplePagingGrid(options);
        },
        refresh: function() {
            var dataUrl = this.options.dataUrl;
            this.$element.simplePagingGrid('refresh', dataUrl);
        }
    });
    var buttonBarTemplateNew = '<div class="clearfix form-inline"> \
                                    {{#if showGotoPage}} \
                                        <div class="pull-right form-group" style="padding-left: 1em;"> \
                                            <div class="input-group" style="width: 110px;"> \
                                                <input class="form-control pagetextpicker" type="text" value="{{currentPage}}" /> \
                                                <span class="input-group-btn"> \
                                                    <button class="btn btn-default pagetextpickerbtn" type="button">Go</button> \
                                                </span> \
                                            </div> \
                                        </div> \
                                    {{/if}} \
                                    <ul class="pagination pull-right" style="margin-top: 0px"> \
                                        {{#if isFirstPage}} \
                                            {{#if pageNumbersEnabled}} \
                                                <li><a href="#" class="first"><span class="glyphicon glyphicon-fast-backward" style="opacity: 0.5"></span></a></li> \
                                            {{/if}} \
                                            <li><a href="#" class="previous"><span class="glyphicon glyphicon-step-backward" style="opacity: 0.5"></span></a></li> \
                                        {{/if}} \
                                        {{#unless isFirstPage}} \
                                            {{#if pageNumbersEnabled}} \
                                                <li><a href="#" class="first"><span class="glyphicon glyphicon-fast-backward"></span></a></li> \
                                            {{/if}} \
                                            <li><a href="#" class="previous"><span class="glyphicon glyphicon-step-backward"></span></a></li> \
                                        {{/unless}} \
                                        {{#if pageNumbersEnabled}} \
                                            {{#each pages}} \
                                                {{#if isCurrentPage}} \
                                                    <li class="active"><a href="#" class="pagenumber" data-pagenumber="{{pageNumber}}">{{displayPageNumber}}</a></li> \
                                                {{/if}} \
                                                {{#unless isCurrentPage}} \
                                                    <li><a href="#" class="pagenumber" data-pagenumber="{{pageNumber}}">{{displayPageNumber}}</a></li> \
                                                {{/unless}} \
                                            {{/each}} \
                                        {{/if}} \
                                        {{#if isLastPage}} \
                                            <li><a href="#" class="next"><span class="glyphicon glyphicon-step-forward" style="opacity: 0.5"></span></a></li> \
                                            {{#if pageNumbersEnabled}} \
                                                <li><a href="#" class="last"><span class="glyphicon glyphicon-fast-forward" style="opacity: 0.5"></span></a></li> \
                                            {{/if}} \
                                        {{/if}} \
                                        {{#unless isLastPage}} \
                                            <li><a href="#" class="next"><span class="glyphicon glyphicon-step-forward"></span></a></li> \
                                            {{#if pageNumbersEnabled}} \
                                                <li><a href="#" class="last"><span class="glyphicon glyphicon-fast-forward"></span></a></li> \
                                            {{/if}} \
                                        {{/unless}} \
                                    </ul> \
                                </div>';
    var buttonBarTemplate = '<div class="pagination clearfix"> \
                                    <div class="page-info pull-left">共{{totalRows}}条记录</div> \
                                    <div class="pull-left" style="margin-top: 0px"> \
                                        <ul> \
                                            {{#if isFirstPage}} \
                                                {{#if pageNumbersEnabled}} \
                                                    <li><a href="#" class="first"><i class="icon-fast-backward" style="opacity: 0.5"></i></a></li> \
                                                {{/if}} \
                                                <li><a href="#" class="previous"><i class="icon-step-backward" style="opacity: 0.5"></i></a></li> \
                                            {{/if}} \
                                            {{#unless isFirstPage}} \
                                                {{#if pageNumbersEnabled}} \
                                                    <li><a href="#" class="first"><i class="icon-fast-backward"></i></a></li> \
                                                {{/if}} \
                                                <li><a href="#" class="previous"><i class="icon-step-backward"></i></a></li> \
                                            {{/unless}} \
                                            {{#if pageNumbersEnabled}} \
                                                {{#each pages}} \
                                                    {{#if isCurrentPage}} \
                                                        <li class="active"><a href="#" class="pagenumber" data-pagenumber="{{pageNumber}}">{{displayPageNumber}}</a></li> \
                                                    {{/if}} \
                                                    {{#unless isCurrentPage}} \
                                                        <li><a href="#" class="pagenumber" data-pagenumber="{{pageNumber}}">{{displayPageNumber}}</a></li> \
                                                    {{/unless}} \
                                                {{/each}} \
                                            {{/if}} \
                                            {{#if isLastPage}} \
                                                <li><a href="#" class="next"><i class="icon-step-forward" style="opacity: 0.5"></i></a></li> \
                                                {{#if pageNumbersEnabled}} \
                                                    <li><a href="#" class="last"><i class="icon-fast-forward" style="opacity: 0.5"></i></a></li> \
                                                {{/if}} \
                                            {{/if}} \
                                            {{#unless isLastPage}} \
                                                <li><a href="#" class="next"><i class="icon-step-forward"></i></a></li> \
                                                {{#if pageNumbersEnabled}} \
                                                    <li><a href="#" class="last"><i class="icon-fast-forward"></i></a></li> \
                                                {{/if}} \
                                            {{/unless}} \
                                        </ul> \
                                    </div> \
                                    {{#if showGotoPage}} \
                                        <div class="pull-left"  style="padding-left: 10px;"> \
                                            <div class="input-append" > \
                                                <input style="width: 3em;" class="pagetextpicker" type="text" value="{{currentPage}}" /> \
                                                <button class="btn pagetextpickerbtn" type="button">Go</button> \
                                            </div> \
                                        </div> \
                                    {{/if}} \
                                </div>';
    var defaults = {
        element: '#J_Grid',
        pageSize: 15,
        barElement: '#J_GridBar',
        checkAllId: '#J_CheckAll',
        showLoadingOverlay: false,
        minimumVisibleRows: 15,
        templates: {
            buttonBarTemplate: buttonBarTemplateNew
        },
        checkColumnIndex: 1,
        tableClass: 'table table-bordered table-striped table-hover',

        /**
         * 是否全部选中触发事件
         * @param checked 是否全部选中
         */
        onCheckAll: null,

        /**
         * 选中触发事件
         * @param checkedLen 已选中的个数
         * @param len 单页的checkbox的个数
         */
        onCheck: null,
        cellTemplates: null,
        headerTemplates: null,
        columnNames: null,
        columnKeys: null
    };

    return Grid;
});