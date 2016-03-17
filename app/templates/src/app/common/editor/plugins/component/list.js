  'use strict';

  var List = require('../../../../component/instance/list'),
    renderMap = require('../../../../component/rendermap');

  module.exports = List.extend({

    defaults: {
      dataType: 'html',
      typeList: ['html'],
      defaultSelect : 'html',
      element: '<div></div>',
      keepHistory: false,
      selectable: 'single'
    },

    // override
    renderDataType: function() {
      this.form.name('dataType').parent().hide();
    },

    getGridColumns: function() {
      return [{
        name: '组件名称',
        key: 'componentName',
        template: '<span data-id="{{id}}">{{{ellipsis componentName ' + renderMap.NAME_SIZE + '}}}</span>'
      }, {
        name: '创建者',
        key: 'createUserName'
      }, {
        name: '创建时间',
        key: 'createTime',
        template: '{{dateFormat createTime "yyyy-MM-dd"}}'
      }/*, {
        name: '操作',
        template: [
          '<a href="javascript:" data-id="{{id}}" data-type="{{dataType}}" data-role="view">查看</a>',
          '<a href="javascript:" data-id="{{id}}" data-type="{{dataType}}" data-role="edit">修改</a>'
        ].join(' ')
      }*/];
    }

  });

