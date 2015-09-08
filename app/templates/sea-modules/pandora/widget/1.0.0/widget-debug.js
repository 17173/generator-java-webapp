define("pandora/widget/1.0.0/widget-debug", [ "$-debug", "pandora/base/1.0.0/base-debug", "pandora/class/1.0.0/class-debug", "pandora/events/1.0.0/events-debug", "./append-debug", "./autorender-debug", "./daparser-debug" ], function(require, exports, module) {
    /**
   * 组件基类
   *
   * @module Widget
   */
    "use strict";
    var $ = require("$-debug"), Base = require("pandora/base/1.0.0/base-debug");
    var append = require("./append-debug");
    var DELEGATE_REGEXP = /\{\{(.+?)\}\}/g, DELEGATE_DELIMITER = /^(\S+)\s*(.*)$/, DELEGATE_NS_PREFIX = ".delegate-widget-", DATA_WIDGET_UNIQUEID = "data-widget-uid";
    var cachedInstances = {};
    function each(obj, func) {
        var p;
        for (p in obj) {
            func.call(null, p, obj[p]);
        }
    }
    /**
   * 组件基类
   *
   * @class Widget
   * @constructor
   * @extends Base
   *
   * @example
   * ```
   * // 创建子类
   * var PersonWidget = Widget.extend({
   *   setup: function () {
   *     // 通知事件 `setup`
   *     this.fire('setup', this.option('name'), this.option('age'));
   *   }
   * });
   * // 创建子类实例
   * var tom = new PersonWidget({
   *   name: 'Tom',
   *   age: 21,
   *   // 订阅事件
   *   events: {
   *     // `setup`
   *     setup: function (e, name, age) {
   *       // e.type === 'setup'
   *       // name === 'Tom'
   *       // age === 21
   *       // this === tom
   *     },
   *     // AOP `before:setup`
   *     'before:setup': function (e) {
   *       // 执行 `setup` 方法前执行
   *       // 此处返回 `false` 将阻止 `setup` 方法执行
   *     },
   *     // AOP `after:setup`
   *     'after:setup': function (e) {
   *       // 执行 `setup` 方法后执行
   *       // 如果 `setup` 方法被阻止，就不会执行到这里
   *     }
   *   },
   *   // 代理事件
   *   delegates: {
   *     'click': function (e) {
   *       // e.target === this.element[0]
   *       // this === tom
   *     },
   *     'mouseover .avatar': function (e) {
   *       // 鼠标悬停在 element 里的 `.avatar` 元素
   *     }
   *   }
   * });
   * ```
   */
    var Widget = Base.extend({
        /**
     * 初始化函数，将自动执行；实现事件自动订阅与初始化组件参数
     *
     * @method initialize
     * @param {object} [options] 组件参数
     */
        initialize: function() {
            var self = this;
            Widget.superclass.initialize.apply(self, arguments);
            /**
       * 实例唯一ID
       *
       * @property {string} uniqueId
       */
            self.uniqueId = uniqueId();
            /**
       * 用于 DOM 事件绑定的 NAMESPACE
       *
       * @property {string} delegateNS
       */
            self.delegateNS = DELEGATE_NS_PREFIX + self.uniqueId;
            self.initCnE();
            self.initDelegates();
            self.setup();
            // 储存实例
            cachedInstances[self.uniqueId] = self;
        },
        /**
     * 默认参数，子类自动继承并覆盖
     *
     * @property {object} defaults
     * @type {object}
     */
        defaults: {
            /**
       * 容器，与 `insert` 配合使用，设置为 `null` 则不执行插入
       *
       * @attribute container
       * @type {String}
       * @default body
       */
            container: "body",
            /**
       * 主元素的className
       *
       * @attribute classPrefix
       * @type {String}
       * @default ue-component
       */
            classPrefix: "ue-component",
            /**
       * content 区域的 data-role 值，与 `children` 结合使用
       *
       * @attribute contentRole
       * @type {String}
       * @default content
       */
            contentRole: "content",
            /**
       * 需要设置到主元素的 CSS 样式
       *
       * @attribute css
       * @type {Object}
       * @default {}
       */
            css: {},
            /**
       * 需要设置到主元素的属性表
       *
       * @attribute attr
       * @type {Object}
       * @default {}
       */
            attr: {},
            /**
       * 组件的模板
       * @attribute template
       * @type {Function}
       * @default null
       */
            template: null,
            /**
       * template 执行时的options参数
       * @attribute templateOptions
       * @type {Object}
       * @default null
       */
            templateOptions: null,
            /**
       * 模板数据，与 `template` 结合使用
       *
       * @attribute data
       * @type {Object}
       * @default {}
       */
            data: {},
            /**
       * 配置事件代理
       *
       * @attribute delegates
       * @type {Object}
       * @default null
       */
            delegates: null,
            /**
       * widget 主元素
       *
       * @attribute element
       * @type {String}
       * @default <div></div>
       */
            element: "<div></div>",
            /**
       * 将主元素插入到 DOM
       *
       * @attribute insert
       * @type {Function}
       * @default 将主元素插入到 container 中
       */
            insert: function() {
                this.container.length && this.container.append(this.element);
            }
        },
        /**
     * 寻找 element 后代，参数为空时，返回 element
     *
     * @method $
     * @param {mixed} [selector] 选择符
     * @return {object} jquery 包装的 DOM 节点
     */
        $: function(selector) {
            return selector ? this.element.find(selector) : this.element;
        },
        /**
     * 等同于 instace.element.css
     *
     * @method css
     * @return {mixed} element 或 指定的 css 属性值
     */
        css: function() {
            return this.element.css.apply(this.element, arguments);
        },
        /**
     * 等同于 instace.element.attr
     *
     * @method attr
     * @return {mixed} element 或 指定的 attr 属性值
     */
        attr: function() {
            return this.element.attr.apply(this.element, arguments);
        },
        /**
     * 获取 role 对应的元素，通过 [data-role=xxx]
     *
     * @method role
     * @param {string} role 以逗号分隔的 data-role 的值
     * @return {jquery} DOM 节点
     */
        role: function(role) {
            return this.$(role.replace(/(?:^\b|\s*,\s*)([_0-9a-zA-Z\-]+)/g, ',[data-role="$1"]').substring(1));
        },
        /**
     * 获取模板 data，基于 `option` 方法
     *
     * @method data
     * @param {string} [key] 键
     * @param {mixed} [value] 值
     * @param {boolean} [override] 是否覆盖（即非深度复制）
     * @return {mixed} 整个 data 参数列表或指定参数值
     */
        data: function(key, value, override) {
            return this.option(key, value, "data", override);
        },
        /**
     * 初始化 `container` 与 `element`
     *
     * @method initCnE
     * @return {object} 当前实例
     */
        initCnE: function() {
            /**
       * 容器/插入参考点
       *
       * @property {object} container
       */
            this.container = $(this.option("container"));
            /**
       * 组件根元素
       *
       * @property {object} element
       */
            this.element = $(this.option("element")).attr(DATA_WIDGET_UNIQUEID, this.uniqueId).data("widget", this);
            return this;
        },
        /**
     * 初始化 `document` 与 `viewport`
     *
     * @method initDnV
     * @return {object} 当前实例
     */
        initDnV: function() {
            /**
       * `element` 所在的 `document` 对象
       *
       * @property {Document} document
       */
            this.document = this.element.prop("ownerDocument") || this.element[0];
            /**
       * `element` 所在的 `window` 对象
       *
       * @property {Window} viewport
       */
            this.viewport = function(doc) {
                return doc.defaultView || doc.parentWindow;
            }(this.document);
            return this;
        },
        /**
     * 事件代理，绑定在 element 上
     * TODO: 实现解除绑定
     *
     * @method initDelegates
     * @param {object|function} [delegates] 代理事件列表
     * @param {jquery} [element] 绑定代理事件的元素
     * @return {object} 当前实例
     */
        initDelegates: function(delegates, element) {
            var self = this;
            delegates || (delegates = self.option("delegates"));
            if (!delegates) {
                return self;
            }
            if (typeof delegates === "function") {
                delegates = delegates.call(self);
            }
            element = element ? $(element) : self.element;
            each(delegates, function(key, callback) {
                var match = key.replace(DELEGATE_REGEXP, function($0, $1) {
                    return self.option($1) || "";
                }).match(DELEGATE_DELIMITER), event = match[1] + self.delegateNS;
                if (typeof callback === "string") {
                    callback = self[callback];
                }
                if (match[2]) {
                    element.on(event, match[2], function() {
                        callback.apply(self, arguments);
                    });
                } else {
                    element.on(event, function() {
                        callback.apply(self, arguments);
                    });
                }
            });
            return self;
        },
        /**
     * 显示触发器
     *
     * @method initTrigger
     * @param {string} [trigger] 触发器
     * @return {object} 当前实例
     */
        initTrigger: function(trigger) {
            var self = this, delegates = {};
            trigger || (trigger = self.option("trigger"));
            if (!trigger) {
                return self;
            }
            delegates["click " + trigger] = function(e) {
                e.preventDefault();
                e.stopPropagation();
                self.activeTrigger = e.currentTarget;
                self.show();
            };
            self.initDelegates(delegates, self.document);
            // 如果有 trigger，则默认隐藏
            self.element.hide();
            return self;
        },
        /**
     * 自动执行的设置函数，预留用于子类覆盖
     *
     * @method setup
     */
        setup: function() {},
        /**
     * 自动执行的设置函数，预留用于子类覆盖
     *
     * @method initChildren
     * @private
     */
        initChildren: function(children) {
            children || (children = this.option("children"));
            if (children) {
                if (!this.rendered) {
                    this.initDnV();
                }
                append(this, children);
            }
        },
        /**
     * 解析内容，将 elemnt 插入到 container
     *
     * @method render
     * @return {object} 当前实例
     */
        render: function() {
            var self = this, html, template = self.option("template");
            self.element.addClass(self.option("classPrefix")).css(self.option("css") || {}).attr(self.option("attr") || {});
            // 处理模板与 content 为 text|html 的情况
            if (typeof template === "function") {
                html = template(self.data(), self.option("templateOptions"));
            } else {
                html = self.option("content");
            }
            if (typeof html !== "undefined") {
                self.element.html(html);
            }
            self.initChildren();
            if (!self.rendered) {
                // 插入到容器中
                self.option("insert").call(self);
                self.initDnV();
                self.initTrigger();
                self.rendered = true;
            }
            /**
       * 通知渲染
       *
       * @event render
       * @param {object} e Event.
       */
            self.fire("render");
            return self;
        },
        /**
     * 判断：显示状态等，参见 `jq` 的 `is`
     *
     * @example
     * ```
     * instance.is(':hidden')
     * ```
     *
     * @method is
     * @param {mixed} condition 判断语句
     * @return {boolean}
     */
        is: function(contidtion) {
            return this.element.is(contidtion);
        },
        /**
     * 显示，或绑定显示事件回调
     *
     * @method show
     * @param {function} [callback] 事件回调函数
     * @return {object} 当前实例
     */
        show: function(callback) {
            if (callback) {
                return this.on("show", callback);
            }
            if (!this.element) {
                return this;
            }
            this.element.show();
            /**
       * 通知显示
       *
       * @event show
       * @param {object} e Event.
       */
            this.fire("show");
            return this;
        },
        /**
     * 隐藏，或绑定隐藏事件回调
     *
     * @method hide
     * @param {function} [callback] 事件回调函数
     * @return {object} 当前实例
     */
        hide: function(callback) {
            if (callback) {
                return this.on("hide", callback);
            }
            if (!this.element) {
                return this;
            }
            this.element.hide();
            /**
       * 通知隐藏
       *
       * @event hide
       * @param {object} e Event.
       */
            this.fire("hide");
            return this;
        },
        /**
     * 销毁当前组件对象，或绑定销毁事件回调
     * @param {function} [callback] 事件回调函数
     * @method destroy
     */
        destroy: function(callback) {
            if (callback) {
                return this.on("destroy", callback);
            }
            /**
       * 通知销毁
       *
       * @event destroy
       * @param {object} e Event.
       */
            this.fire("destroy");
            if (this.element) {
                // 移除 element 事件代理
                this.element.add(this.document).add(this.viewport).off(this.delegateNS);
                // 从DOM中移除element
                this.element.remove();
            }
            Widget.superclass.destroy.apply(this);
        },
        /**
     * 通过元素获取对应的 widget 实例，同 Widget.get
     *
     * @method getWidget
     * @param {mixed} selector 元素选择符
     */
        getWidget: function(selector) {
            return Widget.get(selector);
        }
    });
    var uniqueId = function() {
        var ids = {};
        return function() {
            var id = Math.random().toString(36).substr(2);
            if (ids[id]) {
                return uniqueId();
            }
            ids[id] = true;
            return id;
        };
    }();
    // For memory leak, from aralejs
    $(window).unload(function() {
        var uid;
        for (uid in cachedInstances) {
            cachedInstances[uid].destroy();
        }
    });
    /**
   * 通过 element 取 widget 实例
   *
   * @method get
   * @return {mixed} selector
   * @static
   */
    Widget.get = function(selector) {
        var uid;
        selector = $(selector).eq(0);
        selector.length && (uid = selector.attr(DATA_WIDGET_UNIQUEID));
        return cachedInstances[uid];
    };
    /**
   * 自动渲染 widget
   *
   * @method autoRender
   * @static
   */
    Widget.autoRender = require("./autorender-debug");
    module.exports = Widget;
});

