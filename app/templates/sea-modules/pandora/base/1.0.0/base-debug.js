define("pandora/base/1.0.0/base-debug", [ "pandora/class/1.0.0/class-debug", "pandora/events/1.0.0/events-debug", "$-debug", "./aspect-debug" ], function(require, exports, module) {
    /**
   * 基类
   *
   * @module Base
   */
    "use strict";
    var Class = require("pandora/class/1.0.0/class-debug"), Events = require("pandora/events/1.0.0/events-debug");
    var Aspect = require("./aspect-debug");
    function isArr(obj) {
        return Object.prototype.toString.call(obj) === "[object Array]";
    }
    function isObj(obj) {
        return !!(obj && Object.prototype.toString.call(obj) === "[object Object]" && obj.constructor && obj.constructor.prototype.hasOwnProperty && obj.constructor.prototype.hasOwnProperty("isPrototypeOf"));
    }
    function copy(target, source, override) {
        var p, obj, src, copyIsArray, clone;
        for (p in source) {
            obj = source[p];
            if (target === obj) {
                continue;
            }
            src = target[p];
            if (!override && ((copyIsArray = isArr(obj)) || isObj(obj))) {
                clone = copyIsArray ? src && isArr(src) ? src : [] : src && isObj(src) ? src : {};
                target[p] = copy(clone, obj, false);
            } else if (typeof obj !== "undefined") {
                target[p] = obj;
            }
        }
        return target;
    }
    function merge(instance, options) {
        var ret = {}, arr = [], obj, proto = instance.constructor.prototype;
        if (options) {
            arr.push(options);
        }
        while (proto) {
            if (proto.defaults) {
                arr.push(proto.defaults);
            }
            proto = proto.constructor.superclass;
        }
        while (obj = arr.pop()) {
            copy(ret, obj);
        }
        return ret;
    }
    function each(obj, func) {
        var p;
        for (p in obj) {
            func.call(null, p, obj[p]);
        }
    }
    /**
   * 基类
   *
   * 实现 事件订阅 与 Aspect (AOP)
   *
   * @class Base
   * @extends Class
   * @constructor
   * @uses Events
   * @uses Aspect
   *
   * @example
   * ```
   * // 创建子类
   * var SomeBase = Base.extend({
   *   someMethod: function () {
   *     this.fire('someEvent');
   *   }
   * });
   * // 实例化
   * var someBase = new SomeBase({
   *   events: {
   *     someEvent: function () {
   *       console.log('someEvent fired');
   *     }
   *   }
   * });
   * // 调用方法
   * someBase.someMethod();
   * // 控制台将输出：
   * // someEvent fired
   * ```
   */
    var Base = Class.create({
        /**
     * 初始化函数，将自动执行；执行参数初始化与订阅事件初始化
     *
     * @method initialize
     * @param {Object} options 参数
     */
        initialize: function(options) {
            Base.superclass.initialize.apply(this, arguments);
            // 初始化参数
            this.__options = merge(this, options);
            // 初始化订阅事件
            this.initEvents();
        },
        mixins: [ Events.prototype, Aspect.prototype ],
        /**
     * 默认参数，子类自动继承并覆盖
     *
     * @property {Object} defaults
     * @type {Object}
     */
        defaults: {},
        /**
     * 存取状态
     *
     * @method state
     * @param {Number} [state] 状态值
     * @return {Mixed} 当前状态值或当前实例
     */
        state: function(state) {
            if (typeof state === "undefined") {
                return this.__state;
            }
            this.__state = state;
            /**
       * 通知组件状态改变
       *
       * @event state
       * @param {object} e Event.
       * @param {number} state 状态值
       */
            this.fire("state", state);
            return this;
        },
        /**
     * 存取初始化后的数据/参数，支持多级存取，
     * 如：this.option('rules/remote') 对应于 { rules: { remote: ... } }
     *
     * @method option
     * @param {String} [key] 键
     * @param {Mixed} [value] 值
     * @param {String} [context] 上下文
     * @return {Mixed} 整个参数列表或指定参数值
     */
        /*jshint maxparams:4 */
        option: function(key, value, context, override) {
            var options = context ? this.__options[context] : this.__options;
            if (typeof key === "undefined") {
                return options;
            }
            function get() {
                var keyArr = key.split("/");
                while (key = keyArr.shift()) {
                    if (options.hasOwnProperty(key)) {
                        options = options[key];
                    } else {
                        return;
                    }
                }
                return options;
            }
            function set() {
                var keyMap = {};
                function recruit(obj, arr) {
                    key = arr.shift();
                    if (key) {
                        obj[key] = recruit({}, arr);
                        return obj;
                    }
                    return value;
                }
                recruit(keyMap, key.split("/"));
                copy(options, keyMap, override);
            }
            if (isObj(key)) {
                copy(options, key, override);
            } else {
                if (typeof value === "undefined") {
                    return get();
                } else {
                    set();
                }
            }
            return this;
        },
        /**
     * 事件订阅，以及AOP
     *
     * @method initEvents
     * @param {Object|Function} [events] 事件订阅列表
     * @return {Object} 当前实例
     */
        initEvents: function(events) {
            var self = this;
            events || (events = self.option("events"));
            if (!events) {
                return self;
            }
            each(events, function(event, callback) {
                var match;
                if (typeof callback === "string") {
                    callback = self[callback];
                }
                if (typeof callback !== "function") {
                    return true;
                }
                match = /^(before|after):(\w+)$/.exec(event);
                if (match) {
                    // AOP
                    self[match[1]](match[2], callback);
                } else {
                    // Subscriber
                    self.on(event, callback);
                }
            });
            return self;
        },
        /**
     * 销毁当前组件实例
     * @method destroy
     */
        destroy: function() {
            var prop;
            // 移除事件订阅
            this.off();
            // 移除属性
            for (prop in this) {
                if (this.hasOwnProperty(prop)) {
                    delete this[prop];
                }
            }
            this.destroy = function() {};
        }
    });
    module.exports = Base;
});

