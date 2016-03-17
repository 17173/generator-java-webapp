  /**
   * 上传
   *
   * @module Upload
   */

  'use strict';

  var Widget = require('pandora-widget'),
    Tips = require('pandora-tips');

  var util = require('../util');

  var Queue = require('./queue'),
    Select = require('./select'),
    Button = require('../button/button');

  /**
   * 文件上传
   *
   * @class Upload
   * @extends {Class} Widget
   * @constructor
   */
  var Upload = Widget.extend({

    type: 'Upload',

    defaults: {
      classPrefix: 'upload',

      formData: {},
      queueOptions: {},
      selectOptions: {},
      buttonOptions: {
        data: {
          icon: 'upload',
          label: '确定上传'
        }
      }
    },

    setup: function() {
      var self = this;

      self.initQueue();
      self.initSelect();
      self.initButton();

      self.option('children', [self.queue, self.select, self.button]);

      self.render();
    },

    initQueue: function() {
      var self = this,

        queueOptions = self.option('queueOptions');

      util.copy(queueOptions, {
        // container: self.element,
        url: self.option('url'),
        fileName: self.option('fileName'),
        events: {
          formData: function(e) {
            var formData = e.target.formData,
              optionFormData = self.option('formData'),
              key;

            for (key in optionFormData) {
              formData.append(key, optionFormData[key]);
            }
          },
          progress: function() {
            self.select.enable(false);
            self.button.enable(false);
          },
          done: function(e) {
            self.select.enable(this.getProgressFiles().length === 0);

            self.button.enable((this.getQueuedFiles().length ||
              this.getErrorFiles().length));

            self.handleUploaded(e.target);
          },
          fail: function() {
            self.select.enable(this.getProgressFiles().length === 0);

            self.button.enable(true);
          },
          queue: function() {
            self.button.enable(true);
          },
          empty: function() {
            self.button.enable(false);
          }
        }
      });

      self.queue = new Queue(queueOptions);
    },

    initSelect: function() {
      var self = this,

        selectOptions = self.option('selectOptions');

      util.copy(selectOptions, {
        // container: self.element,
        events: {
          valid: function(e, file) {
            self.queue.append(file);
          },
          error: function(e, errorType, file) {
            new Tips({
              content: '文件 ' + file.name + ' ' + errorType
            });
            // console.warn('errorType: ', errorType, 'file: ', file);
          }
        }
      });

      self.select = new Select(selectOptions);

      if (!selectOptions.multiple) {
        self.queue.on('queue', function() {
          self.select.enable(false);
        });
        self.queue.on('empty', function() {
          self.select.enable(true);
        });
      }
    },

    // 上传按钮
    initButton: function() {
      var self = this,
        buttonOptions = self.option('buttonOptions');

      util.copy(buttonOptions, {
        delegates: {
          'click': function() {
            self.queue.submit();
          }
        }
      });

      self.button = new Button(buttonOptions);
    },

    handleUploaded: function(queueFile) {
      this.fire('complete', queueFile);
    }

  });

  module.exports = Upload;

