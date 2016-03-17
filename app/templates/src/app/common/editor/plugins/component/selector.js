  'use strict';

  var Confirm = require('pandora-confirm');

  var List = require('./list');

  var Selector = Confirm.extend({

    defaults: {
      css: {
        position: 'absolute',
        width: 640
      },
      maskFixed: true,
      title: '选择自定义组件'
    },

    setup: function() {
      this.list = new List({
        authType : 'instance',
        delegates: {
          'dblclick {{rowSelector}}': function(e) {
            this.parentWidget.submit();
          }
        },
        selectedIds: this.option('selectedIds')
      });

      this.option('children', [this.list]);

      Selector.superclass.setup.apply(this);
    }

  });

  module.exports = Selector;

