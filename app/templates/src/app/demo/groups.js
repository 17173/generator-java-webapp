define(function(require, exports, module) {
  'use strict';

  /**
   * 表单字段
   */

  module.exports = function(data) {
    data || (data = {});
    return [{
      label: '员工号',
      colspan: 3,
      attrs: {
        type: 'text',
        name: 'code',
        required: 'required',
        maxlength: 30,
        value: data.code || ''
      }
    }, {
      label: '名字',
      colspan: 3,
      attrs: {
        type: 'text',
        name: 'name',
        maxlength: 200,
        value: data.name || ''
      }
    }];
  }
});