define("pandora/widget/1.0.0/append-debug", [], function(require, exports, module) {
    /**
   * 处理子组件（widget 的子类）
   *
   * @module Widget
   */
    "use strict";
    module.exports = function(parentWidget, children) {
        var roleContent, i, n, child, uniqueId = parentWidget.uniqueId;
        function createDummy() {
            var div = parentWidget.document.createElement("div");
            roleContent[0].appendChild(div);
            return div;
        }
        function replaceDummy() {
            /*jshint validthis:true */
            var dummy = this["dummy" + uniqueId];
            dummy.parentNode.replaceChild(this.element[0], dummy);
        }
        function eventBubbling(e) {
            return parentWidget.fire.apply(parentWidget, arguments);
        }
        if (children) {
            // 绑定销毁事件
            parentWidget.on("destroy", function(e) {
                var n;
                // 仅当 destroy 事件来自父时
                if (e.target === this) {
                    n = children.length;
                    while (n--) {
                        children[n].destroy();
                    }
                }
            });
            roleContent = parentWidget.role(parentWidget.option("contentRole"));
            if (roleContent.length === 0) {
                roleContent = parentWidget.element;
            }
            for (i = 0, n = children.length; i < n; i++) {
                child = children[i];
                // 自动冒泡事件
                child.on("all", eventBubbling);
                // 子组件已加载，直接插入
                if (child.rendered) {
                    roleContent.append(child.element);
                } else {
                    // 异步加载子 widget，添加占位符，保证顺序
                    child["dummy" + uniqueId] = createDummy();
                    child.once("render", replaceDummy);
                }
                child.parentWidget = parentWidget;
            }
        }
    };
});

