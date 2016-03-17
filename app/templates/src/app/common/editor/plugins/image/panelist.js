  'use strict';

  var $ = require('jquery');
  var Confirm = require('pandora-confirm');
  var Widget = require('pandora-widget');

  var matcher = {
    regexp: /<img\s+[^>]*?src="(.+?)"[^>]*>/gim,
    lookup: function(arr, item) {
      // id 转成字符串
      return (arr.indexOf(item.src) !== -1);
    }
  };

  function itemExists(itemArr, item) {
    var isExists = false;

    itemArr.forEach(function(dataItem) {
      if (dataItem.src === item.src) {
        isExists = true;
        return false;
      }
      /* 只对比src即可
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
      }*/
    });

    return isExists;
  }

  var PaneList = Widget.extend({

    defaults: {
      container: null,
      data: {
        items: []
      },
      delegates: {
        'click [data-role=remove]': function(e) {
          var self = this,
            item = $(e.currentTarget).parents('[data-role=item]'),
            index = item[0].dataset.index;
          self.fire('remove', self.dataItems[index]);
          self.dataItems.splice(index, 1);
          self.render();
          e.stopPropagation();
        },
        /*
        'click [data-role=item1]': function(e) {
          var classList = e.currentTarget.classList;
          if (classList.contains('selected')) {
            return false;
          }
          classList.toggle('active');
        },*/

        'click [data-role=item]': function(e) {
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
            content: '确定要删除所有图片素材？',
            events: {
              'submit': function() {
                self.fire('removeAll', self.dataItems);
                self.dataItems = [];
                self.data('items', self.dataItems, true);
                self.render();
              }
            }
          });
        }
      },
      template: require('./panelist.handlebars')
    },

    setup: function() {
      var self = this;

      self.render();

      self.dataItems = self.data('items');
    },

    render: function() {
      var listBox = this.role('listBox');
      var hsBox = listBox && listBox.length;
      var top = hsBox ? listBox.scrollTop() : 0;
      PaneList.superclass.render.apply(this, arguments);
      this.role('listBox').scrollTop(top);
    },

    append: function(item) {
      var self = this,
        dataItems = self.dataItems;

      if (!itemExists(dataItems, item)) {
        dataItems.unshift(item);
        self.render();
      }
    },

    appendList: function(items) {
      var self = this;
      if (items && items.length) {
        self.data('items', items);
        self.render();
        self.dataItems = self.data('items');
      }
    },

    updateItem: function(data, oldSrc) {
      this.dataItems.forEach(function(item) {
        if (item.src == oldSrc) {
          item.src = data.src;
          item.alt = data.alt;
          item.width = data.width;
          item.height = data.height;
        }
      });
      this.render();
    },

    update: function(content) {
      var self = this,
        srcArray = [],
        match,
        contentChanged;

      if (self.pContent !== content) {

        while ((match = matcher.regexp.exec(content))) {
          srcArray.indexOf(match[1]) === -1 && srcArray.push(match[1]);
        }

        self.dataItems.forEach(function(item) {
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

    updateEditor: function(doc, data) {
      $('img[src="' + data.src + '"]', doc).each(function(i, item) {

        var selfDom = $(item);
        var parent = selfDom.parents('.p-image');
        parent.length ? parent.remove() : selfDom.remove();

      });
    }

  });

module.exports = PaneList;

