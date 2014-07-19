define(function (require, exports, module) {

/**
 * 文件上传，HTML5 ONLY
 *
 * @module Upload
 */

'use strict';

var Widget = require('widget');

var File = require('./file');

/**
 * Queue
 *
 * @class Queue
 * @constructor
 */
var Queue = Widget.extend({

  type: 'Queue',

  defaults: {
    classPrefix: 'queue'
  },

  setup: function () {
    this.render();

    this.queueFiles = [];
  },

  append: function (file) {
    this.queueFiles.push(initFile(file, this));

    /**
     * 通知队列文件插入
     *
     * @event queue
     * @param {Object} e Event.
     */
    this.fire('queue');
  },

  remove: function (queueFile) {
    var index;

    if (!this.queueFiles) {
      return;
    }

    if ((index = this.queueFiles.indexOf(queueFile)) !== -1) {
      this.queueFiles.splice(index, 1);

      // queueFile.destroy();

      // this.fire('dequeue');

      /**
       * 通知队列文件清空
       *
       * @event empty
       * @param {Object} e Event.
       */
      this.queueFiles.length || this.fire('empty');
    }
  },

  empty: function (queueFile) {

    this.queueFiles.forEach(function (queueFile) {
      queueFile.destroy();
    });

    this.queueFiles = [];

    this.fire('empty');
  },

  submit: function () {
    // 等待上传
    this.getQueuedFiles().forEach(function (queueFile) {
      queueFile.submit();
    });
    // 上传失败，重新上传
    this.getErrorFiles().forEach(function (queueFile) {
      queueFile.submit();
    });
  },

  getFiles: function (filter) {
    return filter ? this.queueFiles.filter(filter) : this.queueFiles;
  },

  getFilesByState: function (state) {
    return this.getFiles(function (queueFile) {
      return queueFile.state() === state;
    });
  },

  getQueuedFiles: function () {
    return this.getFilesByState(File.QUEUED);
  },

  getProgressFiles: function () {
    return this.getFilesByState(File.PROGRESS);
  },

  getCompleteFiles: function () {
    return this.getFilesByState(File.COMPLETE);
  },

  getErrorFiles: function () {
    return this.getFilesByState(File.ERROR);
  }

});

function initFile (file, queue) {
  return new File({
    container: queue.element,
    events: {
      all: function () {
        // 事件传递
        queue.fire.apply(queue, arguments);
      },
      destroy: function () {
        queue.remove(this);
      }
    },
    file: file,
    fileName: queue.option('fileName'),
    url: queue.option('url')
  });
}

module.exports = Queue;

});