define("pandora/widget/1.0.0/autorender-debug", [ "$-debug", "pandora/widget/1.0.0/daparser-debug" ], function(require, exports, module) {
    /**
   * 自动渲染 widget
   * 根据 data-widget 属性，自动渲染所有开启了 data-api 的 widget 组件
   *
   * @module Widget
   * @class AutoRender
   * @static
   * @param root 渲染的 dom 范围，默认是 body
   * @param callback 渲染后执行的回调
   */
    "use strict";
    var $ = require("$-debug");
    var daParser = require("pandora/widget/1.0.0/daparser-debug");
    var DATA_WIDGET = "data-widget", DATA_CONFIG = "data-config", DATA_WIDGET_API = "data-widget-api", DATA_WIDGET_AUTO_RENDERED = "data-widget-auto-rendered", DATA_WIDGET_ROLE = "data-widget-role";
    /**
   * 检查元素是否关闭 data-api
   *
   * @method isDataAPIOff
   * @private
   * @param element
   * @return {boolean}
   */
    function isDataAPIOff(element) {
        return element.getAttribute(DATA_WIDGET_API) === "off";
    }
    module.exports = function(root, callback) {
        var modules = [], elements = [];
        if (typeof root === "function") {
            callback = root;
            root = null;
        }
        root || (root = document.body);
        if (!(root instanceof $)) {
            root = $(root);
        }
        // 判断全局关闭
        if (isDataAPIOff(root[0])) {
            // 全局关闭，执行回调
            callback && callback(-1);
            return;
        }
        root.find("[" + DATA_WIDGET + "]").each(function(i, element) {
            var module;
            // 已经渲染过
            if (!element.getAttribute(DATA_WIDGET_AUTO_RENDERED)) {
                module = element.getAttribute(DATA_WIDGET).toLowerCase();
                if (seajs.data.alias[module]) {
                    // 判断单个关闭
                    if (!isDataAPIOff(element)) {
                        modules.push(module);
                        elements.push(element);
                    }
                }
            }
        });
        if (!modules.length) {
            // 没有模块，执行回调
            callback && callback(0);
            return;
        }
        //统计
        if (window.messageBus) {
            window.messageBus.fire("useModule", modules);
        }
        seajs.use(modules, function() {
            var i, n = arguments.length, element, options;
            for (i = 0; i < n; i++) {
                element = elements[i];
                options = daParser(element);
                // DATA_WIDGET_ROLE
                // 是指将当前的 DOM 作为 role 的属性去实例化，
                // 默认的 role 为 element
                options[element.getAttribute(DATA_WIDGET_ROLE) || "element"] = element;
                // 临时补丁，解决配置信息多的情况
                var iframe = $(".design-iframe")[0], CMS_WIDGET_CONFIG = window.CMS_WIDGET_CONFIG;
                if (iframe && iframe[0]) {
                    CMS_WIDGET_CONFIG = iframe[0].contentWindow.CMS_WIDGET_CONFIG;
                }
                if (CMS_WIDGET_CONFIG && CMS_WIDGET_CONFIG[modules[i]]) {
                    var dataConfig = element.getAttribute("data-config");
                    if (dataConfig) {
                        $.extend(options, CMS_WIDGET_CONFIG[modules[i]][dataConfig]);
                    }
                }
                // 调用自动渲染接口
                new arguments[i](options);
                // 标记已经渲染过
                element.setAttribute(DATA_WIDGET_AUTO_RENDERED, "true");
            }
            // 在所有自动渲染完成后，执行回调
            callback && callback(1);
        });
    };
});

