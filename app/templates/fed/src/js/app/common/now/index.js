define(function(require, exports, module) {
  'use strict';
  var moment = require('moment');

  module.exports = {
    date: moment ? moment().format('YYYY-MM-DD H:mm:ss') : new Date()
  }
});
