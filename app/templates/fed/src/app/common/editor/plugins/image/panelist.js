define(function (require, exports, module) {

'use strict';

var Widget = require('widget');

var matcher = {
    regexp: /<img\s+[^>]*?src="(.+?)"[^>]*>/gim,
    lookup: function (arr, item) {
      // id 转成字符串
      return (arr.indexOf(item.src) !== -1);
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
      'click [data-role=item]': function (e) {
        this.fire('select', this.dataItems[e.currentTarget.dataset.index]);
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
  }

});

});
