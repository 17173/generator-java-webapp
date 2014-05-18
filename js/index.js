'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');

var JsGenerator = module.exports = function JsGenerator(args, options, config) {
  // By calling `NamedBase` here, we get the argument to the subgenerator call
  // as `this.name`.
  yeoman.generators.NamedBase.apply(this, arguments);
};

util.inherits(JsGenerator, yeoman.generators.NamedBase);

JsGenerator.prototype.files = function files() {
  this.jsRoot = '${jsRoot}';
  this.template('app.js', path.join('src/js/app/', this.name + '/index.js'));
};
