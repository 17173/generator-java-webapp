'use strict';
var util = require('util');
var path = require('path');
var fs = require('fs');
var yeoman = require('yeoman-generator');

var PageGenerator = module.exports = function PageGenerator(args, options, config) {
    // By calling `NamedBase` here, we get the argument to the subgenerator call
    // as `this.name`.
    yeoman.generators.NamedBase.apply(this, arguments);

    console.log('You called the page subgenerator with the argument ' + this.name + '.');
};

util.inherits(PageGenerator, yeoman.generators.NamedBase);

PageGenerator.prototype.files = function files() {
    this.jsRoot = '${jsRoot}';
    // 可这样创建 admin/login
    this.template('app.js', path.join('scripts/app/', this.name + '/main.js'));
    this.template('package.json', path.join('scripts/app/', this.name + '/package.json'));
    this.template('page.ftl', path.join('WEB-INF/template/ftl/', this.name + '/index.ftl'));
};