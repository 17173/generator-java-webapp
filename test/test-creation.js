/*global describe, beforeEach, it*/
'use strict';

var path    = require('path');
var helpers = require('yeoman-generator').test;
//var assert = require('yeoman-generator').assert;


describe('java-webapp generator', function () {
    beforeEach(function (done) {
        helpers.testDirectory(path.join(__dirname, 'temp'), function (err) {
            if (err) {
                return done(err);
            }

            this.app = helpers.createGenerator('java-webapp:app', [
                '../../app'
            ]);
            this.pageUser = helpers.createGenerator('java-webapp:page', [
                '../../page'
            ], 'user');

            this.mockUserList = helpers.createGenerator('java-webapp:mock', [
                '../../mock'
            ], 'user/list.do');
            this.jsUserList = helpers.createGenerator('java-webapp:js', [
                '../../js'
            ], 'user/list');
            this.ftlUserList = helpers.createGenerator('java-webapp:ftl', [
                '../../ftl'
            ], 'user/list/index');
            done();
        }.bind(this));
    });

    it('create project', function (done) {
        var expected = [
            // add files you expect to exist here.
            '.jshintrc',
            'server.js',
            '.editorconfig'
        ];

        helpers.mockPrompt(this.app, {
            'someoption': true
        });
        this.app.options['skip-install'] = true;
        this.app.run({}, function () {
            helpers.assertFiles(expected);
            done();
        });
    });

    it('create moudle user files', function (done) {
        var expected = [
            // add files you expect to exist here.
            'mock/user.html.js',
            'src/app/user/index.js',
            'WEB-INF/template/ftl/admin/user/index.ftl'
        ];

        this.pageUser.run({}, function () {
            helpers.assertFiles(expected);
            done();
        });
    });

    it('create mock user/list.do', function (done) {
        var expected = [
            // add files you expect to exist here.
            'mock/user/list.do.js'
        ];

        this.mockUserList.run({}, function () {
            helpers.assertFiles(expected);
            done();
        });
    });

    it('create js user/list.js', function (done) {
        var expected = [
            // add files you expect to exist here.
            'src/app/user/list.js'
        ];

        this.jsUserList.run({}, function () {
            helpers.assertFiles(expected);
            done();
        });
    });

    it('create ftl user/list/index.ftl', function (done) {
        var expected = [
            // add files you expect to exist here.
            'WEB-INF/template/ftl/admin/user/list/index.ftl'
        ];

        this.ftlUserList.run({}, function () {
            helpers.assertFiles(expected);
            done();
        });
    });
});
