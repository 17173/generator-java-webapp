define(function (require, exports, module) {

/**
 * 上传
 *
 * @module Core
 */

'use strict';

var $ = require('$'),
    Widget = require('widget');

var Queue = require('./queue'),
    Select = require('./select'),
    Button = require('./button');

/**
 * Core
 *
 * @class Core
 * @extends {Class} Widget
 * @constructor
 */
var Core = Widget.extend({

  type: 'Core',

  defaults: {
    classPrefix: 'upload',

    formData: { },
    queueOptions: { },
    selectOptions: { },
    buttonOptions: { }
  },

  setup: function () {
    var self = this;

    self.initQueue();
    self.initSelect();
    self.initButton();

    self.option('children', [self.queue, self.select, self.button]);

    self.render();
  },

  initQueue: function () {
    var self = this,

      queueOptions = self.option('queueOptions');

    $.extend(true, queueOptions, {
      // container: self.element,
      url: self.option('url'),
      fileName: self.option('fileName'),
      events: {
        all: function (e) {
          // 事件传递
          self.fire.apply(self, arguments);
        },
        formData: function (e) {
          var formData = e.target.formData,
              optionFormData = self.option('formData'),
              key;

          for (key in optionFormData) {
            formData.append(key, optionFormData[key]);
          }
        },
        progress: function () {
          self.select.enable(false);
          self.button.enable(false);
        },
        done: function (e) {
          self.select.enable(this.getProgressFiles().length === 0);

          self.button.enable((this.getQueuedFiles().length ||
              this.getErrorFiles().length));

          self.complete(e.target);
        },
        fail: function () {
          self.select.enable(this.getProgressFiles().length === 0);

          self.button.enable(true);
        },
        queue: function () {
          self.button.enable(true);
        },
        empty: function () {
          self.button.enable(false);
        }
      }
    });

    self.queue = new Queue(queueOptions);
  },

  initSelect: function () {
    var self = this,

      selectOptions = self.option('selectOptions');

    $.extend(true, selectOptions, {
      // container: self.element,
      events: {
        all: function (e) {
          // 事件传递
          return self.fire.apply(self, arguments);
        },
        valid: function (e, file) {
          self.queue.append(file);
        },
        error: function (e, errorType, file) {
          console.warn('errorType: ', errorType, 'file: ', file);
        }
      }
    });

    self.select = new Select(selectOptions);
  },

  // 上传按钮
  initButton: function () {
    var self = this,
        buttonOptions = self.option('buttonOptions');

    $.extend(true, buttonOptions, {
      // container: self.element,
      delegates: {
        'click': function () {
          self.queue.submit();
        }
      },
      events: {
        all: function (e) {
          // 事件传递
          self.fire.apply(self, arguments);
        }
      }
    });

    self.button = new Button(buttonOptions);
  },

  complete: function (queueFile) {
    this.fire('complete', queueFile);
  }

});

module.exports = Core;

});
