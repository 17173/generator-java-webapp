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
    // 可这样创建 admin/inc
    this.template('inc/footer.ftl', path.join('WEB-INF/template/ftl/', this.name + '/footer.ftl'));
    this.template('inc/header.ftl', path.join('WEB-INF/template/ftl/', this.name + '/header.ftl'));
    this.template('inc/inc.ftl', path.join('WEB-INF/template/ftl/', this.name + '/inc.ftl'));
};
