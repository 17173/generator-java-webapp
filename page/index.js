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
  /*var name = this.name.split('/');
  var path = ['..'];
  var i = 1, len = name.length;
  if (len > 1) {
    for (i;i < len;i++) {
      path.push('..');
    }
    this.incPath = path.join('/') + '/inc/inc.ftl';
  } else {
    this.incPath = '../inc/inc.ftl';
  }*/

  this.template('app.js', path.join('src/app/', this.name + '/index.js'));
  this.template('page.ftl', path.join('WEB-INF/template/ftl/admin/', this.name + '/index.ftl'));
  this.template('mock.js', path.join('mock/', this.name + '.html.js'));
};
