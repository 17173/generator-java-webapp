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
  var name = this.name.split('/');
  var curPath = ['..'];
  var i = 1, len = name.length;

  this.incPath = '../inc/inc.ftl';

  if (len > 1) {
    for (i;i < len;i++) {
      curPath.push('..');
    }
    this.incPath = curPath.join('/') + '/inc/inc.ftl';
  }
  this.template('page.ftl', path.join('WEB-INF/template/ftl/admin/', this.name + '.ftl'));
};
