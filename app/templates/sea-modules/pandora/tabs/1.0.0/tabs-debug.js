define("pandora/tabs/1.0.0/tabs-debug", [ "$-debug", "pandora/widget/1.0.0/widget-debug", "pandora/base/1.0.0/base-debug", "pandora/class/1.0.0/class-debug", "pandora/events/1.0.0/events-debug", "./tabs-debug.handlebars" ], function(require, exports, module) {
    /**
   * 标签页切换
   *
   * @module Tabs
   */
    "use strict";
    var $ = require("$-debug"), Widget = require("pandora/widget/1.0.0/widget-debug");
    /**
   * 简单标签页切换，从页面已有DOM结构生成
   *
   * @class Tabs
   * @extend Widget
   * @constructor
   */
    var Tabs = Widget.extend({
        defaults: {
            /**
       * 主元素的className
       * @attribute classPrefix
       * @type {String}
       * @default ue-tabs
       */
            classPrefix: "ue-tabs",
            container: null,
            // container: 'body',
            data: {
                // tabs: []
                /**
         * 是否有内容窗格
         * @attribute data.hasPanes
         * @type {Boolean}
         * @default true
         */
                hasPanes: true
            },
            delegates: {
                "click [data-role=tab]": "slide"
            },
            /**
       * 把tabs渲染到选择器指定的DOM元素上
       *
       * @attribute element
       * @type {String}
       * @default undefined
       */
            // element: '<div></div>',
            // element: '.nav-tabs',
            /**
       * 实例化后默认选中的标签索引，从0开始。
       *
       * @attribute initialTab
       * @type {Number}
       * @default 0
       */
            initialTab: 0,
            /**
       * 选中时，面板的className
       *
       * @attribute paneClass
       * @type {String}
       * @default active in
       */
            paneClass: "active in",
            /**
       * 阻止 location.hash 变化
       *
       * @attribute preventDefault
       * @type {Boolean}
       * @default true
       */
            preventDefault: true,
            /**
       * 选中时，tab的className
       *
       * @attribute tabClass
       * @type {String}
       * @default active
       */
            tabClass: "active",
            template: require("./tabs-debug.handlebars")
        },
        setup: function() {
            var initialTab = this.option("initialTab");
            if (!this.data("tabs")) {
                this.option("template", null);
            }
            this.render();
            if (initialTab !== -1) {
                this.slide(initialTab);
            }
        },
        /**
     * 设置指定的tab为选中状态
     *
     * @method slide
     * @param  {Number|String|Event} e  当e为Number时，e代表要选中的索引号，e为String时，则选中hash等于e的tab。
     * @example
     * ```
     * var tabs = new Tabs({
     *   element: '.nav-tabs',
     *   initialTab : 2
     * });
     * tabs.slide(1);
     * tabs.slide('#detail');
     *
     * ```
     */
        slide: function(e) {
            var self = this, tabClass = self.option("tabClass"), paneClass = self.option("paneClass"), tab, pane, remote;
            if (typeof e === "number") {
                tab = self.role("tab").eq(e);
            } else if (typeof e === "string") {
                tab = self.role("tab").filter(function() {
                    return this.hash === e;
                });
            } else {
                tab = $(e.currentTarget);
                if (self.option("preventDefault")) {
                    e.preventDefault();
                }
            }
            tab.parent().addClass(tabClass).siblings((" " + tabClass).replace(/\s+/g, ".")).removeClass(tabClass);
            pane = self.role("pane").filter('[id="' + tab.prop("hash").substring(1) + '"]');
            if (pane.length === 0) {
                pane = $('[id="' + tab.prop("hash").substring(1) + '"]');
            }
            if (pane.length) {
                pane.addClass(paneClass).siblings((" " + paneClass).replace(/\s+/g, ".")).removeClass(paneClass);
                remote = pane.data("remote");
                if (remote) {
                    pane.removeData("remote");
                    pane.load(remote);
                }
            }
            self.activeTab = tab;
            self.activePane = pane;
            /**
       * tab选中事件，当切换或选中tab时触发。
       *
       * @event tab
       * @param {object} e Event.
       * @param {jquery} tab 当前选中的tab标签
       * @param {jquery} pane 当前选中的pane面板
       */
            self.fire("tab", tab, pane);
        }
    });
    module.exports = Tabs;
});

