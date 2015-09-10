'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var chalk = require('chalk');

var JavaWebappGenerator = module.exports = function JavaWebappGenerator(args, options, config) {
  yeoman.generators.Base.apply(this, arguments);

  this.on('end', function () {
    //this.installDependencies({ skipInstall: options['skip-install'] });
    var info = chalk.yellow.bold("\nI'm all done. Please running spm install & npm install for you to install the required dependencies.")
    console.log(info);
  });

  this.pkg = JSON.parse(this.readFileAsString(path.join(__dirname, '../package.json')));
};

util.inherits(JavaWebappGenerator, yeoman.generators.NamedBase);

JavaWebappGenerator.prototype.askFor = function askFor() {
  var cb = this.async();

  // welcome message
  var welcome =
    '\n     _-----_' +
      '\n    |       |' +
      '\n    |' + chalk.red('--(o)--') + '|   .--------------------------.' +
      '\n   `---------´  |    ' + chalk.yellow.bold('Welcome to yo java-webapp') + ', |' +
      '\n    ' + chalk.yellow('(') + ' _' + chalk.yellow('´U`') + '_ ' + chalk.yellow(')') + '   |   ' + chalk.yellow.bold('ladies and gentlemen!') + '  |' +  '\n    /___A___\\   \'__________________________\'' +
      '\n     ' + chalk.yellow('|  ~  |') +
      '\n   __' + chalk.yellow('\'.___.\'') + '__' +
      '\n ´   ' + chalk.red('`  |') + '° ' + chalk.red('´ Y') + ' `\n';

  console.log(welcome);
  console.log('This comes with seajs, pandora, and grunt all ready to go');

  if (this.options.promptDefaults) {
    this.name = this.options.promptDefaults.name;
    this.description = this.options.promptDefaults.description;
    this.version = this.options.promptDefaults.version;
    cb();
    return;
  }

  var prompts = [{
    name: 'name',
    message: 'What is the name of your project?',
    default: this.appname
  }, {
    name: 'description',
    message: 'Your project description',
    default: 'backend system'
  }, {
    name: 'version',
    message: 'Your project version',
    default: '1.0.0'
  }];

  this.prompt(prompts, function (props) {
    this.name = props.name;
    this.description = props.description;
    this.version = props.version;

    cb();
  }.bind(this));
};

JavaWebappGenerator.prototype.allfile = function allfile() {
  this.spmAlias = '<%= pkg.spm.alias %>';
  this.jsBanner = '/*! <%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyymmdd") %> */\n';
  this.buildVersion = '<%= grunt.template.today("yyyymmddHHMM") %>';
  this.copyright = '<%= grunt.template.today("yyyy") %>-V<%= pkg.version %>';

  this.directory('mock','mock');
  this.directory('WEB-INF','WEB-INF');
  this.directory('src','src');

  this.template('_package.json', 'package.json');
  this.template('_gruntfile.js', 'Gruntfile.js');
  this.template('README.md', 'README.md');
  this.template('.editorconfig', '.editorconfig');
  this.template('.jshintrc', '.jshintrc');
  this.template('.jshintignore', '.jshintignore');
};


