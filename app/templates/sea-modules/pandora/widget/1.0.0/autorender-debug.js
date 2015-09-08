define("pandora/widget/1.0.0/autorender-debug", [ "$-debug", "./daparser-debug" ], function(require, exports, module) {
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
    var daParser = require("./daparser-debug");
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
