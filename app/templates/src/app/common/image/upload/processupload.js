define(function(require, exports, module) {

  /**
   * 图片上传
   *
   * @module ImageUpload
   */

  'use strict';

  var Button = require('../../button/button'),
    Setting = require('../../magickimg/setting'),
    Process = require('../../magickimg/process');

  var Upload = require('./upload');

  /**
   * 带处理功能的图片上传
   *
   * @class ProcessUpload
   * @constructor
   */
  var ProcessUpload = Upload.extend({

    setup: function() {
      this.on({
        render: function(e) {
          var target = e.target;
          if (target.type === 'File') {
            // 设置单个处理
            this.initFileSetting(target);
            // 刷新批量处理设置项过滤数据
            this.setQueueFilterData();
          }
        },
        destroy: function(e) {
          var target = e.target;
          if (target.type === 'File') {
            // 删除文件设置
            target.setting && target.setting.destroy();
          }
        }
      });

      ProcessUpload.superclass.setup.apply(this);

      // 设置批量处理
      this.initBatchSetting();
      // 添加提交参数
      this.initFileFormData();
    },

    // OVERRIDE
    handleUploaded: function(queueFile) {
      var self = this,
        setting = self.queue.setting,
        settings,
        watermarkData;

      if (setting.is(':hidden')) {
        setting = queueFile.setting;
      }

      settings = setting.get() || {};

      if (!self.option('hasWatermark')) {
        self.fire('complete', queueFile);
        return;
      }

      if (queueFile.progress) {
        queueFile.progress.wait('处理中……');
      }

      setting.watermarkSelect.data('select')
        .some(function(item) {
          if (item.selected) {
            watermarkData = item;
            return true;
          }
          return false;
        });

      // 魔图
      new Process({
        imageUrl: queueFile.data('remotePath'),
        settings: settings,
        sourceData: {
          width: queueFile.data('width'),
          height: queueFile.data('height')
        },
        watermarkData: watermarkData,
        events: {
          complete: function(e, thumbUrl) {
            if (queueFile.progress) {
              queueFile.progress.done('处理完毕');
            }
            queueFile.data('thumbUrl', thumbUrl);
            self.fire('complete', queueFile, settings);
          },
          error: function(e, msg) {
            if (queueFile.progress) {
              queueFile.progress.fail('处理失败');
            }
            self.fire('error', msg);
          }
        }
      });
    },

    initBatchSetting: function() {
      var self = this,
        queue = self.queue;

      queue.batch = new Button({
        container: self.select.element,
        data: {
          icon: 'square-o',
          label: '批量处理'
        },
        delegates: {
          'click': function() {
            if (this.is(':disabled')) {
              return;
            }

            if (queue.setting.is(':hidden')) {
              queue.setting.show();
            } else {
              queue.setting.hide();
            }
          }
        },
        insert: function() {
          this.container.after(this.element);
        }
      });

      if (this.option('hideBatch')) {
        queue.batch.hide();
      }

      queue.on({
        queue: function() {
          this.batch.enable(true);
        },
        empty: function() {
          this.batch.enable(false);
          this.setting.hide();
        }
      });
      queue.setting = new Setting({
        container: queue.element,
        defaultWidth : self.option('defaultWidth'),
        events: {
          show: function() {
            // 隐藏其他
            queue.getFiles().forEach(function(queueFile) {
              queueFile.setting &&
                queueFile.setting.is(':visible') &&
                queueFile.setting.hide();
            });
            queue.batch.$('span').attr('class', 'fa fa-check-square-o');
          },
          hide: function() {
            queue.batch.$('span').attr('class', 'fa fa-square-o');
          }
        },
        filterData: self.calQueueFilterData(),
        hasLink: self.option('hasLink'),
        hasWatermark: self.option('hasWatermark'),
        insert: function() {
          this.container.after(this.element);
        }
      });
    },

    initFileFormData: function() {
      var self = this;
      // from File
      self.on('formData', function(e) {
        var queueFile = e.target,
          formData = queueFile.formData,
          settings = self.queue.setting.is(':visible') ?
            self.queue.setting.get() :
            queueFile.setting.get();

        if (settings) {
          if (settings.tags) {
            formData.append('tags', settings.tags);
          }
          if (settings.remark) {
            formData.append('remark', settings.remark);
          }
        }
      });
    },

    initFileSetting: function(file) {
      var self = this,
        queue = self.queue;

      file.setting = new Setting({
        container: queue.element,
        defaultWidth : self.option('defaultWidth'),
        events: {
          show: function() {
            // queue.element.addClass('short');
            // 隐藏其他
            queue.getFiles().forEach(function(queueFile) {
              (queueFile !== file) &&
                queueFile.setting &&
                queueFile.setting.is(':visible') &&
                queueFile.setting.hide();
            });
            file.element.addClass('active');
          },
          hide: function() {
            // queue.element.removeClass('short');
            file.element.removeClass('active');
          }
        },
        filterData: file.data(),
        hasLink: self.option('hasLink'),
        hasWatermark: self.option('hasWatermark'),
        insert: function() {
          this.container.after(this.element);
        }
      });

      file.initDelegates({
        'click': function() {
          if (queue.setting.is(':hidden')) {
            if (file.setting.is(':hidden')) {
              file.setting.show();
            } else {
              file.setting.hide();
            }
          }
        }
      });
    },

    calQueueFilterData: function() {
      var queue = this.queue,
        width = 1e6,
        height = 1e6;

      queue.getFiles().forEach(function(queueFile) {
        var data = queueFile.data();
        width = Math.min(width, data.width);
        height = Math.min(height, data.height);
      });

      return {
        width: width,
        height: height
      };
    },

    setQueueFilterData: function() {
      this.queue.setting.filter(this.calQueueFilterData());
    }

  });

  module.exports = ProcessUpload;

});
