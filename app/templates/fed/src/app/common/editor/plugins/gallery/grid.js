define(function(require, exports, module) {

'use strict';

var Widget = require('widget'),
  moment = require('moment');

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

        this.fire('remove', data.componentId);
      }
    },
    template: require('./grid.handlebars'),
    templateOptions: {
      helpers: {
        fdate: function(createTime) {
          return moment(createTime).format('YYYY-MM-DD');
        }
      }
    }
  },

  setup: function () {
    this.render();

    this.listData = this.data('listData');
  },

  append: function (data) {
    var listData = this.listData,
        found = false;

    listData.forEach(function (row) {
      if (row.componentId === data.componentId) {
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
      if (row.componentId === data.componentId) {
        listData.splice(i, 1);
        self.render();
      }
    });
  },

  getData: function () {
    return this.listData.map(function (row) {
      return {
        id: row.componentId,
        name: row.componentName
      }
    });
  }

});

module.exports = Grid;

});
