'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var chalk = require('chalk');

var JavaWebappGenerator = module.exports = function JavaWebappGenerator(args, options, config) {
    yeoman.generators.Base.apply(this, arguments);

    this.on('end', function () {
        //this.installDependencies({ skipInstall: options['skip-install'] });
        var info = chalk.yellow.bold("\nI'm all done. Please running bower install & npm install for you to install the required dependencies.")
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
            '\n   `---------´  |    ' + chalk.yellow.bold('Welcome to Yeoman') + ',    |' +
            '\n    ' + chalk.yellow('(') + ' _' + chalk.yellow('´U`') + '_ ' + chalk.yellow(')') + '   |   ' + chalk.yellow.bold('ladies and gentlemen!') + '  |' +  '\n    /___A___\\   \'__________________________\'' +
            '\n     ' + chalk.yellow('|  ~  |') +
            '\n   __' + chalk.yellow('\'.___.\'') + '__' +
            '\n ´   ' + chalk.red('`  |') + '° ' + chalk.red('´ Y') + ' `\n';

    console.log(welcome);
    console.log('This comes with seajs, jquery, and grunt all ready to go');

    if (this.options.promptDefaults) {
        this.name = this.options.promptDefaults.name;
        this.description = this.options.promptDefaults.description;
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
        default: ''
    }];

    this.prompt(prompts, function (props) {
        this.name = props.name;
        this.description = props.description;


        cb();
    }.bind(this));
};

JavaWebappGenerator.prototype.app = function app() {
    this.directory('scripts','scripts');
    this.directory('styles','styles');
    this.directory('images','images');

    this.directory('mock','mock');
    this.directory('WEB-INF','WEB-INF');

    this.template('config.json', 'config.json');
};

JavaWebappGenerator.prototype.grunt = function grunt() {
    this.template('_package.json', 'package.json');
    this.copy('Gruntfile.js', 'Gruntfile.js');
};

JavaWebappGenerator.prototype.bower = function bower() {
    this.template('.bowerrc', '.bowerrc');
    this.template('_bower.json', 'bower.json');
};

JavaWebappGenerator.prototype.configs = function configs() {
    this.template('editorconfig', '.editorconfig');
    this.template('jshintrc', '.jshintrc');
};
