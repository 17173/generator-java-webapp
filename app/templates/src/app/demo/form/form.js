define(function(require, exports, module) {
  'use strict';

  /**
   * 表单页
   */

  var Form = require('../../common/form/form');
  var Select = require('../../common/select/select');
  var Tags = require('../../common/tags/tags');
  var Editor = require('../../common/editor/editor');
  var ImageDialog = require('../../common/image/dialog');

  module.exports = Form.extend({
    defaults: {
      container: '#contents',
      data: {
        groups: [{
          label: '单行文本框',
          attrs: {
            type: 'text',
            name: 'pageName',
            placeholder: '',
            maxlength: 30,
            required: 'required'
          }
        }, {
          label: '单选框',
          groups: [{
            label: '普通页面',
            attrs: {
              type: 'radio',
              name: 'pageType',
              value: '1',
              placeholder: '',
              checked: true,
              required: 'required'
            }
          }, {
            label: '正文页面',
            attrs: {
              value: '2',
              placeholder: '',
              type: 'radio',
              name: 'pageType',
              required: 'required'
            }
          }]
        }, {
          label: 'tag 输入框',
          attrs: {
            type: 'text',
            name: 'keywords',
            maxlength: 200,
            value:'tag1,tag2',
            id: 'keywords',
            'data-role': 'normal',
            placeholder: ''
          }
        }, {
          label: '多行文本',
          attrs: {
            type: 'multiline',
            name: 'description',
            'data-role': 'normal',
            maxlength: 200,
            placeholder: ''
          }
        }, {
          label: '静态下拉框',
          attrs: {
            type: 'select',
            name: 'pageProp'
          },
          options: [{
            text: '电脑端',
            value: 'pc'
          }, {
            text: '移动端',
            value: 'mobile'
          }]
        }, {
          label: '动态下拉框',
          attrs: {
            type: 'hidden',
            name: 'dept'
          }
        }, {
          label: '多选框',
          groups: [{
            label: '选项1',
            attrs: {
              type: 'checkbox',
              name: 'needAuth',
              value: '0',
              placeholder: '',
              required: 'required'
            }
          }, {
            label: '选项2',
            attrs: {
              value: '1',
              placeholder: '',
              type: 'checkbox',
              name: 'needAuth',
              required: 'required'
            }
          }]
        }, {
          label: '图片上传',
          inline: true,
          attrs: {
            type: 'text',
            name: 'picUrl'
          }
        }, {
          label: '静态内容',
          value: '这是静态内容',
          attrs: {
            id: 'J_CreateWay'
          }
        }, {
          label: '编辑器',
          attrs: {
            type: 'multiline',
            id: 'editor'
          }
        }]
      },
      delegates: {

      },
      events: {
        render: function() {
          new Select({
            field: this.name('pageProp')
          });

          new Select({
            url: 'deptList',
            field: this.name('dept')
          });

          new Tags({
            field: this.name('keywords')
          });

          new Editor({
            selector: 'editor'
          });

          this.initUpload();
        }
      }
    },

    initUpload: function() {
      var self = this;
      this.name('picUrl').after('<button class="btn btn-default" data-role="upload">上传图片</button>');

      this.initDelegates({
        'click [data-role=upload]': function() {
          new ImageDialog({
            events: {
              processPic: function(e, data) {
                self.name('picUrl').val(data.remotePath);
                console.log(data);
              },
              // 上传也会返回processPic了
              complete: function(e, queueFile) {
                console.log(queueFile);
              }
            }
          });
        }
      });
    }

  });
});
