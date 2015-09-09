define(function(require, exports, module) {

  /**
   * 文件上传，HTML5 ONLY
   *
   * @module Upload
   */

  'use strict';

  var Widget = require('widget');

  var XHR = require('../xhr');

  var Progress = require('./progress');

  /**
   * File
   *
   * @class File
   * @extends {Class} Widget
   * @constructor
   */
  var File = Widget.extend({

    type: 'File',

    defaults: {
      classPrefix: 'file',
      // element: '<div data-role="file"></div>',
      delegates: {
        'click [data-role=remove]': 'destroy'
      },
      fileName: 'fileName',
      // 模板
      template: require('./file.handlebars')
    },

    setup: function() {
      var self = this,
        file = self.option('file');

      self.data({
        name: file.name,
        size: convertSize(file.size)
      });

      self.render();

      self.initProgress();

      self.state(File.QUEUED);

      // 自动上传
      // self.submit();
    },

    initProgress: function() {
      var self = this;

      self.progress = new Progress({
        container: self.element,
        content: ''
      });
    },

    initXHR: function() {
      var self = this;

      self.xhr = new XHR({
        url: self.option('url'),
        enctype: XHR.ENC_MULTI,
        events: {
          progress: function(e, ratio) {
            self.state(File.PROGRESS);
            self.progress.set(ratio);

            self.fire('progress', ratio);
          },
          done: function(e, data) {
            self.data(data);

            self.state(File.COMPLETE);
            self.progress.done('上传完成');
            self.role('remove').hide();
            self.fire('done');
          },
          fail: function(e, error) {
            self.state(File.ERROR);
            self.progress.fail(error);

            // 处理针对 文件管理的出错
            self.fire('fail', self.progress.element.parent(), error);
          }
        }
      });
    },

    makeFormData: function() {
      var self = this;

      self.formData = new FormData();
      self.formData.append(self.option('fileName'), self.option('file'));

      self.fire('formData');
    },

    submit: function() {
      var self = this;

      if (!self.xhr) {
        self.initXHR();
      }

      self.makeFormData();

      self.xhr.submit(self.formData);
    },

    destroy: function(e) {
      e && e.stopPropagation();

      if (this.xhr) {
        this.xhr.destroy();
      }

      if (this.progress) {
        this.progress.destroy();
      }

      File.superclass.destroy.apply(this);
    }

  });

  function convertSize(size) {
    var mb = parseInt(size / (1024 * 1024), 10);
    var kb = parseInt(size / 1024, 10);
    var ret;

    if (mb >= 1) {
      ret = mb + 'MB';
    } else if (kb >= 1) {
      ret = kb + 'KB';
    } else {
      ret = size + 'B';
    }

    return ret;
  }

  // File.INITED     = -1; // 初始状态
  File.QUEUED = 0; // 已经进入队列, 等待上传
  File.PROGRESS = 1; // 上传中
  File.COMPLETE = 2; // 上传完成
  File.ERROR = 3; // 上传出错，可重试
  // File.INTERRUPT  = 4;  // 上传中断，可续传
  // File.INVALID    = 5;  // 文件不合格，不能重试上传。会自动从队列中移除
  // File.CANCELLED  = 6;  // 文件被移除

  module.exports = File;

});
