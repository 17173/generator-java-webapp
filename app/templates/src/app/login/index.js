define(function(require, exports, module) {

  'use strict';

  var Alert = require('alert');

  var FixedForm = require('../common/form/fixedform');

  //var userLoginType = '1';

  function gotoIndex() {
    window.location.href = '/home.html?' + new Date().getTime();
  }

  if (window.USER_DATA.USER_CODE) {
    gotoIndex();
  } else {
    new FixedForm({
      container: '#ldap',
      url: 'login',
      customMessages: {
        username: {
          required: '请输入用户名'
        },
        password: {
          required: '请输入密码'
        }
      },
      data: {
        groups: [{
          colspan: 12,
          attrs: {
            type: 'text',
            name: 'username',
            placeholder: '用户名',
            autofocus: 'autofocus',
            value: '',
            required: 'required',
            maxlength: 50
          }
        }, {
          colspan: 12,
          attrs: {
            type: 'password',
            name: 'password',
            value: '',
            placeholder: '密码',
            required: 'required',
            maxlength: 50,
            onpaste: 'return false'
          }
        }, {
          colspan: 12,
          value: '登录',
          attrs: {
            type: 'submit',
            'class': 'btn btn-primary'
          }
        }]
      },
      events: {
        formData: function(e) {
          e.target.formData.append('userLoginType', '1');
        },
        done: function(e, data) {
          gotoIndex();
        },
        fail: function(e, error) {
          new Alert({
            content: error || '登录异常'
          });
        }
      }
    });
  }

});
