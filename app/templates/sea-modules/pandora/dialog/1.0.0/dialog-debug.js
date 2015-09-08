define("pandora/dialog/1.0.0/dialog-debug", [ "pandora/overlay/1.0.0/overlay-debug", "$-debug", "pandora/widget/1.0.0/widget-debug", "pandora/base/1.0.0/base-debug", "pandora/class/1.0.0/class-debug", "pandora/events/1.0.0/events-debug", "pandora/locker/1.0.0/locker-debug", "./mask-debug", "./dialog-debug.css", "./dialog-debug.handlebars" ], function(require, exports, module) {
    /**
   * 对话框
   * @module Dialog
   */
    "use strict";
    var Overlay = require("pandora/overlay/1.0.0/overlay-debug"), Locker = require("pandora/locker/1.0.0/locker-debug");
    // 遮罩层
    var Mask = require("./mask-debug");
    // 样式表
    var importStyle = require("./dialog-debug.css"), styleImported;
    // 当前位于顶层的 dialog
    var dialogLocker = new Locker(), dialogInTop;
    function handleDialogInTop(dialog, destroy) {
        var nextDialog;
        // 先移除
        dialogLocker.remove(dialog.uniqueId);
        if (dialogInTop === dialog) {
            dialogInTop = null;
            if (dialogLocker.length()) {
                nextDialog = dialogLocker.last();
                nextDialog && nextDialog.focus && nextDialog.focus();
            }
        }
        // 再添加
        if (!destroy) {
            dialogLocker.set(dialog.uniqueId, dialog, 0);
        }
    }
    /**
   * Dialog
   * 对话框
   *
   * @class Dialog
   * @extends Overlay
   * @constructor
   */
    var Dialog = Overlay.extend({
        defaults: {
            baseXY: {
                x: .5
            },
            /**
       * 样式前缀
       *
       * @attribute classPrefix
       * @default ue-dialog
       * @type {String}
       */
            classPrefix: "ue-dialog",
            css: {
                position: !!window.ActiveXObject && !window.XMLHttpRequest ? "absolute" : "fixed"
            },
            data: {
                // 关闭
                close: "&times;"
            },
            // 事件代理
            delegates: {
                keydown: function(e) {
                    e.keyCode === 27 && this.close();
                },
                mousedown: function() {
                    this.focus(true);
                },
                "click [data-role=close]": function() {
                    this.close();
                }
            },
            /**
       * 是否模拟为模态对话框，即显示遮罩层
       *
       * @attribute mask
       * @default false
       * @type {Boolean}
       */
            mask: false,
            maskFixed: false,
            /**
       * 位置偏移，单位为像素
       *
       * @attribute offset
       * @default {x:0,y:70}
       * @type Object
       */
            offset: {
                y: 70
            },
            selfXY: {
                x: .5
            },
            // 对话框模板
            template: require("./dialog-debug.handlebars"),
            // 对话框触发点
            trigger: null,
            importStyle: false
        },
        setup: function() {
            var self = this, title = self.option("title"), content = self.option("content");
            content && self.data({
                content: content
            });
            title && self.data({
                title: title
            });
            if (this.option("importStyle") && !styleImported) {
                importStyle();
                styleImported = true;
            }
            Dialog.superclass.setup.apply(self);
        },
        /**
     * 设置zIndex
     *
     * @method setIndex
     * @param {Number} [index] 增加值
     * @private
     * @chainable
     */
        setIndex: function(index) {
            this.element.css({
                zIndex: +this.option("css/zIndex") + (index || 0)
            });
            if (index) {
                this.element.addClass("focused");
            } else {
                this.element.removeClass("focused");
            }
            return this;
        },
        /**
     * 设置位置
     *
     * @method setPosition
     */
        setPosition: function() {
            this.mask && this.mask.setPosition();
            if (!this.option("baseElement")) {
                this.option("baseElement", this.document);
            }
            Dialog.superclass.setPosition.apply(this);
        },
        /**
     * 设置焦点
     *
     * @method focus
     * @param {Boolean} [fromMousedown] 是否通过鼠标获取焦点
     * @chainable
     */
        focus: function(fromMousedown) {
            var autofocus;
            if (dialogInTop) {
                dialogInTop.setIndex();
            }
            dialogInTop = this.setIndex(1);
            if (!fromMousedown) {
                autofocus = this.$("[autofocus]");
                autofocus.length ? autofocus.focus() : this.element.focus();
            }
            return this;
        },
        /**
     * 点击关闭按钮，或绑定关闭事件回调
     *
     * @param {Function} [callback] 事件回调函数
     * @method close
     */
        close: function(callback) {
            if (callback) {
                return this.on("close", callback);
            } else {
                /**
         * 通知关闭事件
         *
         * @event close
         * @param {object} e Event.
         */
                if (this.fire("close") !== false) {
                    this.hide();
                    handleDialogInTop(this, false);
                }
            }
        },
        /**
     * 初始化遮罩信息
     *
     * @method initMask
     * @private
     */
        initMask: function() {
            var self = this;
            // 遮罩层
            if (self.option("mask") && !self.mask) {
                self.mask = new Mask({
                    autoShow: self.option("effect") === "none",
                    baseElement: self.option("baseElement"),
                    container: self.element,
                    css: {
                        position: self.option("maskFixed") ? "fixed" : self.option("css/position")
                    },
                    delegates: {
                        keydown: function(e) {
                            e.keyCode === 27 && self.close();
                        },
                        click: function(e) {
                            // shaking
                            self.stop().animate({
                                left: "-=10"
                            }, 40).animate({
                                left: "+=20"
                            }, 80).animate({
                                left: "-=20"
                            }, 80).animate({
                                left: "+=10"
                            }, 40);
                        }
                    },
                    effect: self.option("effect"),
                    insert: function() {
                        this.container.before(this.element);
                    }
                });
                self.show(function() {
                    this.mask && this.mask.show();
                }).hide(function() {
                    this.mask && this.mask.hide();
                });
            }
        },
        render: function() {
            var self = this;
            dialogLocker.set(self.uniqueId, self);
            Dialog.superclass.render.apply(self);
            self.initMask();
            self.focus();
            return self;
        },
        /**
     * 销毁，或绑定销毁事件回调
     *
     * @param {Function} [callback] 事件回调函数
     * @method destroy
     */
        destroy: function(callback) {
            if (callback) {
                return this.on("destroy", callback);
            }
            // 先销毁遮罩层
            this.mask && this.mask.destroy();
            handleDialogInTop(this, true);
            Dialog.superclass.destroy.apply(this);
        }
    });
    module.exports = Dialog;
});

