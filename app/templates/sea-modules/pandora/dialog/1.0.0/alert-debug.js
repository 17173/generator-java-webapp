define("pandora/dialog/1.0.0/alert-debug", [ "./dialog-debug", "pandora/overlay/1.0.0/overlay-debug", "$-debug", "pandora/widget/1.0.0/widget-debug", "pandora/base/1.0.0/base-debug", "pandora/class/1.0.0/class-debug", "pandora/events/1.0.0/events-debug", "pandora/locker/1.0.0/locker-debug", "./mask-debug" ], function(require, exports, module) {
    /**
   * 警告
   *
   * @module Dialog
   */
    "use strict";
    var Dialog = require("./dialog-debug");
    /**
   * Alert
   * 警告
   *
   * @class Alert
   * @extends Dialog
   * @constructor
   */
    var Alert = Dialog.extend({
        defaults: {
            /**
       * 是否显示遮罩层
       *
       * @attribute mask
       * @default true
       * @type {Boolean}
       */
            mask: true,
            data: {
                /**
         * 自定义操作按钮
         *
         * @attribute data.submit
         * @default <span class="btn btn-primary">确定</span>
         * @type {String}
         */
                submit: '<span class="btn btn-primary">确定</span>',
                /**
         * 标题
         *
         * @attribute data.title
         * @default 提示
         * @type {String}
         */
                title: "提示"
            },
            delegates: {
                "click [data-role=submit]": function() {
                    this.submit();
                }
            }
        },
        setup: function() {
            var self = this;
            if (!self.option("trigger")) {
                self.hide(function() {
                    this.destroy();
                });
            }
            Alert.superclass.setup.apply(self);
        },
        /**
     * 确定或绑定确定事件回调
     *
     * @param {Function} [callback] 事件回调函数
     * @method submit
     */
        submit: function(callback) {
            if (callback) {
                return this.on("submit", callback);
            } else {
                /**
         * 确定事件
         *
         * @event submit
         * @param {object} e Event.
         */
                if (this.fire("submit")) {
                    this.close();
                }
            }
        }
    });
    module.exports = Alert;
});