define("pandora/widget/1.0.0/daparser-debug", [ "$-debug" ], function(require, exports, module) {
    /**
   * data api 解析器，
   * 提供对单个 element 的解析，
   * 得到某个 DOM 元素的 dataset，
   * 可用来初始化页面中的所有 Widget 组件。
   *
   * @module Widget
   * @class DAParser
   * @static
   * @param element
   * @param raw
   */
    "use strict";
    var $ = require("$-debug");
    var DATA_ATTR_PREFIX = "data-widget-";
    var DATA_ATTR_PREFIX_LENGTH = 12;
    var DATASET_PREFIX = "widget";
    var DATASET_PREFIX_LENGTH = 6;
    var RE_DASH_WORD = /-([a-z])/g;
    var JSON_LITERAL_PATTERN = /^\s*[\[{].*[\]}]\s*$/;
    var parseJSON = window.JSON ? JSON.parse : $.parseJSON;
    // 仅处理字母开头的，其他情况转换为小写："data-x-y-123-_A" --> xY-123-_a
    function camelCase(str) {
        return str.toLowerCase().replace(RE_DASH_WORD, function(all, letter) {
            return (letter + "").toUpperCase();
        });
    }
    function lcFirst(str) {
        return str.replace(/^[A-Z]/, function(letter) {
            return letter.toLowerCase();
        });
    }
    // 解析并归一化配置中的值
    function normalizeValues(data) {
        var key, val;
        for (key in data) {
            if (data.hasOwnProperty(key)) {
                val = data[key];
                if (typeof val !== "string") {
                    continue;
                }
                data[key] = JSON_LITERAL_PATTERN.test(val) ? normalizeValues(parseJSON(val.replace(/'/g, '"'))) : normalizeValue(val);
            }
        }
        return data;
    }
    // 将 'false' 转换为 false
    // 'true' 转换为 true
    // '3253.34' 转换为 3253.34
    function normalizeValue(val) {
        if (val.toLowerCase() === "false") {
            val = false;
        } else if (val.toLowerCase() === "true") {
            val = true;
        } else if (/\d/.test(val) && /[^a-z]/i.test(val)) {
            var number = parseFloat(val);
            if (number + "" === val) {
                val = number;
            }
        }
        return val;
    }
    function parseDatas(dataset) {
        var da = {}, name, trueName;
        for (name in dataset) {
            if (name.indexOf(DATASET_PREFIX) === 0) {
                trueName = name.substring(DATASET_PREFIX_LENGTH);
                if (trueName) {
                    da[lcFirst(trueName)] = dataset[name];
                }
            }
        }
        return da;
    }
    function parseAttrs(element) {
        var da = {}, attrs = element.attributes, i, len = attrs.length, attr, name;
        for (i = 0; i < len; i++) {
            attr = attrs[i];
            name = attr.name;
            if (name.indexOf(DATA_ATTR_PREFIX) === 0) {
                name = name.substring(DATA_ATTR_PREFIX_LENGTH);
                if (name) {
                    da[camelCase(name)] = attr.value;
                }
            }
        }
        return da;
    }
    module.exports = function(element, raw) {
        var da = {};
        // ref: https://developer.mozilla.org/en/DOM/element.dataset
        if (element.dataset) {
            da = parseDatas(element.dataset);
        } else {
            da = parseAttrs(element);
        }
        return raw ? da : normalizeValues(da);
    };
});
