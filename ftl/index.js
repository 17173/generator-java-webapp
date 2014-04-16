'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');

var FtlGenerator = module.exports = function FtlGenerator(args, options, config) {
  // By calling `NamedBase` here, we get the argument to the subgenerator call
  // as `this.name`.
  yeoman.generators.NamedBase.apply(this, arguments);

  console.log('You called the ftl subgenerator with the argument ' + this.name + '.');
};

util.inherits(FtlGenerator, yeoman.generators.NamedBase);

FtlGenerator.prototype.files = function files() {
  this.template('page.ftl', path.join('WEB-INF/template/ftl/', this.name + '/index.ftl'));
};