define("pandora/base/1.0.0/aspect-debug", [], function(require, exports, module) {
    /**
 * 基类
 *
 * @module Base
 */
    "use strict";
    /**
 * Aspect 在指定的方法执行前或执行后插入特定函数。
 *
 * http://http://en.wikipedia.org/wiki/Aspect-oriented_programming
 *
 * @class Aspect
 * @constructor
 */
    var Aspect = function() {};
    Aspect.prototype = {
        /**
   * 方法执行前执行，`callback`返回`false`则阻止原函数执行
   * @method before
   * @param {String} methodName 方法名
   * @param {Function} callback 回调函数
   * @return {Object} 当前实例
   */
        before: function(methodName, callback) {
            return wave.call(this, "before", methodName, callback);
        },
        /**
   * 方法执行后执行
   * @method after
   * @param {String} methodName 方法名
   * @param {Function} callback 回调函数
   * @return {Object} 当前实例
   */
        after: function(methodName, callback) {
            return wave.call(this, "after", methodName, callback);
        }
    };
    function wave(when, methodName, callback) {
        /*jshint validthis: true*/
        var method = this[methodName];
        if (method) {
            if (!method.__aspected) {
                wrap.call(this, methodName);
            }
            this.on(when + ":" + methodName, callback);
        }
        return this;
    }
    function wrap(methodName) {
        /*jshint validthis: true*/
        var method = this[methodName];
        this[methodName] = function() {
            var args = Array.prototype.slice.call(arguments), result;
            // before
            if (this.fire.apply(this, [ "before:" + methodName ].concat(args)) === false) {
                return;
            }
            // method
            result = method.apply(this, arguments);
            // after
            this.fire.apply(this, [ "after:" + methodName, result ].concat(args));
            return result;
        };
        this[methodName].__aspected = true;
    }
    module.exports = Aspect;
});
