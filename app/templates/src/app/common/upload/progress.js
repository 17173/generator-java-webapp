define(function(require, exports, module) {

  /**
   * 文件上传，HTML5 ONLY
   *
   * @module Upload
   */

  'use strict';

  var Widget = require('widget');

  /**
   * Progress
   *
   * @class Progress
   * @extends {Class} Widget
   * @constructor
   */
  var Progress = Widget.extend({

    type: 'Progress',

    defaults: {
      classPrefix: 'progress wait'
    },

    setup: function() {
      this.render();
    },

    set: function(progress) {
      this.element
        .removeClass('wait done fail')
        .width(progress * 100 + '%');
    },

    wait: function(text) {
      this.element
        .removeClass('done fail')
        .addClass('wait')
        .text(text);
    },

    done: function(text) {
      this.element
        .removeClass('wait fail')
        .addClass('done')
        .text(text);
    },

    fail: function(text) {
      this.element
        .removeClass('wait done')
        .addClass('fail')
        .text(text);
    }

  });

  module.exports = Progress;

});
