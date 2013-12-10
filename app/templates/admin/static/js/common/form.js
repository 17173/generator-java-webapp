define(['jquery','common/util', 'common/class', 'moment','jquery.validate'], function($, util, Class, moment) {
    "use strict";

    /**
     * 表单类
     *
     * @class Form
     * @constructor
     */
    var Form = Class.create({
        initialize: function(options) {
            this.options = $.extend({}, defaults, options);
            this.$form = $(this.options.formId);

            this._init();
        },

        _init: function() {
            this._parseElement();
            this._initValidator();
            this._bindEvents();
        },

        _initValidator: function() {
            var self = this;
            var options = this.options;

            if (options.alertError) {
                this.$form.before('<div id="J_Alert" class="alert hide"></div>');
                this.$alert = $('#J_Alert');
            } else {
                this.$form.validate({
                    rules: options.rules,
                    messages: options.messages,
                    errorElement: "span",
                    errorClass: "help-block has-error",
                    errorPlacement: function(e, t) {
                        return t.parents(".controls").first().append(e);
                    },
                    highlight: function(e) {
                        return $(e).closest('.form-group').removeClass("has-error has-success").addClass('has-error');
                    },
                    success: function(e) {
                        return e.closest(".form-group").removeClass("has-error");
                    },
                    submitHandler: $.proxy(this.onSubmit, this)
                })
            }

        },
        _parseElement: function() {
            this.$btnSubmit = $(this.options.submitNode);
        },

        _bindEvents: function() {
            var self = this;
            this.$btnSubmit.on('click', function() {
                self.$form.submit();
                return false;
            })

        },

        onSubmit: function() {
            var options = this.options;
            var url = options.url;
            var params = util.packForm(this.$form);
            //console.log(2)

            if (typeof options.postData == 'function') {
                params = options.postData(params);
            }
            util.post(url, params,{
                success: function() {
                    var data = this.data;
                    options.onSuccess(data);
                },
                error: function(msg) {
                    options.onError(msg);
                }
            });
            return false;
        },

        errorPlacement: function(error, el) {
            if (this.options.alertError) {
                this.$alert.append('<p>' + error + '</p>');
            } else {

            }
        }
    });

    var defaults = Form.defaults = {
        /**
         * 表单 id
         *
         * @property formId
         * @type {String}
         * @default '#J_Form'
         */
        formId: '#J_Form',

        /**
         * 默认出错信息放 input 后面，否则，用 alert 方式显示出错信息
         */
        alertError: false,

        /**
         * 表单提交的按钮元素
         *
         * @property submitNode
         * @type {String}
         * @default '[type=submit]'
         */
        submitNode: '[type=submit]',

        /**
         * 验证规则
         *
         *
         */
        rules: {},

        /**
         * 验证提示信息
         *
         */
        messages: {},

        /**
         * 提交的地址
         *
         * @property url
         */
        url: null,

        postData: function(data) {
            return data;
        },

        /**
         * 表单提交成功后的回调函数
         *
         * @property onSuccess
         */
        onSuccess: $.noop,

        onError: $.noop
    };

    return Form;
})