define("pandora/dialog/1.0.0/mask-debug", [ "$-debug", "pandora/overlay/1.0.0/overlay-debug", "pandora/widget/1.0.0/widget-debug", "pandora/base/1.0.0/base-debug", "pandora/class/1.0.0/class-debug", "pandora/events/1.0.0/events-debug" ], function(require, exports, module) {
    /**
   * 遮罩层
   *
   * @module Dialog
   */
    "use strict";
    var $ = require("$-debug"), Overlay = require("pandora/overlay/1.0.0/overlay-debug");
    /**
   * Mask
   * 遮罩层
   *
   * @class Mask
   * @extends Overlay
   * @constructor
   */
    var Mask = Overlay.extend({
        defaults: {
            /**
       * 实例化后是否自动显示
       *
       * @attribute autoShow
       * @default false
       * @type {Boolean}
       */
            autoShow: false,
            // classPrefix: 'ue-mask',
            css: {
                position: !!window.ActiveXObject && !window.XMLHttpRequest ? "absolute" : "fixed",
                left: 0,
                top: 0,
                width: "100%",
                height: "100%",
                background: "#000",
                opacity: .2
            }
        },
        setup: function() {
            var self = this, baseElement = self.option("baseElement");
            if (baseElement) {
                self.baseElement = $(baseElement);
            }
            // IE6
            if (!!window.ActiveXObject && !window.XMLHttpRequest) {
                $('<iframe src="about:blank"></iframe>').css({
                    width: "100%",
                    height: "100%",
                    opacity: 0
                }).appendTo(self.element);
            }
            Mask.superclass.setup.apply(self);
        },
        /**
     * 更新遮罩浮层位置
     *
     * @method setPosition
     */
        setPosition: function() {
            var self = this, baseElement = self.baseElement;
            function resize() {
                self.element.css({
                    width: 0,
                    height: 0
                }).css({
                    width: baseElement.outerWidth(),
                    height: baseElement.outerHeight()
                });
            }
            if (self.option("css/position") !== "fixed") {
                if (!baseElement) {
                    baseElement = $(self.document);
                }
                resize();
                $(self.viewport).on("resize" + self.delegateNS, resize);
            }
            Mask.superclass.setPosition.apply(self);
        },
        destroy: function() {
            $(this.viewport).off("resize" + this.delegateNS);
            Mask.superclass.destroy.apply(this);
        }
    });
    module.exports = Mask;
});

