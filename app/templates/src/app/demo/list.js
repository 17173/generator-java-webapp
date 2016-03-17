  'use strict';

  /**
   * 列表查询
   */

  var Search = require('../common/search/search');
  var io = require('../common/io');

  var DialogForm = require('./form');
  var formGroups = require('./groups');

  var opts = [
    '<a href="javascript:;" data-id="{{id}}" data-role="edit">编辑</a>',
    '<a href="javascript:;" data-id="{{id}}" data-role="del">删除</a>'
  ];

  var List = Search.extend({
    defaults: {
      element: '#contents',
      url: 'userList',
      delUrl: 'userDel',
      formCfg: {
        buttons: [{
          colspan: null,
          'class': 'pull-right',
          value: '<i class="fa fa-plus"></i> 新建员工',
          attrs: {
            type: 'button',
            'data-role': 'add'
          }
        }],
        data: {
          groups: [{
            colspan: null,
            attrs: {
              type: 'text',
              name: 'code',
              maxlength: 30,
              placeholder: '员工号'
            }
          }, {
            colspan: null,
            attrs: {
              type: 'text',
              name: 'name',
              maxlength: 50,
              placeholder: '名字'
            }
          }, {
            colspan: null,
            value: '<i class="fa fa-search"></i> 搜索',
            attrs: {
              type: 'submit'
            }
          }]
        }
      },
      gridCfg: {
        columns: [{
          key: 'code',
          name: '工号'
        }, {
          key: 'name',
          name: '名字'
        }, {
          name: '操作',
          template: opts.join('')
        }]
      },

      delegates: {
        'click [data-role=edit]': 'editRow',
        'click [data-role=add]': 'addRow'
      }
    },

    editRow: function(e) {
      io.get('userView', {id: e.currentTarget.dataset.id}, function() {
        new DialogForm({
          isEdit: true,
          title: '编辑员工',
          formOptions: {
            url: 'userUpdate',
            data: {
              groups: formGroups(this.data)
            }
          }
        });
      });
    },

    addRow: function() {
      new DialogForm({
        title: '新增员工',
        formOptions: {
          url: 'userAdd',
          data: {
            groups: formGroups()
          }

        }
      });
    }
  });

  module.exports = List;
