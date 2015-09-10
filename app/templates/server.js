'use strict';

var livereload = require('livereload');
var spawn = require('child_process').spawn;

var globalCfg = require('./mock/_globals.json');
var ctx = globalCfg.ctx;
var port = ctx.split(':')[2];
var fed3 = process.platform === 'win32' ? 'fed3.cmd' : 'fed3';

var server = livereload.createServer({
  exts: ['js', 'css', 'less', 'png', 'gif', 'jpg', 'ftl'],
  originalPath: globalCfg.ctx
});
var paths = function() {
  return ['mock', 'src', 'WEB-INF'].map(function(path) {
    return __dirname + '/' + path;
  });
}();

var child = spawn(fed3, [
  'server',
  '-p', port,
  '-M', 'Mock',
  '--view-root', 'WEB-INF'
]);

child.stdout.on('data', function (data) {
  console.log('stdout: ' + data);
});

child.stderr.on('data', function (data) {
  console.log('stderr: ' + data);
});

child.on('close', function (code) {
  console.log('child process exited with code ' + code);
});

server.watch(paths);
