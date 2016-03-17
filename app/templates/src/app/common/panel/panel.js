  /**
   * 带显示隐藏功能的 panel
   *
   * @module Panel
   */

  'use strict';

  var Widget = require('pandora-widget');

  /**
   * Panel
   *
   * @class Panel
   * @constructor
   */
  module.exports = Widget.extend({

    defaults: {
      classPrefix: 'panel-default',
      contentRole: 'panel-content',
      // data: {
      // title: '',
      // content: '',
      // footer: '',
      // },
      element: '<div class="ue-panel panel"></div>',
      foldable: true,
      template: require('./panel.handlebars')
    },

    setup: function() {
      var foldable = this.option('foldable'),
        buttons = this.option('buttons');

      if (foldable && !buttons) {
        this.initDelegates({
          'click [data-role=panel-heading]': function() {
            this.role('panel-content, panel-footer').toggle();
          }
        });
        this.element.addClass('panel-foldable');
      }

      this.data('foldable', foldable);
      this.data('buttons', buttons);
      this.data('title', this.option('title'));
      this.data('content', this.option('content'));
      this.data('footer', this.option('footer'));

      this.render();
    }

  });

