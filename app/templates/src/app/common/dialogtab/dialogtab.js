define(function(require, exports, module) {

  'use strict';

  var Confirm = require('confirm'),
    Tabs = require('tabs');

  /**
   * 弹窗图片库
   *
   * @module common/image/dialog
   * @class  Dialog
   * @constructor
   * @extends Confirm
   */
  var Dialog = Confirm.extend({

    defaults: {
      classPrefix: 'ue-dialog ue-dialog-tabs',
      css: {
        position: 'absolute',
        width: 930
      },
      data: {
        tabs: [],
        hasPanes: true
      },
      initialTab: 0,
      maskFixed: true,
      template: require('./dialogtab.handlebars')
    },

    setup: function() {
      // 初始化 tab 效果
      this.once('render', function() {
        this.initTabs();
      });

      Dialog.superclass.setup.apply(this);

      // this.watchHeight();
    },

    // watchHeight: function() {
    //   // select the target node
    //   var self = this;

    //   self.role('body')[0].addEventListener('DOMSubtreeModified', function(e) {
    //     console.log(e, arguments)
    //     self.setPosition();
    //   });
    // },

    initTabs: function() {
      var self = this;

      self.tabs = new Tabs({
        element: self.element,
        events: {
          all: function(e) {
            self.fire.apply(self, arguments);
          }
        },
        initialTab: self.option('initialTab')
      });
    }

  });

  module.exports = Dialog;

});