define("pandora/dialog/1.0.0/dialog-debug.css", [ "pandora/importstyle/1.0.0/importstyle-debug" ], function(require, exports, module) {
    var importStyle = require("pandora/importstyle/1.0.0/importstyle-debug");
    module.exports = function() {
        importStyle(".ue-dialog{left:0;top:0;min-width:320px;background:#fff;border-top:5px solid #333;border-radius:3px;box-shadow:0 5px 15px rgba(0,0,0,.5);-webkit-filter:grayscale(0.8) blur(2px)}.ue-dialog:focus{outline:0}.ue-dialog.focused{-webkit-filter:none}.ue-dialog .dialog-close{position:absolute;z-index:9;right:15px;top:15px;font-size:21px;font-weight:700;line-height:1;color:rgba(0,0,0,.2);text-shadow:0 1px 0 #fff;cursor:pointer;text-decoration:none}.ue-dialog .dialog-close:hover{color:rgba(0,0,0,.5);text-decoration:none;cursor:pointer}.ue-dialog .dialog-head{cursor:default;min-height:16.428571429px;border-bottom:1px solid #e5e5e5}.ue-dialog .dialog-title{cursor:default;margin:0;padding:15px 46px 15px 15px;font-size:18px;font-weight:500;line-height:21px}.ue-dialog .dialog-body{position:relative;padding:20px}.ue-dialog .dialog-foot{padding:19px 20px 20px;border-top:1px solid #e5e5e5;text-align:center}.ue-dialog .dialog-foot:empty{display:none}.ue-dialog .dialog-foot a{margin:0 5px}.ue-dialog .dialog-foot span{padding:6px 20px}.ue-dialog-tabs .dialog-head{padding-bottom:0;line-height:19px}.ue-dialog-tabs .dialog-head .nav-tabs{margin-bottom:0;border-bottom:0}.ue-dialog-tabs .dialog-head .nav>li>a{padding-top:5px;padding-bottom:5px}", "pandora/dialog/1.0.0/dialog.css");
    };
});

