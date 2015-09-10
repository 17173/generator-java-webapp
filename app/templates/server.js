'use strict';

var livereload = require('livereload');
var spawn = require('child_process').spawn;

var globalCfg = require('./mock/_globals.json');
var ctx = globalCfg.ctx;
var port = ctx.split(':')[2];

var server = livereload.createServer({
  exts: ['js', 'css', 'less', 'png', 'gif', 'jpg', 'ftl'],
  originalPath: globalCfg.ctx
});
var paths = function() {
  return ['mock', 'src', 'WEB-INF'].map(function(path) {
    return __dirname + '/' + path;
  });
}();

var fed = spawn('fed3', [
  'server',
  '-p', port,
  '-M', 'Mock',
  '--view-root', 'WEB-INF'
]);

fed.stdout.on('data', function (data) {
  console.log('stdout: ' + data);
});

fed.stderr.on('data', function (data) {
  console.log('stderr: ' + data);
});

fed.on('close', function (code) {
  console.log('child process exited with code ' + code);
});

server.watch(paths);
