  'use strict';

  // TODO: 移走

  var Select = require('./select');

  module.exports = Select.extend({
    defaults: {
      maxWidth: 120,
      params: {
        channelId: window.CMS_USER_DATA.CHANNEL_ID,
        resultListType: 1,
        type: 2
      },
      url: 'categoryList',
      templateOptions: {
        helpers: {
          categoryName: function(text, level) {
            var blank = '';
            level = parseInt(level, 10);

            if (level > 1) {
              while (level > 1) {
                blank += '&nbsp;&nbsp;&nbsp;&nbsp;--';
                level--;
              }
              return blank + text;
            }
            return text;
          }
        },
        partials: {
          singleItem: require('./select-single-item.handlebars')
        }
      }
    },
    transformModel: function(model) {
      var value = parseInt(this.field.val(), 10);
      var ret = [];
      var pushNode = function(node) {
        node.selected = value === node.value;
        ret.push(node);

        if (node.children) {
          node.children.forEach(function(childNode) {
            pushNode(childNode);
          });
        }
      };

      model = transformToTreeNodes(model);

      // 再处理回简单结构的
      // TODO 直接在 transformToTreeNodes 处理
      model.forEach(function(node, index) {
        pushNode(node);
      });
      return ret;
    },
    // 重写 select
    // TODO select源进行更改,不重新调用 handlebars
    select: function(item) {
      var SELECT = 'selected';
      var self = this,
        datas = self.data('select'),
        index = +item.data('index'),
        i, l;
      if (datas[index].selected) {
        self.hideDropdown();
        return;
      }
      if (datas[index].disabled) {
        return;
      }
      self.text = datas[index].text;
      for (i = 0, l = datas.length; i < l; i++) {
        datas[i].selected = i === index;
      }
      self.activeInput = false;
      self.initValue();
      self.hideDropdown();
      self.role('select').removeClass('is-label');
      item.addClass(SELECT).siblings().removeClass(SELECT);
    }

  });

  /**
   * 转成树节点格式
   *
   */
  function transformToTreeNodes(sNodes) {
    var i, l, key = 'id',
      parentKey = 'pid',
      childKey = 'children';
    if (!key || key === '' || !sNodes) {
      return [];
    }

    var r = [];
    var tmpMap = [];
    for (i = 0, l = sNodes.length; i < l; i++) {
      sNodes[i].value = sNodes[i].id;
      sNodes[i].text = sNodes[i].name;
      tmpMap[sNodes[i][key]] = sNodes[i];
    }
    for (i = 0, l = sNodes.length; i < l; i++) {
      if (tmpMap[sNodes[i][parentKey]] && sNodes[i][key] != sNodes[i][parentKey]) {
        if (!tmpMap[sNodes[i][parentKey]][childKey]) {
          tmpMap[sNodes[i][parentKey]][childKey] = [];
        }
        tmpMap[sNodes[i][parentKey]][childKey].push(sNodes[i]);
      } else {
        r.push(sNodes[i]);
      }
    }
    return r;
  }
