'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');


var JavaWebappGenerator = module.exports = function JavaWebappGenerator(args, options, config) {
  yeoman.generators.Base.apply(this, arguments);

  this.on('end', function () {
    this.installDependencies({ skipInstall: options['skip-install'] });
  });

  this.pkg = JSON.parse(this.readFileAsString(path.join(__dirname, '../package.json')));
};

util.inherits(JavaWebappGenerator, yeoman.generators.Base);

JavaWebappGenerator.prototype.askFor = function askFor() {
  var cb = this.async();

  // have Yeoman greet the user.
  console.log(this.yeoman);

  var prompts = [{
    type: 'confirm',
    name: 'someOption',
    message: 'Would you like to enable this option?',
    default: true
  }];

  this.prompt(prompts, function (props) {
    this.someOption = props.someOption;

    cb();
  }.bind(this));
};

JavaWebappGenerator.prototype.app = function app() {
  this.mkdir('webapp');

  this.mkdir('webapp/admin');
  this.mkdir('webapp/admin/static');
  this.mkdir('webapp/admin/static/js');
  this.mkdir('webapp/admin/static/css');
  this.mkdir('webapp/admin/static/img');

  this.mkdir('webapp/cdn');



  this.template('_package.json', 'package.json');
  this.template('_bower.json', 'bower.json');
  this.template('config.json', 'config.json');
};

JavaWebappGenerator.prototype.projectfiles = function projectfiles() {
  this.copy('editorconfig', '.editorconfig');
  this.copy('jshintrc', '.jshintrc');
};
