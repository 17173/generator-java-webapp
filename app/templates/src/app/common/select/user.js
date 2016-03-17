/**
 * 用户数据选择下拉
 * @type {[type]}
 */
var Select = require('./select');

module.exports = Select.extend({
  defaults: {
    hasLabel: true,
    search: true,
    url: 'userList',
    params: {
    },
    sifterOptions: {
      fields: ['userName', 'userCode']
    }
  },

  transformModel: function(model) {
    var key = this.option('key') || {};

    model.forEach(function(item) {
      item.text =  item.userName + '(' + item.userCode + ')';
      item.value = '' + item.id;
    });
    return model;
  }

})
