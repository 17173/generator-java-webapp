'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');

var PageGenerator = module.exports = function PageGenerator(args, options, config) {
    // By calling `NamedBase` here, we get the argument to the subgenerator call
    // as `this.name`.
    yeoman.generators.NamedBase.apply(this, arguments);

    console.log('You called the page subgenerator with the argument ' + this.name + '.');
};

util.inherits(PageGenerator, yeoman.generators.NamedBase);

PageGenerator.prototype.files = function files() {
    // 定义后台 js 路径为 freemarker 定义的变量
    this.template('config.json', this._.slugify(this.name) + '.json');
};
