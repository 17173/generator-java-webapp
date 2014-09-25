define(function(require, exports, module) {

  'use strict';

  var $ = require('$');
  var Form = require('../../common/form/form');

  new Form({
    container: '#form1',
    url: '/testform',
    data: {
      groups: [
        {
          label: '用户名',
          attrs: {
            type: 'text'
          }
        }]
    }
  });

});
