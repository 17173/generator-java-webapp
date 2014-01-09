'use strict';

var path = require('path');
var util = require('util');
var yeoman = require('yeoman-generator');

var MockGenerator = module.exports = function MockGenerator(args, options, config) {
  // By calling `NamedBase` here, we get the argument to the subgenerator call
  // as `this.name`.
  yeoman.generators.NamedBase.apply(this, arguments);

  console.log('You called the mock subgenerator with the argument ' + this.name + '.');
};

util.inherits(MockGenerator, yeoman.generators.NamedBase);

MockGenerator.prototype.files = function files() {
  this.template('mock.js', path.join('mock/', this._.slugify(this.name) + '.js'));
};
