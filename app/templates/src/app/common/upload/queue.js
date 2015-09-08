define(function(require, exports, module) {

  /**
   * 文件上传，HTML5 ONLY
   *
   * @module Upload
   */

  'use strict';

  var Widget = require('widget');

  var DragDrop = require('../dragdrop/dragdrop'),
    dom = require('../dom');

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
      classPrefix: 'queue',
      sortable: true
    },

    setup: function() {
      this.render();

      this.queueFiles = [];

      if (this.option('sortable')) {
        this.initSort();
      }
    },

    initSort: function() {
      var self = this;

      new DragDrop({
        delegates: {
          'dragstart {{selector0}}': 'dragStart',
          'dragenter {{selector1}}': 'dragEnter',
          'dragover {{selector1}}': 'dragOver',
          'dragleave {{selector1}}': 'dragLeave',
          'drop {{selector1}}': 'drop',
          'dragend': 'dragEnd'
        },
        dragEffect: 'move',
        dropEffect: 'move',
        element: self.element,
        events: {
          dragStart: function(e) {
            this.dragTarget.classList.add('drag-active');
          },
          dragEnter: function(e) {
            this.dropTarget.classList.add('drop-active');
          },
          // dragOver: function(e) {
          // },
          dragLeave: function(e) {
            this.dropTarget.classList.remove('drop-active');
          },
          drop: function(e) {
            dom(this.dragTarget).swap(this.dropTarget);
          },
          dragEnd: function(e) {
            this.dragTarget && this.dragTarget.classList.remove('drag-active');
            this.dropTarget && this.dropTarget.classList.remove('drop-active');
          }
        },
        getGravity: false,
        selector0: '.file',
        selector1: '.file'
      });
    },

    append: function(file) {
      var index, caret;

      // 实现排序
      if (this.option('sortable')) {
        this.queueFiles.some(function(queueFile, i) {
          if (file.name >= queueFile.data('name')) {
            index = i;
            caret = queueFile;
            return true;
          }
          return false;
        });
      }

      if (index >= 0) {
        this.queueFiles.splice(index, 0, initFile(file, this, caret));
      } else {
        this.queueFiles.push(initFile(file, this));
      }

      /**
       * 通知队列文件插入
       *
       * @event queue
       * @param {Object} e Event.
       */
      this.fire('queue');
    },

    remove: function(queueFile) {
      var index;

      if (!this.queueFiles) {
        return;
      }

      if ((index = this.queueFiles.indexOf(queueFile)) !== -1) {
        this.queueFiles.splice(index, 1);

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

    empty: function(queueFile) {
      this.queueFiles.forEach(function(queueFile) {
        queueFile.destroy();
      });
    },

    submit: function() {
      // 等待上传
      this.getQueuedFiles().forEach(function(queueFile) {
        queueFile.submit();
      });
      // 上传失败，重新上传
      this.getErrorFiles().forEach(function(queueFile) {
        queueFile.submit();
      });
    },

    getFiles: function(filter) {
      return filter ? this.queueFiles.filter(filter) : this.queueFiles;
    },

    getFilesByState: function(state) {
      return this.getFiles(function(queueFile) {
        return queueFile.state() === state;
      });
    },

    getQueuedFiles: function() {
      return this.getFilesByState(File.QUEUED);
    },

    getProgressFiles: function() {
      return this.getFilesByState(File.PROGRESS);
    },

    getCompleteFiles: function() {
      return this.getFilesByState(File.COMPLETE);
    },

    getErrorFiles: function() {
      return this.getFilesByState(File.ERROR);
    }

  });

  function initFile(file, queue, caret) {
    return new File({
      attr: {
        // 可拖动
        draggable: queue.option('sortable')
      },
      container: queue.element,
      events: {
        all: function() {
          // 事件传递
          queue.fire.apply(queue, arguments);
        },
        destroy: function() {
          queue.remove(this);
        }
      },
      file: file,
      fileName: queue.option('fileName'),
      insert: function() {
        if (caret) {
          this.element.insertBefore(caret.element);
        } else {
          this.container.append(this.element);
        }
      },
      url: queue.option('url')
    });
  }

  module.exports = Queue;

});
