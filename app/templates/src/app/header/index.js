define(function(require, exports, module) {
  'use strict';

  var $ = require('$');

  //var USER_DATA = window.USER_DATA;

  /**
   * 全站头部
   */

  var ct;

  $('#dropdownHandle').on('click', function() {
    if (!ct) {
      ct = this.parentNode;

      $(document).on('mousedown', function(e) {
        if (!ct.contains(e.target)) {
          ct.classList.remove('open');
        }
      });
    }

    ct.classList.add('open');
  });

  $('#logoutHandle').on('click', function() {
    // code

  });


});