define("pandora/dialog/1.0.0/dialog-debug.handlebars", [ "gallery/handlebars/1.3.0/handlebars-runtime-debug" ], function(require, exports, module) {
    var Handlebars = require("gallery/handlebars/1.3.0/handlebars-runtime-debug");
    module.exports = Handlebars.template(function(Handlebars, depth0, helpers, partials, data) {
        this.compilerInfo = [ 4, ">= 1.0.0" ];
        helpers = helpers || {};
        for (var key in Handlebars.helpers) {
            helpers[key] = helpers[key] || Handlebars.helpers[key];
        }
        data = data || {};
        var buffer = "", stack1, helper, functionType = "function", self = this;
        function program1(depth0, data) {
            var buffer = "", stack1, helper;
            buffer += '\r\n<a class="dialog-close" href="javascript:" data-role="close">';
            if (helper = helpers.close) {
                stack1 = helper.call(depth0, {
                    hash: {},
                    data: data
                });
            } else {
                helper = depth0 && depth0.close;
                stack1 = typeof helper === functionType ? helper.call(depth0, {
                    hash: {},
                    data: data
                }) : helper;
            }
            if (stack1 || stack1 === 0) {
                buffer += stack1;
            }
            buffer += "</a>\r\n";
            return buffer;
        }
        function program3(depth0, data) {
            var buffer = "", stack1, helper;
            buffer += '\r\n<div class="dialog-head" data-role="head">\r\n  <h3 class="dialog-title" data-role="title">';
            if (helper = helpers.title) {
                stack1 = helper.call(depth0, {
                    hash: {},
                    data: data
                });
            } else {
                helper = depth0 && depth0.title;
                stack1 = typeof helper === functionType ? helper.call(depth0, {
                    hash: {},
                    data: data
                }) : helper;
            }
            if (stack1 || stack1 === 0) {
                buffer += stack1;
            }
            buffer += "</h3>\r\n</div>\r\n";
            return buffer;
        }
        function program5(depth0, data) {
            var buffer = "", stack1, helper;
            buffer += '\r\n<div class="dialog-foot" data-role="foot">\r\n  <a href="javascript:;" class="dialog-submit" data-role="submit">';
            if (helper = helpers.submit) {
                stack1 = helper.call(depth0, {
                    hash: {},
                    data: data
                });
            } else {
                helper = depth0 && depth0.submit;
                stack1 = typeof helper === functionType ? helper.call(depth0, {
                    hash: {},
                    data: data
                }) : helper;
            }
            if (stack1 || stack1 === 0) {
                buffer += stack1;
            }
            buffer += "</a>\r\n  ";
            stack1 = helpers["if"].call(depth0, depth0 && depth0.cancel, {
                hash: {},
                inverse: self.noop,
                fn: self.program(6, program6, data),
                data: data
            });
            if (stack1 || stack1 === 0) {
                buffer += stack1;
            }
            buffer += "\r\n</div>\r\n";
            return buffer;
        }
        function program6(depth0, data) {
            var buffer = "", stack1, helper;
            buffer += '\r\n  <a href="javascript:;" class="dialog-cancel" data-role="cancel">';
            if (helper = helpers.cancel) {
                stack1 = helper.call(depth0, {
                    hash: {},
                    data: data
                });
            } else {
                helper = depth0 && depth0.cancel;
                stack1 = typeof helper === functionType ? helper.call(depth0, {
                    hash: {},
                    data: data
                }) : helper;
            }
            if (stack1 || stack1 === 0) {
                buffer += stack1;
            }
            buffer += "</a>\r\n  ";
            return buffer;
        }
        stack1 = helpers["if"].call(depth0, depth0 && depth0.close, {
            hash: {},
            inverse: self.noop,
            fn: self.program(1, program1, data),
            data: data
        });
        if (stack1 || stack1 === 0) {
            buffer += stack1;
        }
        buffer += "\r\n";
        stack1 = helpers["if"].call(depth0, depth0 && depth0.title, {
            hash: {},
            inverse: self.noop,
            fn: self.program(3, program3, data),
            data: data
        });
        if (stack1 || stack1 === 0) {
            buffer += stack1;
        }
        buffer += '\r\n<div class="dialog-body" data-role="body">\r\n  <div class="dialog-content" data-role="content">';
        if (helper = helpers.content) {
            stack1 = helper.call(depth0, {
                hash: {},
                data: data
            });
        } else {
            helper = depth0 && depth0.content;
            stack1 = typeof helper === functionType ? helper.call(depth0, {
                hash: {},
                data: data
            }) : helper;
        }
        if (stack1 || stack1 === 0) {
            buffer += stack1;
        }
        buffer += "</div>\r\n</div>\r\n";
        stack1 = helpers["if"].call(depth0, depth0 && depth0.submit, {
            hash: {},
            inverse: self.noop,
            fn: self.program(5, program5, data),
            data: data
        });
        if (stack1 || stack1 === 0) {
            buffer += stack1;
        }
        buffer += "\r\n";
        return buffer;
    });
});
