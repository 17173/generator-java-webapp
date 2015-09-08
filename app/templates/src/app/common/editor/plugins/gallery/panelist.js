define(function (require, exports, module) {

'use strict';

var $ = require('$');
var Confirm = require('confirm');
var Widget = require('widget');

var matcher = {
    regexp: /<div\s+[^>]*?cms\-component\-id="(.+?)"[^>]*><\/div>/gim,
    lookup: function (arr, item) {
      // id 转成字符串
      return (arr.indexOf('' + item.id) !== -1);
    }
  };

function itemExists (itemArr, item) {
  var isExists = false;

  itemArr.forEach(function (dataItem) {
    var key, catched = true;

    for (key in dataItem) {
      if (key === 'selected') {
        continue;
      }
      if (dataItem[key] !== item[key]) {
        catched = false;
        break;
      }
    }

    if (catched) {
      isExists = true;
      return false;
    }
  });

  return isExists;
}

module.exports = Widget.extend({

  defaults: {
    container: null,
    data: {
      items: [
      ]
    },
    delegates: {

      'click [data-role=remove]':function(e){
        var self = this,
          item = $(e.currentTarget).parents('[data-role=item]'),
          index = item[0].dataset.index;
        self.fire('remove', self.dataItems[index]);
        self.dataItems.splice(index, 1);
        self.render();
        e.stopPropagation();
      },

      'click [data-role=item]': function (e) {
        this.fire('select', this.dataItems[e.currentTarget.dataset.index]);
      },

      // 全部插入
      'click [data-role=appendAll]': function() {
        var self = this;
        self.fire('insertAll', self.dataItems);
        self.render();
      },

      // 全部删除
      'click [data-role=removeAll]': function(e) {
        var self = this;
        new Confirm({
          content : '确定要删除所有组图素材？',
          events : {
            'submit' : function(){
              self.fire('removeAll', self.dataItems);
              self.dataItems = [];
              self.data('items',self.dataItems,true);
              self.render();
            }
          }
        });
      }
    },
    template: require('./panelist.handlebars')
  },

  setup: function () {
    var self = this;

    self.render();

    self.dataItems = self.data('items');
  },

  append: function (item) {
    var self = this,
      dataItems = self.dataItems;

    if (!itemExists(dataItems, item)) {
      dataItems.push(item);
      self.render();
    }
  },

  appendList: function(items){
    var self = this;
    if(items && items.length){
      self.data('items', items);
      self.render();
      self.dataItems = self.data('items');
    }
  },

  update: function (content) {
    var self = this,
      srcArray = [],
      match,
      contentChanged;

    if (self.pContent !== content) {

      while ((match = matcher.regexp.exec(content))) {
        srcArray.indexOf(match[1]) === -1 && srcArray.push(match[1]);
      }

      self.dataItems.forEach(function (item) {
        if (srcArray.length && matcher.lookup(srcArray, item)) {
          if (!item.selected) {
            contentChanged = true;
            item.selected = true;
          }
        } else {
          if (item.selected) {
            contentChanged = true;
            item.selected = false;
          }
        }
      });

      contentChanged && self.render();

      self.pContent = content;
    }
  },

  updateEditor : function(doc, data){
    $('input[data-mce-component=gallery][data-mce-p-cms-component-id="'+ data.id +'"]', doc).each(function(i,item){
      $(item).remove();
    });
  }
});

});
