define(function(require, exports, module) {

'use strict';

var Widget = require('widget');

var Grid = Widget.extend({
  defaults: {
    container: null,
    data: {
      listData: []
    },
    delegates: {
      'click [data-role=remove]': function (e) {
        var data = this.listData[e.currentTarget.dataset.index];

        this.remove(data);

        this.fire('remove', data.id);
      }
    },
    template: require('./grid.handlebars')
  },

  setup: function () {
    this.render();

    this.listData = this.data('listData');
  },

  append: function (data) {
    var listData = this.listData,
        found = false;

    listData.forEach(function (row) {
      if (row.id === data.id) {
        found = true;
        return false;
      }
    });

    if (!found) {
      listData.push(data);
      this.render();
    }
  },

  remove: function (data) {
    var self = this,
        listData = self.listData;

    listData.forEach(function (row, i) {
      if (row.id === data.id) {
        listData.splice(i, 1);
        self.render();
      }
    });
  },

  getData: function () {
    // this.listData.forEach(function (item) {
    //   item.name = item.componentName;
    // });

    return this.listData;
  }

});

module.exports = Grid;

});
