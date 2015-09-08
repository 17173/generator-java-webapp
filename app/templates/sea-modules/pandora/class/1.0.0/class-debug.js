define("pandora/class/1.0.0/class-debug", [], function(require, exports, module) {
    /**
   * 类
   *
   * @module Class
   */
    "use strict";
    var inherit = function(Child, Parent) {
        // 不使用`new Parent()`，以避免引入非原型方法/属性
        var Bridge = function() {};
        Bridge.prototype = Parent.prototype;
        Child.prototype = new Bridge();
        Child.superclass = Parent.prototype;
        Child.prototype.constructor = Child;
    };
    var slice = Array.prototype.slice, unshift = Array.prototype.unshift;
    var mixin = function() {
        var args = slice.call(arguments, 0), target = args.shift(), source, p;
        while (source = args.shift()) {
            for (p in source) {
                // 保留属性 mixins
                if (p === "mixins") {
                    source[p].unshift(target);
                    mixin.apply(null, source[p]);
                } else {
                    target[p] = source[p];
                }
            }
        }
    };
    /**
   * 类，简单 OO 实现
   *
   * @class Class
   */
    var Class = function() {};
    Class.superclass = Class.prototype = {
        // constructor: Class,
        /**
     * 初始化方法，实例化时自动执行
     *
     * @method initialize
     */
        initialize: function() {},
        /**
     * 扩展实例方法/属性
     
     * @method extend
     * @param {Object} obj1 实例方法集
     * @param {Object} [objN] 实例方法集
     * @return {Object} 类实例
     *
     * @example
     * ```
     * var bob = new Person('Bob', 13);
     *
     * bob.extend({
     *   say: function () {
     *     console.log('My name is ' + this.name + '.');
     *     console.log('I\'m ' + this.age + ' years old.');
     *   }
     * });
     *
     * bob.say();
     * // My name is Bob.
     * // I'm 13 years old.
     * ```
     */
        extend: function() {
            Array.prototype.unshift.call(arguments, this);
            mixin.apply(null, arguments);
            return this;
        }
    };
    /**
   * 创建类
   * @constructor
   
   * @method create
   * @static
   * @param {Function} [Brood] 将要继承的父类（只继承其原型方法）
   * @param {Object} [Proto] 将要扩展的实例方法集
   * @param {Object} [ProtoN] 将要扩展的实例方法集
   * @return {Function} 类
   *
   * @example
   * ```
   * // 创建 `Person` 类
   * var Person = Class.create({
   *   initialize: function (name, age) {
   *     this.name = name;
   *     this.age = age;
   *   }
   * });
   *
   * // 创建 `Student` 类，不推荐采用这种方法;
   * // 推荐采用下文的静态方法 `SomeSuperClass.extend`
   * var Student = Class.create(Person, {
   *   initialize: function (name, age, school) {
   *     // `Student` 的 `superclass` 是 `Person`
   *     Student.superclass.initialize.apply(this, arguments);
   *     this.school = school;
   *   }
   * });
   *
   * var jack = new Person('Jack', 34);
   * // now:
   * // jack.name === 'Tom';
   * // jack.age === 34;
   * // jack.school === undefined;
   *
   * var tom = new Student('Tom', 21, 'MIT');
   * // now:
   * // tom.name === 'Tom';
   * // tom.age === 21;
   * // tom.school === 'MIT';
   * ```
   */
    Class.create = function() {
        var args = slice.call(arguments, 0), Dummy, Brood;
        Dummy = function() {
            this.initialize.apply(this, arguments);
        };
        if (args[0] && typeof args[0] === "function") {
            Brood = args.shift();
            // make sure Classes inherited from Class or Class's sub-classes
            if (!Brood.superclass) {
                inherit(Brood, Class);
            }
        } else {
            Brood = Class;
        }
        inherit(Dummy, Brood);
        if (args.length) {
            args.unshift(Dummy.prototype);
            mixin.apply(null, args);
        }
        /**
     * 扩展类
     *
     * @method extend
     * @static
     * @param {Object} [Proto] 将要扩展的实例方法集
     * @param {Object} [ProtoN] 将要扩展的实例方法集
     * @return {Function} 类
     *
     * @example
     * ```
     * // 创建 `Student` 类，从 `Persion` 类扩展
     * var Student = Person.extend({
     *   initialize: function (name, age, school) {
     *     // 调用父类的初始化方法，根据业务自由决定是否需要
     *     Student.superclass.initialize.apply(this, arguments);
     *     this.school = school;
     *   }
     * });
     * ```
     */
        Dummy.extend = function() {
            unshift.call(arguments, Dummy);
            return Class.create.apply(null, arguments);
        };
        return Dummy;
    };
    module.exports = Class;
});
