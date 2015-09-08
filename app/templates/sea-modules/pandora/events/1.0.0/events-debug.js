define("pandora/events/1.0.0/events-debug", [], function(require, exports, module) {
    /**
   * 事件
   * @module Events
   */
    "use strict";
    var EVENT_SPLITTER = /\s+/;
    function isObj(obj) {
        return !!(obj && Object.prototype.toString.call(obj) === "[object Object]" && obj.constructor && obj.constructor.prototype.hasOwnProperty && obj.constructor.prototype.hasOwnProperty("isPrototypeOf"));
    }
    /**
   * 事件类
   * 实现了事件订阅与发布
   * @example
   * ```
   * var events = new Events();
   * ```
   * @class Events
   * @constructor
   */
    var Events = function() {};
    Events.prototype = {
        /**
     * 绑定事件订阅
     * @example
     * ```
     * events.on('test', function (e, a) {
     *   // e.type === 'test'
     * });
     * events.on('test test2', function (e, a) {
     *   // e.type === 'test' or 'test2'
     * });
     * var testFunc = function (e, a) {
     *   // e.type === 'test'
     * };
     * events.on({
     *   test: testFunc
     * });
     * ```
     * @method on
     * @param {String|Object} event 事件名或哈希表
     * @param {Function} [callback] 回调函数
     * @return {Object} 当前实例
     */
        on: function(event, callback) {
            var cache = this.__events || (this.__events = {}), maps = {}, p, events, list;
            if (isObj(event)) {
                maps = event;
            } else {
                maps[event] = callback;
            }
            for (p in maps) {
                events = p.split(EVENT_SPLITTER);
                while (event = events.shift()) {
                    list = cache[event] || (cache[event] = []);
                    list.push(maps[p]);
                }
            }
            return this;
        },
        /**
     * 仅执行一次的事件订阅
     * @method once
     * @param {String} event 事件名
     * @param {Function} [callback] 回调函数
     * @return {Object} 当前实例
     */
        once: function(event, callback) {
            var cb = function() {
                this.off(event, cb);
                callback.apply(this, arguments);
            };
            return this.on(event, cb);
        },
        /**
     * 解除事件订阅
     * @example
     * ```
     * events.off('test');
     * events.off('test test2');
     * events.off('test', testFunc);
     * ```
     * @method off
     * @param {String} event 事件名
     * @param {Function} [callback] 回调函数
     * @return {Object} 当前实例
     */
        off: function(event, callback) {
            var cache = this.__events, events, list, i;
            if (!cache) {
                return this;
            }
            if (!event) {
                this.__events = {};
                return this;
            }
            events = event.split(EVENT_SPLITTER);
            while (event = events.shift()) {
                list = cache[event];
                if (!list) {
                    continue;
                }
                if (!callback) {
                    delete cache[event];
                }
                for (i = list.length; i >= 0; i--) {
                    if (list[i] === callback) {
                        list.splice(i, 1);
                    }
                }
            }
            return this;
        },
        /**
     * 触发绑定的事件，有别名：`emit` 与 `trigger`
     * @example
     * ```
     * events.fire('test', 'blah');
     * events.fire('test2', 'blah');
     * events.fire('test test2', 'blah');
     * ```
     * @method fire
     * @param {String} event 事件名
     * @return {Boolean} 如有事件函数返回值 `false`，则此方法返回值为 `false`
     */
        fire: function(event) {
            var cache = this.__events, args, events, newArgs, target, list, i, n, returned = true;
            if (!(cache && event)) {
                return returned;
            }
            args = Array.prototype.slice.call(arguments, 1);
            target = event.target || this;
            events = (event.type || event).split(EVENT_SPLITTER);
            while (event = events.shift()) {
                newArgs = [ {
                    type: event,
                    target: target
                } ].concat(args);
                if (event !== "all") {
                    list = cache[event];
                }
                if (!list) {
                    list = [];
                }
                // 加入 all
                list = list.concat(cache.all || []);
                for (i = 0, n = list.length; i < n; i++) {
                    list[i].apply(this, newArgs) === false && (returned = false);
                }
            }
            return returned;
        }
    };
    // alias
    Events.prototype.emit = Events.prototype.trigger = Events.prototype.fire;
    module.exports = Events;
});
