'use strict';

var livereload = require('livereload');
var spawn = require('child_process').spawn;

var server = livereload.createServer({
  exts: ['js', 'css', 'less', 'png', 'gif', 'jpg', 'ftl'],
  originalPath: 'http://127.0.0.1:3001'
});
var paths = function() {
  return ['mock', 'src', 'WEB-INF'].map(function(path) {
    return __dirname + '/' + path;
  });
}();

var fed = spawn('fed3', [
  'server',
  '-p', '3001',
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
