define(function(require, exports, module) {
  'use strict';
  var io = require('../common/io');

  io.get('/test/data', function() {
    var text = this.data.text;

    console.log(text)
  })
});
