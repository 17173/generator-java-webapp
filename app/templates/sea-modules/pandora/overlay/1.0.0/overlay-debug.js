define("pandora/overlay/1.0.0/overlay-debug", [ "$-debug", "pandora/widget/1.0.0/widget-debug", "pandora/base/1.0.0/base-debug", "pandora/class/1.0.0/class-debug", "pandora/events/1.0.0/events-debug" ], function(require, exports, module) {
    /**
 * 浮动层
 * @module Overlay
 */
    "use strict";
    var $ = require("$-debug"), Widget = require("pandora/widget/1.0.0/widget-debug");
    /**
 * Overlay
 * 浮动层基类，提供显示、隐藏、设定位置、以及动画效果等，通过扩展可实现alert、confirm、dialog、tips等功能。
 *
 * @class Overlay
 * @extends Widget
 * @constructor
 */
    var Overlay = Widget.extend({
        defaults: {
            /**
     * 实例化后是否自动显示
     *
     * @attribute autoShow
     * @default true
     * @type {Boolean}
     */
            autoShow: true,
            // baseElement: null,
            /**
     *原点位置，浮层以此点为参照点
     *
     * @attribute baseXY
     * @default {x:0,y:0}
     * @type {Object}
     */
            baseXY: {
                x: 0,
                y: 0
            },
            /**
     * 样式前缀
     *
     * @attribute classPrefix
     * @default ue-overlay
     * @type {String}
     */
            classPrefix: "ue-overlay",
            css: {
                height: "auto",
                position: "absolute",
                width: "auto",
                zIndex: 901
            },
            // 事件代理
            // delegates: { },
            /**
     * 浮动层显示隐藏时的动画效果，可以是fade或none
     *
     * @attribute effect
     * @default fade
     * @type {String}
     */
            effect: "fade",
            /**
     * 位置偏移，单位为像素
     *
     * @attribute offset
     * @default {x:0,y:0}
     * @type Object
     */
            offset: {
                x: 0,
                y: 0
            },
            /**
     * selfXY
     * @attribute selfXY
     * @default {x:0,y:0}
     * @type {Object}
     */
            selfXY: {
                x: 0,
                y: 0
            }
        },
        setup: function() {
            this.element.attr({
                tabIndex: -1
            }).css({
                visibility: "hidden"
            });
            this.render();
        },
        /**
   * 更新浮层位置（left 与 top）
   *
   * @method setPosition
   * @chainable
   */
        setPosition: function() {
            var self = this, left, top, baseElement = $(self.option("baseElement") || self.document), baseXY = self.option("baseXY"), baseOffset = baseElement.offset() || {
                left: 0,
                top: 0
            }, selfElement = self.element, selfXY = self.option("selfXY"), selfOffset = self.option("offset"), fixed = self.option("css/position") === "fixed";
            if (!fixed) {
                baseOffset.left += baseElement.scrollLeft();
                baseOffset.top += baseElement.scrollTop();
            }
            left = baseOffset.left + baseElement.outerWidth() * baseXY.x - selfElement.outerWidth() * selfXY.x + selfOffset.x;
            top = baseOffset.top + baseElement.outerHeight() * baseXY.y - selfElement.outerHeight() * selfXY.y + selfOffset.y;
            selfElement.css({
                left: Math.max(left, 0),
                top: Math.max(top, 0)
            });
            return self;
        },
        /**
   * 显示浮动层
   *
   * @method show
   * @param {Function} [callback] 显示后的回调方法
   * @return {Object} 类实例
   */
        show: function(callback) {
            if (callback) {
                return this.on("show", callback);
            }
            Overlay.EFFECTS[this.option("effect")].show.call(this, Overlay.superclass.show);
            return this;
        },
        /**
   * 隐藏浮动层
   *
   * @method hide
   * @param {Function} [callback] 隐藏后的回调方法
   * @chainable
   */
        hide: function(callback) {
            if (callback) {
                return this.on("hide", callback);
            }
            Overlay.EFFECTS[this.option("effect")].hide.call(this, Overlay.superclass.hide);
            return this;
        },
        /**
   * element 上添加动画效果,参数同jquery的animate方法
   *
   * @method animate
   * @chainable
   */
        animate: function() {
            this.element.animate.apply(this.element, arguments);
            return this;
        },
        /**
   * 停止 element 上的动画效果，并立即跳转到最终状态
   *
   * @method stop
   * @chainable
   */
        stop: function() {
            this.element.stop(false, true);
            return this;
        },
        render: function() {
            var self = this;
            Overlay.superclass.render.apply(self);
            // 设置位置
            self.setPosition();
            // window.setTimeout(function () {
            self.element.css({
                display: "none",
                visibility: "visible"
            });
            // }, 0);
            self.option("autoShow") && !self.option("trigger") && self.show();
            return self;
        }
    });
    Overlay.EFFECTS = {
        /**
   * 直接显示或隐藏，无过渡效果。
   *
   * @property Overlay.EFFECTS.none
   * @static
   * @private
   * @type {Object}
   */
        none: {
            show: function(callback) {
                callback.call(this);
            },
            hide: function(callback) {
                callback.call(this);
            }
        },
        /**
   * 浮动层以200毫秒渐隐或渐现。
   *
   * @property Overlay.EFFECTS.fade
   * @static
   * @private
   * @type {Object}
   */
        fade: {
            show: function(callback) {
                var self = this;
                self.element.fadeIn(200, function() {
                    callback.call(self);
                });
            },
            hide: function(callback) {
                var self = this;
                self.element.fadeOut(200, function() {
                    callback.call(self);
                });
            }
        }
    };
    module.exports = Overlay;
});