define("pandora/tabs/1.0.0/tabs-debug.handlebars", [ "gallery/handlebars/1.3.0/handlebars-runtime-debug" ], function(require, exports, module) {
    var Handlebars = require("gallery/handlebars/1.3.0/handlebars-runtime-debug");
    module.exports = Handlebars.template(function(Handlebars, depth0, helpers, partials, data) {
        this.compilerInfo = [ 4, ">= 1.0.0" ];
        helpers = helpers || {};
        for (var key in Handlebars.helpers) {
            helpers[key] = helpers[key] || Handlebars.helpers[key];
        }
        data = data || {};
        var buffer = "", stack1, functionType = "function", escapeExpression = this.escapeExpression, self = this;
        function program1(depth0, data) {
            var buffer = "", stack1, helper;
            buffer += '\r\n  <li><a href="#';
            if (helper = helpers.id) {
                stack1 = helper.call(depth0, {
                    hash: {},
                    data: data
                });
            } else {
                helper = depth0 && depth0.id;
                stack1 = typeof helper === functionType ? helper.call(depth0, {
                    hash: {},
                    data: data
                }) : helper;
            }
            buffer += escapeExpression(stack1) + '" data-role="tab">';
            if (helper = helpers.name) {
                stack1 = helper.call(depth0, {
                    hash: {},
                    data: data
                });
            } else {
                helper = depth0 && depth0.name;
                stack1 = typeof helper === functionType ? helper.call(depth0, {
                    hash: {},
                    data: data
                }) : helper;
            }
            if (stack1 || stack1 === 0) {
                buffer += stack1;
            }
            buffer += "</a></li>\r\n  ";
            return buffer;
        }
        function program3(depth0, data) {
            var buffer = "", stack1;
            buffer += '\r\n<div class="tab-content" data-role="panes">\r\n  ';
            stack1 = helpers.each.call(depth0, depth0 && depth0.tabs, {
                hash: {},
                inverse: self.noop,
                fn: self.program(4, program4, data),
                data: data
            });
            if (stack1 || stack1 === 0) {
                buffer += stack1;
            }
            buffer += "\r\n</div>\r\n";
            return buffer;
        }
        function program4(depth0, data) {
            var buffer = "", stack1, helper;
            buffer += '\r\n  <div class="tab-pane fade" id="';
            if (helper = helpers.id) {
                stack1 = helper.call(depth0, {
                    hash: {},
                    data: data
                });
            } else {
                helper = depth0 && depth0.id;
                stack1 = typeof helper === functionType ? helper.call(depth0, {
                    hash: {},
                    data: data
                }) : helper;
            }
            buffer += escapeExpression(stack1) + '" data-remote="';
            if (helper = helpers.url) {
                stack1 = helper.call(depth0, {
                    hash: {},
                    data: data
                });
            } else {
                helper = depth0 && depth0.url;
                stack1 = typeof helper === functionType ? helper.call(depth0, {
                    hash: {},
                    data: data
                }) : helper;
            }
            buffer += escapeExpression(stack1) + '" data-role="pane">';
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
            buffer += "</div>\r\n  ";
            return buffer;
        }
        buffer += '<ul class="nav nav-tabs" data-role="tabs">\r\n  ';
        stack1 = helpers.each.call(depth0, depth0 && depth0.tabs, {
            hash: {},
            inverse: self.noop,
            fn: self.program(1, program1, data),
            data: data
        });
        if (stack1 || stack1 === 0) {
            buffer += stack1;
        }
        buffer += "\r\n</ul>\r\n";
        stack1 = helpers["if"].call(depth0, depth0 && depth0.hasPanes, {
            hash: {},
            inverse: self.noop,
            fn: self.program(3, program3, data),
            data: data
        });
        if (stack1 || stack1 === 0) {
            buffer += stack1;
        }
        buffer += "\r\n";
        return buffer;
    });
});
