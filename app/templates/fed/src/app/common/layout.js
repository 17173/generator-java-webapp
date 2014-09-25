define(function(require, exports, module) {

  'use strict';

  var $ = require('$');

  var app = {
    init: function() {
      this.initEvents();
    },
    initEvents: function() {
      $('[data-toggle-state=aside-collapsed]').on('click', function() {
        $('body').toggleClass('aside-collapsed');
      });

      $('[data-toggle=collapse-next]').on('click', function() {
        $(this).next().toggleClass('in');
      });
    }
  };

  app.init();

});
